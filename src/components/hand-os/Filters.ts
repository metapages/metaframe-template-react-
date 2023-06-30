import Quaternion from 'quaternion';

import {
  EulerArray,
  rotateEulerFromBaselineQuaternion,
} from '../common';

const rad = Math.PI / 180;

const differenceOrientations = (o1: EulerArray, o2: EulerArray) => {
  const diff = [
    Math.abs(Math.min(o1[0] - o2[0], o2[0] - o1[0])),
    Math.abs(Math.min(o1[1] - o2[1], o2[1] - o1[1])),
    Math.abs(Math.min(o1[2] - o2[2], o2[2] - o1[2])),
  ];

  return diff[0] + diff[1] + diff[2];
};

// If you pause for a second, the baseline orientation will
// be the average of the last 30 orientations
export const useZeroOrientationFromBuffer = (args: {
  bufferSize: number;
  // mean: how much to consider "not moving"
  // holding it still is 0.12-0.13
  tolerance?: number;
  // if you reset the baseline, wait this long before
  // checking again, otherwise small pauses cause a reset
  // when you are just pausing, not waiting to reset
  timeDelayRecheckBaselineAfterSetting?: number;
}) => {
  const {
    bufferSize,
    tolerance = 0.14,
    timeDelayRecheckBaselineAfterSetting = 1500,
  } = args;
  const orientationBuffer: EulerArray[] = [...Array(bufferSize)].map((_) => [
    0, 0, 0,
  ]);
  let orientationBufferIndex = 0;
  let orientationBufferDifferences: number[] = [...Array(bufferSize)].map(
    (_) => 0
  );
  let sumOrientationBufferDifferences = 0;
  let meanOrientationBufferDifferences = 0;
  let overallMax = 0;

  const processOrientationStream = (o1: EulerArray) => {
    orientationBuffer[orientationBufferIndex] = o1;
    // the previous one
    const o2 =
      orientationBufferIndex === 0
        ? orientationBuffer[bufferSize - 1]
        : orientationBuffer[orientationBufferIndex - 1];
    const diff = differenceOrientations(o1, o2);
    const prevDifference = orientationBufferDifferences[orientationBufferIndex];
    orientationBufferDifferences[orientationBufferIndex] = diff;
    // this way we don't have to compute the entire thing every update
    sumOrientationBufferDifferences += diff - prevDifference;
    overallMax = Math.max(sumOrientationBufferDifferences, overallMax);
    meanOrientationBufferDifferences =
      sumOrientationBufferDifferences / bufferSize;
    orientationBufferIndex++;
    if (orientationBufferIndex === bufferSize) {
      orientationBufferIndex = 0;
    }
  };

  let baselineQuaternion: Quaternion | undefined;
  let setIntervalId: number | undefined;
  let isTakingAPauseAfterMovingEnough = false;
  let setBaselineQuaternion = false;

  return (orientation: EulerArray) => {
    setBaselineQuaternion = false;
    // console.log(`meanOrientationBufferDifferences=${meanOrientationBufferDifferences} tolerance=${tolerance} pause=${isTakingAPauseAfterMovingEnough}`);
    processOrientationStream(orientation);

    if (!isTakingAPauseAfterMovingEnough) {
      if (meanOrientationBufferDifferences < tolerance) {
        // then use the current as the baseline
        var q = Quaternion.fromEuler(
          orientation[0] * rad,
          orientation[1] * rad,
          orientation[2] * rad,
          "ZXY"
        );
        baselineQuaternion = q;
        setBaselineQuaternion = true;
        // console.log(`🐸 new baselineQuaternion ${new Date().getTime()}`);
      } else {
        if (!setIntervalId) {
          isTakingAPauseAfterMovingEnough = true;
          setIntervalId = setInterval(() => {
            isTakingAPauseAfterMovingEnough = false;
            clearInterval(setIntervalId);
            setIntervalId = undefined;
          }, timeDelayRecheckBaselineAfterSetting);
        }
      }
    }

    if (baselineQuaternion) {
      const rotated = rotateEulerFromBaselineQuaternion(
        orientation,
        baselineQuaternion
      );
      // orientation = [rotated.pitch, rotated.roll, rotated.yaw];
      // this is the order that the phone sends for user orientation
      orientation = [rotated.yaw, rotated.pitch, rotated.roll];
    }

    return {
      meanOrientationBufferDifferences,
      overallMax,
      orientation,
      newBaselineQuaternion: setBaselineQuaternion,
      takingABreak: isTakingAPauseAfterMovingEnough,
    };
  };
};

// All times are in seconds unless otherwise specified
export type TapArgs = {
  // default 60
  eventsPerSecond?: number;
  // When the threshold is reached, how much of the time buffer
  // before and after to use for the tap calculation
  timeBufferWindowOnThreshold?: number;
  // what is considered a "tap"
  toleranceAccelerationMax?: number;
  // what is considered a "tap"
  toleranceDisplacement?: number;
  // tap buffer delay before considering another tap
  tapBufferInterval?: number;
  // acceleration event index for measuring the tap
};
type ButtonTap = number;

