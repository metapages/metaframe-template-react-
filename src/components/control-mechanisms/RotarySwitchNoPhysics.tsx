import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useStore } from '/@/store';

import {
  Box,
  VStack,
} from '@chakra-ui/react';

import {
  EulerArray,
  rotateEulerFromBaselineQuaternion,
} from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import {
  HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT,
} from './haptics/haptics-common';

/**
 * Rotary switch, no physics, just haptic feedback
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const RotarySwitchNoPhysics: React.FC<{
  steps: number;
  startStep?: number;
  setStep: (step: number) => void;
}> = ({ setStep, steps = 5, startStep = 0 }) => {
  const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const yawNormalized = useRef<number>(0);
  const rollNormalized = useRef<number>(0);
  const distanceFromStepNormalized = useRef<number>(0);

  const deviceIO = useStore(
    (state) => state.deviceIO
  );
  const stepRef = useRef<number>(startStep);
  const [stepState, setStepState] = useState<number>(startStep);

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

      const stepInterval = (1.0 / steps) * ctx.canvas.width;
      [...Array(steps), 1.0].forEach((_, index) => {
        ctx.rect(stepInterval + stepInterval * index, 0, 1, ctx.canvas.height);
      });
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.rect(
        stepInterval * stepRef.current,
        0,
        stepInterval,
        ctx.canvas.height
      );
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${yawNormalized.current}`, 2, 16);
    },
    [yawNormalized]
  );

  const renderRollValue = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw the rect on the transformed context
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        0,
        0,
        rollNormalized.current * ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${rollNormalized.current}`, 2, 16);
    },
    [rollNormalized]
  );

  const renderDistanceFromStep = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw the rect on the transformed context
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        0,
        0,
        distanceFromStepNormalized.current * ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${distanceFromStepNormalized.current}`, 2, 16);
    },
    [distanceFromStepNormalized]
  );

  useEffect(() => {

    if (!deviceIO) {
      return;
    }
    const disposers: (() => void)[] = [];
    let currentStep = startStep;

    const stepInterval = 1.0 / steps;
    const stepValues: number[] = [...Array(steps - 1), 1.0].map(
      (_, i) => i * stepInterval + stepInterval
    );
    const stepValuesForDistanceCompute = [...Array(steps - 1)].map(
      (_, i) => i * stepInterval + stepInterval
    );
    let timeSinceLastStep = Date.now();
    let timeSinceLastHaptic = Date.now();
    const newStepHapticDuration = 100;
    const feedbackHapticDuration = 10;


    const bindingOrientation = deviceIO.userOrientation.add((orientation: EulerArray) => {
      let yaw: number | undefined;
      let roll: number | undefined;
      if (quaternionBaseline) {
        const rotated = rotateEulerFromBaselineQuaternion(
          orientation,
          quaternionBaseline
        );
        yaw = rotated.yaw;
        roll = rotated.roll;
      } else {
        yaw = orientation[0];
        roll = orientation[2];
      }


      rollNormalized.current = roll;
      // yaw = Math.max(Math.min(roll, 1.0), -1.0);
      rollNormalized.current = (roll - -0) / -0.3;
      rollNormalized.current = Math.max(Math.min(rollNormalized.current, 1.0), -1.0);
      // rollNormalized.current = 1 - rollNormalized.current;

      // let's use yaw as the force
      // rotated values [ -1, 1] approx, it's like just under half a circle
      yaw = Math.max(Math.min(yaw, 1.0), -1.0);
      yawNormalized.current = (yaw - -1) / 2;
      yawNormalized.current = 1 - yawNormalized.current;
      // for rendering
      // yawNormalized.current = yawNormalized;
      const now = Date.now();

      const index = stepValues.findIndex((v) => yawNormalized.current < v);
      setStepState(index);
      stepRef.current = index;

      if (index >= 0 && index < steps && index !== currentStep) {
        currentStep = index;
        // metaframe.setOutput("index", currentStep + 1);
        deviceIO.haptics.dispatch({
          pattern: [0, newStepHapticDuration],
          intensities: [0, 255],
        });
        // metaframe.setOutput("h", {
        //   pattern: [0, newStepHapticDuration],
        //   amplitude: [0, 255],
        // });
        // timeSinceLastStep = now + 1000;
        timeSinceLastStep = now;
        timeSinceLastHaptic = now;
      } else {
        // feedback haptic
        const distanceFromStep = stepValuesForDistanceCompute.reduce(
          (acc: number, current: number) => {
            return Math.min(Math.abs(current - yawNormalized.current), acc);
          },
          1.0
        );

        // Math.min(Math.abs(yawNormalized - stepValues[currentStep]), currentStep > 0 ? Math.abs(yawNormalized - stepValues[currentStep]) : 0);
        // metaframe.setOutput("distance-to-step", distanceFromStep);
        const normalizedDistanceFromStep = distanceFromStep / stepInterval;
        distanceFromStepNormalized.current = normalizedDistanceFromStep;
        if (
          now - timeSinceLastHaptic > feedbackHapticDuration &&
          now - timeSinceLastStep > newStepHapticDuration &&
          normalizedDistanceFromStep < 0.2
        ) {
          // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;

          // metaframe.setOutput(
          //   "distance-to-step-normalized",
          //   normalizedDistanceFromStep
          // );
          timeSinceLastHaptic = now;
          const amplitude = Math.floor(
            normalizedDistanceFromStep *
              HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
          );
          deviceIO.haptics.dispatch({
            pattern: [0, feedbackHapticDuration],
            intensities: [0, amplitude],
          });
          // metaframe.setOutput("h", {
          //   pattern: [0, feedbackHapticDuration],
          //   intensities: [0, amplitude],
          // });
          // metaframe.setOutput("distance-to-step", distanceFromStep);
        }
      }
    });
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));







    // disposers.push(
    //   metaframe.onInput("o", (orientation: EulerArray) => {
    //     let yaw: number | undefined;
    //     let roll: number | undefined;
    //     if (quaternionBaseline) {
    //       const rotated = rotateEulerFromBaselineQuaternion(
    //         orientation,
    //         quaternionBaseline
    //       );
    //       yaw = rotated.yaw;
    //       roll = rotated.roll;
    //     } else {
    //       yaw = orientation[0];
    //       roll = orientation[2];
    //     }


    //     rollNormalized.current = roll;
    //     // yaw = Math.max(Math.min(roll, 1.0), -1.0);
    //     rollNormalized.current = (roll - -0) / -0.3;
    //     rollNormalized.current = Math.max(Math.min(rollNormalized.current, 1.0), -1.0);
    //     // rollNormalized.current = 1 - rollNormalized.current;

    //     // let's use yaw as the force
    //     // rotated values [ -1, 1] approx, it's like just under half a circle
    //     yaw = Math.max(Math.min(yaw, 1.0), -1.0);
    //     yawNormalized.current = (yaw - -1) / 2;
    //     yawNormalized.current = 1 - yawNormalized.current;
    //     // for rendering
    //     // yawNormalized.current = yawNormalized;
    //     const now = Date.now();

    //     const index = stepValues.findIndex((v) => yawNormalized.current < v);
    //     setStepState(index);
    //     stepRef.current = index;

    //     if (index >= 0 && index < steps && index !== currentStep) {
    //       currentStep = index;
    //       metaframe.setOutput("index", currentStep + 1);
    //       metaframe.setOutput("h", {
    //         pattern: [0, newStepHapticDuration],
    //         amplitude: [0, 255],
    //       });
    //       // timeSinceLastStep = now + 1000;
    //       timeSinceLastStep = now;
    //       timeSinceLastHaptic = now;
    //     } else {
    //       // feedback haptic
    //       const distanceFromStep = stepValuesForDistanceCompute.reduce(
    //         (acc: number, current: number) => {
    //           return Math.min(Math.abs(current - yawNormalized.current), acc);
    //         },
    //         1.0
    //       );

    //       // Math.min(Math.abs(yawNormalized - stepValues[currentStep]), currentStep > 0 ? Math.abs(yawNormalized - stepValues[currentStep]) : 0);
    //       // metaframe.setOutput("distance-to-step", distanceFromStep);
    //       const normalizedDistanceFromStep = distanceFromStep / stepInterval;
    //       distanceFromStepNormalized.current = normalizedDistanceFromStep;
    //       if (
    //         now - timeSinceLastHaptic > feedbackHapticDuration &&
    //         now - timeSinceLastStep > newStepHapticDuration &&
    //         normalizedDistanceFromStep < 0.2
    //       ) {
    //         // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;

    //         metaframe.setOutput(
    //           "distance-to-step-normalized",
    //           normalizedDistanceFromStep
    //         );
    //         timeSinceLastHaptic = now;
    //         const amplitude = Math.floor(
    //           normalizedDistanceFromStep *
    //             HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
    //         );
    //         metaframe.setOutput("h", {
    //           pattern: [0, feedbackHapticDuration],
    //           amplitude: [0, amplitude],
    //         });
    //         // metaframe.setOutput("distance-to-step", distanceFromStep);
    //       }
    //     }
      // })
    // );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [
    deviceIO,
    steps,
    startStep,
    yawNormalized,
    quaternionBaseline,
  ]);

  return (
    <VStack align="flex-start" w="100%">
      <Box w="100%">Selected Step</Box>
      <Box w="100%">{stepState}</Box>
      <Box w="100%">Normalized yaw (left/right)</Box>
      <CanvasElement height={20} render={renderYawValue} />
      <Box w="100%">Normalized distance from step</Box>
      <CanvasElement height={20} render={renderDistanceFromStep} />
      <Box w="100%">Normalized roll (twist rotate)</Box>
      <CanvasElement height={20} render={renderRollValue} />
    </VStack>
  );
};
