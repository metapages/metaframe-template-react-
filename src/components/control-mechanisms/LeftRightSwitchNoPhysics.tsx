import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useStore } from '/@/store';

import {
  Box,
  VStack,
} from '@chakra-ui/react';

import {
  clamp,
  EulerArray,
  getAbsoluteDifferenceAngles,
  Tau,
} from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import { useZeroOrientationFromBuffer } from '../hand-os/Filters';
import { AccelerometerButtons } from './AccelerometerButtons';
import { Haptic } from './haptics/haptics-common';
import { UseBaselineFromBuffer } from './UseBaselineFromBuffer';

const HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT = { min: 1, max: 130 };
const ThresholdsForMotionHapticFeedback = { min: 0.4, max: 0.6 };
const ThresholdsToIncrement = { min: 0.1, max: 0.9 };
// const SliderMoveIncrement = 0.01;
const MotionHapticDuration = 100;
const createMotionHaptic = (intensity: number, max: number = 10) => {
  // console.log('createMotionHaptic intensity', intensity);
  const scaledIntensity = clamp(Math.abs(intensity), 0, max);
  // console.log('scaledIntensity', scaledIntensity);
  const normalizedIntensity = scaledIntensity / max;
  // console.log('normalizedIntensity', normalizedIntensity);
  const hapticIntensity = Math.floor(normalizedIntensity * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max);
  // console.log('z`createMotionHaptic hapticIntensity', hapticIntensity);
  return {
    intensities: [
      0,
      200,
      // hapticIntensity,
    ],
    pattern: [0, MotionHapticDuration],
  };
};
const HapticKerThunk = {
  intensities: [0, 100, 0, 255],
  pattern: [0, 100, 0, 100],
};

const DelayUntilNextIncrement = 1000;

