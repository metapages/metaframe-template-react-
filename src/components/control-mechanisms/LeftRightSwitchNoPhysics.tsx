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
import { useMetaframe } from '@metapages/metaframe-hook';

import {
  EulerArray,
  getAbsoluteDifferenceAngles,
  rotateEulerFromBaselineQuaternion,
  Tau,
} from '../common';
import { CanvasElement } from '../generic/CanvasElement';

const HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT = {min:1, max:200};
const ThresholdsToMoveSendIncrement = { min: 0.4, max: 0.6 };
const ThresholdsToIncrement = { min: 0.1, max: 0.9 };
// const SliderMoveIncrement = 0.01;
const createMotionHaptic = (intensity: number) => ({
  intensities: [0, Math.floor(intensity * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max)],
  pattern: [0, 100],
});
const HapticKerThunk = {
  intensities: [0, 100, 0, 255],
  pattern: [0, 100, 0, 100],
};
const MotionHapticDuration = 100;
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
  const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const yawNormalized = useRef<number>(0.5);
  const metaframeObject = useMetaframe();

  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }

    const sendHaptic = (haptic: number) => {
      metaframe.setOutput("h", haptic);
    }

    let timeUntilHapticFinished = 0;
    let timeUntilIncrementReset = 0;

    const hapticSliderRun = (now: number) => {
      if (now > timeUntilHapticFinished - 20) {
        const haptic = createMotionHaptic(1 - Math.min(1 - yawNormalized.current, yawNormalized.current));
        // console.log("hapticSliderRun", haptic);
        metaframe.setOutput("h", haptic);

        timeUntilHapticFinished = now + MotionHapticDuration;
      }
    };

    // core logic:
    const interval = setInterval(() => {
      const now = Date.now();

      if (yawNormalized.current <= ThresholdsToMoveSendIncrement.min) {
        hapticSliderRun(now);
      } else if (yawNormalized.current >= ThresholdsToMoveSendIncrement.max) {
        hapticSliderRun(now);
      }

      if (now > timeUntilIncrementReset) {


        if (yawNormalized.current <= ThresholdsToIncrement.min) {
          hapticSliderRun(now);
          timeUntilIncrementReset = now + DelayUntilNextIncrement;
        } else if (yawNormalized.current >= ThresholdsToIncrement.max) {
          hapticSliderRun(now);
          timeUntilIncrementReset = now + DelayUntilNextIncrement;
        }
      }




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
  }, [metaframeObject]);

  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
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
    let initialOrientationForHandRotateSelect: number| undefined;

    disposers.push(
      metaframe.onInput("o", (orientation: EulerArray) => {
        let yaw: number | undefined;
        let roll: number | undefined;
        if (quaternionBaseline) {
          const rotated = rotateEulerFromBaselineQuaternion(
            orientation,
            quaternionBaseline
          );
          yaw = rotated.yaw;
          // roll = rotated.roll;
          roll = rotated.pitch;

          // initialOrientationForHandRotateSelect = roll;
        } else {
          yaw = orientation[0];
          // roll = orientation[2];
          roll = orientation[1];
          // initialOrientationForHandRotateSelect = roll;
        }

        if (roll < 0) {
          roll = Tau + roll
        }
        if (roll > Math.PI * 2) {
          roll = roll - Tau;
        }
        // console.log('roll', roll);

        if (!initialOrientationForHandRotateSelect) {
          initialOrientationForHandRotateSelect = roll;
        }

        const rollDelta = getAbsoluteDifferenceAngles(roll, initialOrientationForHandRotateSelect);

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
        yaw = Math.max(Math.min(yaw, 1.0), -1.0);
        yawNormalized.current = (yaw - -1) / 2;
        yawNormalized.current = 1 - yawNormalized.current;


      })
    );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [
    metaframeObject?.metaframe,
    yawNormalized,
    quaternionBaseline,
  ]);

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
      <Box w="100%">Selected Step</Box>
      {/* <Box w="100%">{actuallySelectedStep}</Box> */}
      <Box w="100%">Normalized yaw (left/right)</Box>
      <CanvasElement height={20} render={renderYawValue} />
      <Box w="100%">Slider </Box>
    </VStack>
  );
};