// The SAME array is returned so check for changes, do not
// assume a new array. Is this worth it? Am I over-optimizing?
type TapResult = [
  ButtonTap,
  EulerArray[]
];

// Create accelerometer button taps
export const createAbsoluteAccelerationFilter = (
  args: TapArgs
): ((acceleration: EulerArray) => TapResult) => {
  const {
    // This is hard-coded in the iOS Superslides app
    eventsPerSecond = 30,
    // emperical checking says 1/6 of a second is the minimum needed time window to get
    // all the acceleration data needed to calculate a tap
    timeBufferWindowOnThreshold = 1.0 / 6,
    // emperical checking this value is what should trigger a tap
    toleranceAccelerationMax = 20,
    // is this still needed?
    // toleranceDisplacement = 23,
    // how long to wait before considering another tap?
    // start high then work down
    tapBufferInterval = 0.5,
  } = args;
  const BufferSize = Math.floor(timeBufferWindowOnThreshold * eventsPerSecond);
  const Buffer: EulerArray[] = new Array(BufferSize).fill([0, 0, 0]);
  const ResultReturned: TapResult = [0, Buffer]; // re-use for efficiency
  let bufferIndex = 0;
  // after a tap, wait a bit before considering another tap
  let stepsBeforeConsideredTap = 0;

  // after a tap is detected, wait this many events before considering another tap
  const TapBufferIntervalSteps = Math.floor(
    tapBufferInterval * eventsPerSecond
  );

  // after a tap threshold is reached, wait a bit to capture the full event buffer
  // because sometimes the first direction is not the "actual" direction due to
  // the sudden stop motion
  const TotalEventsUntilTapBufferIsChecked = Math.floor(BufferSize / 2);
  let eventsUntilTapBufferIsChecked = 0;

  return (acceleration: EulerArray) => {
    // always add the acceleration to the buffer
    Buffer[bufferIndex] = acceleration;
    bufferIndex = bufferIndex === BufferSize - 1 ? 0 : bufferIndex + 1;
    // countdowns
    stepsBeforeConsideredTap = Math.max(0, stepsBeforeConsideredTap - 1);
    const checkBuffer = eventsUntilTapBufferIsChecked === 1;
    eventsUntilTapBufferIsChecked = Math.max(
      0,
      eventsUntilTapBufferIsChecked - 1
    );

    // we already tapped recently, so don't consider another tap
    if (stepsBeforeConsideredTap > 0) {
      // console.log(`🐸 returning stepsBeforeConsideredTap ${stepsBeforeConsideredTap}`);
      return ResultReturned;
    }

    // set to zero by default
    ResultReturned[0] = 0;

    // are we already waiting for the tap buffer to fill so we can check?
    if (eventsUntilTapBufferIsChecked > 0) {
      // console.log(`🐸 returning eventsUntilTapBufferIsChecked ${eventsUntilTapBufferIsChecked}`);
      return ResultReturned;
    }

    if (checkBuffer) {
      // console.log(`🐸 checkBuffer ${new Date().getTime()}`);
      let highestOrLowestAll = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        let windowIndex = bufferIndex - Math.floor(BufferSize * 0.66);
        if (windowIndex < 0) {
          windowIndex = BufferSize + windowIndex;
        }
        let steps = 0;
        let sum = 0;
        let highestOrLowest = 0;
        while (steps < BufferSize) {
          steps++;
          sum += Buffer[windowIndex][i];
          if (Math.abs(Buffer[windowIndex][i]) > Math.abs(highestOrLowest)) {
            highestOrLowest = Buffer[windowIndex][i];
          }
        }
        if (Math.abs(highestOrLowest) > toleranceAccelerationMax) {
          // tap detected!
          // console.log(`💮 tap detected! ${i} ${highestOrLowest}`)
          highestOrLowestAll[i] = highestOrLowest;
        }
      }
      // console.log('highestOrLowestAll', highestOrLowestAll);
      let highestIndex = 0;
      for (let i = 1; i < 3; i++) {
        if (
          Math.abs(highestOrLowestAll[i]) > Math.abs(highestOrLowestAll[i - 1])
        ) {
          highestIndex = i;
        }
      }

      // const highestIndex = highestOrLowestAll.indexOf(Math.max(...highestOrLowestAll.map(Math.abs)));
      // console.log('highestIndex', highestIndex);
      ResultReturned[0] =
        highestOrLowestAll[highestIndex] > 0
          ? highestIndex + 1
          : -(highestIndex + 1);
      // wait until some time before considering another tap
      stepsBeforeConsideredTap = TapBufferIntervalSteps;
    } else {
      // check if we have reached the threshold, it begins accretion of the buffer
      for (let i = 0; i < 3; i++) {
        // check if we are over the threshold
        if (Math.abs(acceleration[i]) >= toleranceAccelerationMax) {
          // console.log(`🐸 threshold reached ${i} ${acceleration[i]} eventsUntilTapBufferIsChecked = ${TotalEventsUntilTapBufferIsChecked}`);
          // this triggers, we can break out now since we are going to wait for the buffer to fill
          eventsUntilTapBufferIsChecked = TotalEventsUntilTapBufferIsChecked;
          break;
        }
      }
    }
    return ResultReturned;
  };
};
