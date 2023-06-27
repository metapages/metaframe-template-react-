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
  const { bufferSize, tolerance = 0.14, timeDelayRecheckBaselineAfterSetting=1500 } = args;
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
    meanOrientationBufferDifferences = sumOrientationBufferDifferences / bufferSize;
    orientationBufferIndex++;
    if (orientationBufferIndex === bufferSize - 1) {
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
        var q = Quaternion.fromEuler(orientation[0] * rad, orientation[1] * rad, orientation[2] * rad, 'ZXY');
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
    }
  };
};

type TapArgs = {
  bufferSize?: number;
  // what is considered a "tap"
  tolerance?: number;
  // tap buffer delay before considering another tap
  tapBufferInterval?: number;
};
// Create accelerometer button taps
export const createAbsoluteAccelerationFilter = (args: TapArgs) :(acceleration:EulerArray) => number => {
  const { bufferSize, tolerance = 20, tapBufferInterval = 30 } = args;
  const buffer: EulerArray[] = new Array(bufferSize).fill([0, 0, 0]);
  let bufferIndex = 0;
  // after a tap, wait a bit before considering another tap
  let stepsBeforeConsideredTap = 0;
  let currentActiveAxis = 0;
  return (acceleration: EulerArray) => {
    buffer[bufferIndex] = acceleration;
    if (stepsBeforeConsideredTap > 0) {
      stepsBeforeConsideredTap--;
    }

    // we already tapped recently, so don't consider another tap
    if (stepsBeforeConsideredTap > 0) {
      return currentActiveAxis;
    } else {
      currentActiveAxis = 0;
    }
    // ok, are we tapping?
    if (Math.abs(acceleration[0]) > tolerance) {
      // we are tapping, so wait a bit before considering another tap
      stepsBeforeConsideredTap = tapBufferInterval;
      // currentActiveAxis = acceleration[0] > 0 ? 1 : -1;
      currentActiveAxis = buffer.reduce((acc, currentAcc) => acc + currentAcc[0] > 0 ? 1 : -1, 0) > 0 ? 1 : -1;
      return currentActiveAxis;
    }
    if (Math.abs(acceleration[1]) > tolerance) {
      // we are tapping, so wait a bit before considering another tap
      stepsBeforeConsideredTap = tapBufferInterval;
      // currentActiveAxis = acceleration[1] > 0 ? 2 : -2;
      currentActiveAxis = buffer.reduce((acc, currentAcc) => acc + currentAcc[1] > 0 ? 1 : -1, 0) > 0 ? 2 : -2;
      return currentActiveAxis;
    }
    if (Math.abs(acceleration[2]) > tolerance) {
      // we are tapping, so wait a bit before considering another tap
      stepsBeforeConsideredTap = tapBufferInterval;
      // currentActiveAxis = acceleration[2] > 0 ? 3 : -3;
      currentActiveAxis = buffer.reduce((acc, currentAcc) => acc + currentAcc[2] > 0 ? 1 : -1, 0) > 0 ? 3 : -3;
      return currentActiveAxis;
    }
    return currentActiveAxis;
  };
};