/**
 * Left/Right switch, no physics, just haptic feedback
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const LeftRightSwitchNoPhysics: React.FC<{
  // [-1 | 1]
  setIncrement: (inc: number) => void;
}> = ({ setIncrement }) => {
  // const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const yawNormalized = useRef<number>(0.5);
  const accelerationZ = useRef<number>(0);

  const deviceIO = useStore(
    (state) => state.deviceIO
  );

  useEffect(() => {
    // const metaframe = metaframeObject.metaframe;
    if (!deviceIO) {
      return;
    }

    let timeUntilMotionHapticFinished = 0;
    let timeUntilIncrementHapticFinished = 0;

    const sendHaptic = (haptic: Haptic) => {
      deviceIO.haptics.dispatch(haptic);
      // metaframe.setOutput("h", haptic);
    };
    const cancelHaptic = () => {
      deviceIO.haptics.dispatch({ cancel: true });
      // metaframe.setOutput("h", { cancel: true });
    };

    // const hapticMotionFeedback = (now: number) => {
    //   if (now > timeUntilMotionHapticFinished - 20) {
    //     sendHaptic(
    //       createMotionHaptic(
    //         1 - Math.min(1 - yawNormalized.current, yawNormalized.current)
    //       )
    //     );
    //     timeUntilMotionHapticFinished = now + MotionHapticDuration;
    //   }
    // };

    let timeUntilAccelerationHapticFinished = 0;

    const hapticMotionAccelerationFeedback = (
      now: number,
      acceleration: number
    ) => {
      if (now > timeUntilAccelerationHapticFinished) {
        sendHaptic(createMotionHaptic(acceleration));
        timeUntilAccelerationHapticFinished = now + MotionHapticDuration;
      }
    };

    // core logic:
    // let currentMaxAcceleration = 1;
    const interval = setInterval(() => {
      const now = Date.now();

      // console.log('accelerationZ.current', accelerationZ.current);
      // currentMaxAcceleration = Math.max(
      //   currentMaxAcceleration,
      //   accelerationZ.current
      // );
      // console.log("currentMaxAcceleration", currentMaxAcceleration);
      // hapticMotionFeedback(now);
      // hapticMotionAccelerationFeedback(now, accelerationZ.current);

      // increment?
      // if (now >= timeUntilIncrementHapticFinished) {

      //     // play motion haptic?
      //   if (yawNormalized.current <= ThresholdsForMotionHapticFeedback.min) {
      //     hapticMotionFeedback(now);
      //   } else if (yawNormalized.current >= ThresholdsForMotionHapticFeedback.max) {
      //     hapticMotionFeedback(now);
      //   }

      //   if (yawNormalized.current <= ThresholdsToIncrement.min) {
      //     // sendHaptic(HapticKerThunk);
      //     cancelHaptic();
      //     setIncrement(-1);
      //     timeUntilIncrementHapticFinished = now + DelayUntilNextIncrement;
      //   } else if (yawNormalized.current >= ThresholdsToIncrement.max) {
      //     cancelHaptic();
      //     // sendHaptic(HapticKerThunk);
      //     setIncrement(1);
      //     timeUntilIncrementHapticFinished = now + DelayUntilNextIncrement;
      //   }
      // }

      // sliderNormalized.current = clamp(sliderNormalized.current, 0, 1);

      // console.log("sliderNormalized.current", sliderNormalized.current);

      // const index = stepValues.findIndex((v) => sliderNormalized.current < v);

      // if (index >= 0 && index < steps && index !== stepRef.current) {
      //   // console.log('index', index);
      //   setStepState(index);

      //   stepRef.current = index;
      //   currentStep = index;
      //   metaframe.setOutput("index", currentStep + 1);
      //   metaframe.setOutput("h", {
      //     pattern: [0, 100, 0, 100],
      //     intensities: [0, 100, 0, 255],
      //   });
      //   // timeSinceLastStep = now + 1000;
      //   // timeSinceLastStep = now;
      //   // timeSinceLastHaptic = now;
      // } else {
      //   // feedback haptic
      //   // const distanceFromStep = stepValuesForDistanceCompute.reduce(
      //   //   (acc: number, current: number) => {
      //   //     return Math.min(Math.abs(current - sliderNormalized.current), acc);
      //   //   },
      //   //   1.0
      //   // );
      //   // const normalizedDistanceFromStep = distanceFromStep / stepInterval;
      //   // distanceFromStepNormalized.current = normalizedDistanceFromStep;
      //   // if (
      //   //   now - timeSinceLastHaptic > feedbackHapticDuration &&
      //   //   now - timeSinceLastStep > newStepHapticDuration &&
      //   //   normalizedDistanceFromStep < 0.2
      //   // ) {
      //   //   // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;
      //   //   // metaframe.setOutput(
      //   //   //   "distance-to-step-normalized",
      //   //   //   normalizedDistanceFromStep
      //   //   // );
      //   //   // timeSinceLastHaptic = now;
      //   //   // const amplitude = Math.floor(
      //   //   //   normalizedDistanceFromStep *
      //   //   //     HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
      //   //   // );
      //   //   // metaframe.setOutput("h", {
      //   //   //   pattern: [0, feedbackHapticDuration],
      //   //   //   amplitude: [0, amplitude],
      //   //   // });
      //   //   // metaframe.setOutput("distance-to-step", distanceFromStep);
      //   // }
      // }
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [deviceIO]);

  useEffect(() => {
    // const metaframe = metaframeObject.metaframe;
    if (!deviceIO) {
      return;
    }
    const disposers: (() => void)[] = [];
    // let currentStep = startStep;

    // const stepInterval = 1.0 / steps;
    // const stepValues: number[] = [...Array(steps - 1), 1.0].map(
    //   (_, i) => i * stepInterval + stepInterval
    // );
    // const stepValuesForDistanceCompute = [...Array(steps - 1)].map(
    //   (_, i) => i * stepInterval + stepInterval
    // );
    // let timeSinceLastStep = Date.now();
    // let timeSinceLastHaptic = Date.now();
    // const newStepHapticDuration = 100;
    // const feedbackHapticDuration = 10;
    //
    let initialOrientationForHandRotateSelect: number | undefined;

    // const accFilter = createAbsoluteAccelerationFilter({ bufferSize: 100 });
    const tolerance = 0.2;
    const processOrientation = useZeroOrientationFromBuffer({bufferSize:30, tolerance});

    const bindingAccelerometer = deviceIO.userAccelerometer.add((acceleration: EulerArray) => {
      accelerationZ.current = Math.max(...acceleration);
    });
    disposers.push(() => deviceIO.userAccelerometer.detach(bindingAccelerometer));

    const bindingOrientation = deviceIO.userOrientation.add((rawOrientation: EulerArray) => {
      let { orientation } = processOrientation(rawOrientation);
      let yaw: number  = orientation[0];
      // console.log(`rawOrientation[0]=${rawOrientation[0]} orientation[0]=${orientation[0]}`)
      let roll: number = orientation[1];
      // let yaw: number | undefined;
      // let roll: number | undefined;
      // if (quaternionBaseline) {
      //   const rotated = rotateEulerFromBaselineQuaternion(
      //     orientation,
      //     quaternionBaseline
      //   );
      //   yaw = rotated.yaw;
      //   // roll = rotated.roll;
      //   roll = rotated.pitch;

      //   // initialOrientationForHandRotateSelect = roll;
      // } else {
      //   yaw = orientation[0];
      //   // roll = orientation[2];
      //   roll = orientation[1];
      //   // initialOrientationForHandRotateSelect = roll;
      // }

      if (roll < 0) {
        roll = Tau + roll;
      }
      if (roll > Math.PI * 2) {
        roll = roll - Tau;
      }
      // console.log('roll', roll);

      if (!initialOrientationForHandRotateSelect) {
        initialOrientationForHandRotateSelect = roll;
      }

      const rollDelta = getAbsoluteDifferenceAngles(
        roll,
        initialOrientationForHandRotateSelect
      );

      // ((roll <= Math.PI ? roll + Tau : roll) - initialOrientationForHandRotateSelect + Tau);
      // console.log(`init=${initialOrientationForHandRotateSelect} roll=${roll} delta=${rollDelta}`);
      // if (rollDelta > 1.2) {
      //   setStep(stepRef.current);
      //   setActuallySelectedStep(stepRef.current);
      // }

      // // rollNormalized.current = (roll + (Math.PI / 2) ) / Math.PI;
      // rollNormalized.current = (roll  ) / (Math.PI * 2);
      // rollNormalized.current = roll;
      // // yaw = Math.max(Math.min(roll, 1.0), -1.0);
      // rollNormalized.current = (roll - -0) / -0.3;
      // rollNormalized.current = Math.max(
      //   Math.min(rollNormalized.current, 1.0),
      //   -1.0
      // );
      // rollNormalized.current = 1 - rollNormalized.current;

      // let's use yaw as the force
      // rotated values [ -1, 1] approx, it's like just under half a circle
      // yaw = Math.max(Math.min(yaw, 0.028), -0.028);
      // const forceNormalized = (yaw - -0.028) / (0.028 - -0.028);
      yaw = Math.max(Math.min(yaw, 1), -1);
      yawNormalized.current = 1- (yaw + 1) / 2;
      // yawNormalized.current = 1 - yawNormalized.current;
    });
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));

    // disposers.push(
    //   metaframe.onInput("ua", (acceleration: EulerArray) => {
    //     // const filteredAcceleration = accFilter(acceleration);
    //     // console.log('acceleration', acceleration);
    //     accelerationZ.current = Math.max(...acceleration);
    //     // console.log('accelerationZ.current', accelerationZ.current);
    //   }),
    //   metaframe.onInput("ao", (rawOrientation: EulerArray) => {
    //     let { orientation } = processOrientation(rawOrientation);
    //     let yaw: number  = orientation[0];
    //     // console.log(`rawOrientation[0]=${rawOrientation[0]} orientation[0]=${orientation[0]}`)
    //     let roll: number = orientation[1];
    //     // let yaw: number | undefined;
    //     // let roll: number | undefined;
    //     // if (quaternionBaseline) {
    //     //   const rotated = rotateEulerFromBaselineQuaternion(
    //     //     orientation,
    //     //     quaternionBaseline
    //     //   );
    //     //   yaw = rotated.yaw;
    //     //   // roll = rotated.roll;
    //     //   roll = rotated.pitch;

    //     //   // initialOrientationForHandRotateSelect = roll;
    //     // } else {
    //     //   yaw = orientation[0];
    //     //   // roll = orientation[2];
    //     //   roll = orientation[1];
    //     //   // initialOrientationForHandRotateSelect = roll;
    //     // }

    //     if (roll < 0) {
    //       roll = Tau + roll;
    //     }
    //     if (roll > Math.PI * 2) {
    //       roll = roll - Tau;
    //     }
    //     // console.log('roll', roll);

    //     if (!initialOrientationForHandRotateSelect) {
    //       initialOrientationForHandRotateSelect = roll;
    //     }

    //     const rollDelta = getAbsoluteDifferenceAngles(
    //       roll,
    //       initialOrientationForHandRotateSelect
    //     );

    //     // ((roll <= Math.PI ? roll + Tau : roll) - initialOrientationForHandRotateSelect + Tau);
    //     // console.log(`init=${initialOrientationForHandRotateSelect} roll=${roll} delta=${rollDelta}`);
    //     // if (rollDelta > 1.2) {
    //     //   setStep(stepRef.current);
    //     //   setActuallySelectedStep(stepRef.current);
    //     // }

    //     // // rollNormalized.current = (roll + (Math.PI / 2) ) / Math.PI;
    //     // rollNormalized.current = (roll  ) / (Math.PI * 2);
    //     // rollNormalized.current = roll;
    //     // // yaw = Math.max(Math.min(roll, 1.0), -1.0);
    //     // rollNormalized.current = (roll - -0) / -0.3;
    //     // rollNormalized.current = Math.max(
    //     //   Math.min(rollNormalized.current, 1.0),
    //     //   -1.0
    //     // );
    //     // rollNormalized.current = 1 - rollNormalized.current;

    //     // let's use yaw as the force
    //     // rotated values [ -1, 1] approx, it's like just under half a circle
    //     // yaw = Math.max(Math.min(yaw, 0.028), -0.028);
    //     // const forceNormalized = (yaw - -0.028) / (0.028 - -0.028);
    //     yaw = Math.max(Math.min(yaw, 1), -1);
    //     yawNormalized.current = 1- (yaw + 1) / 2;
    //     // yawNormalized.current = 1 - yawNormalized.current;
    //   })
    // );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [deviceIO, yawNormalized]);

  const renderYawValue = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw the rect on the transformed context
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        0,
        0,
        yawNormalized.current * ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // const stepInterval = (1.0 / steps) * ctx.canvas.width;
      // [...Array(steps), 1.0].forEach((_, index) => {
      //   ctx.rect(stepInterval + stepInterval * index, 0, 1, ctx.canvas.height);
      // });
      ctx.stroke();

      // ctx.beginPath();
      // ctx.strokeStyle = "red";
      // ctx.lineWidth = 4;
      // ctx.rect(
      //   stepInterval * stepRef.current,
      //   0,
      //   stepInterval,
      //   ctx.canvas.height
      // );
      // ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${yawNormalized.current}`, 2, 16);
    },
    [yawNormalized]
  );

  return (
    <VStack align="flex-start" w="100%">
      <AccelerometerButtons onDirection={() => {}}/>
      {/* <Box w="100%">Selected Step</Box> */}
      {/* <Box w="100%">{actuallySelectedStep}</Box> */}
      <Box w="100%">Normalized yaw (left/right)</Box>
      <CanvasElement height={20} render={renderYawValue} />
      {/* <Box w="100%">Slider </Box> */}
      <UseBaselineFromBuffer />
    </VStack>
  );
};
