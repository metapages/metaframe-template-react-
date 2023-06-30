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
  clamp,
  EulerArray,
  getAbsoluteDifferenceAngles,
  Tau,
} from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import { useZeroOrientationFromBuffer } from '../hand-os/Filters';

const ThresholdsToMoveSlider = { min: 0.2, max: 0.8 };
const SliderMoveIncrement = 0.01;


/**
 * Rotary switch, no physics, just haptic feedback
 * But dial moves at a constant speed (no physics) base on if the yaw is left or right of the baseline
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const RotaryConstantSpeedSwitchNoPhysics: React.FC<{
  steps: number;
  startStep?: number;
  setStep: (step: number) => void;
}> = ({ setStep, steps = 5, startStep = 0 }) => {
  const sliderNormalized = useRef<number>(0);
  // const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const yawNormalized = useRef<number>(0.5);
  const rollNormalized = useRef<number>(0);
  // const distanceFromStepNormalized = useRef<number>(0);
  // const metaframeObject = useMetaframe();

  const deviceIO = useStore(
    (state) => state.deviceIO
  );


  const stepRef = useRef<number>(startStep);
  const [stepState, setStepState] = useState<number>(startStep);
  const [actuallySelectedStep, setActuallySelectedStep] = useState<number>(startStep);

  useEffect(() => {
    // const metaframe = metaframeObject.metaframe;
    if (!deviceIO) {
      return;
    }

    let currentStep = startStep;

    const stepInterval = 1.0 / steps;
    const stepValues: number[] = [...Array(steps - 1), 1.0].map(
      (_, i) => i * stepInterval + stepInterval
    );
    // const stepValuesForDistanceCompute = [...Array(steps - 1)].map(
    //   (_, i) => i * stepInterval + stepInterval
    // );

    // let timeSinceLastStep = Date.now();
    // let timeSinceLastHaptic = Date.now();
    // const newStepHapticDuration = 100;
    // const feedbackHapticDuration = 10;

    const sliderHapticDuration = 100;
    let sliderIsHapticRunning = false;
    let sliderTimeUntilHapticFinished = 0;

    const hapticSliderRun = (now: number) => {
      if (now > sliderTimeUntilHapticFinished - 20) {
        sliderIsHapticRunning = true;
        const haptic = {
          intensities: [0, 70],
          pattern: [0, sliderHapticDuration],
        };

        // console.log("hapticSliderRun", haptic);
        // metaframe.setOutput("h", haptic);

        sliderTimeUntilHapticFinished = now + sliderHapticDuration;
      }
    };

    // core logic:
    // if yaw is left of baseline, slider moves left, same with right
    const interval = setInterval(() => {
      const now = Date.now();

      if (yawNormalized.current <= ThresholdsToMoveSlider.min) {
        sliderNormalized.current -= SliderMoveIncrement;
        hapticSliderRun(now);
      } else if (yawNormalized.current >= ThresholdsToMoveSlider.max) {
        sliderNormalized.current += SliderMoveIncrement;
        hapticSliderRun(now);
      } else {
        // if (sliderIsHapticRunning) {
        //   sliderIsHapticRunning = false;
        //   console.log("haptic cancel", now);
        //   metaframe.setOutput("h", {
        //     cancel: true,
        //   });
        // }
      }
      sliderNormalized.current = clamp(sliderNormalized.current, 0, 1);
      // console.log("sliderNormalized.current", sliderNormalized.current);

      const index = stepValues.findIndex((v) => sliderNormalized.current < v);


      if (index >= 0 && index < steps && index !== stepRef.current) {
        // console.log('index', index);
        setStepState(index);

        stepRef.current = index;
        currentStep = index;


        // metaframe.setOutput("index", currentStep + 1);
        deviceIO.haptics.dispatch({
          pattern: [0, 100, 0, 100],
          intensities: [0, 100, 0, 255],
        });
        // timeSinceLastStep = now + 1000;
        // timeSinceLastStep = now;
        // timeSinceLastHaptic = now;
      } else {
        // feedback haptic
        // const distanceFromStep = stepValuesForDistanceCompute.reduce(
        //   (acc: number, current: number) => {
        //     return Math.min(Math.abs(current - sliderNormalized.current), acc);
        //   },
        //   1.0
        // );
        // const normalizedDistanceFromStep = distanceFromStep / stepInterval;
        // distanceFromStepNormalized.current = normalizedDistanceFromStep;
        // if (
        //   now - timeSinceLastHaptic > feedbackHapticDuration &&
        //   now - timeSinceLastStep > newStepHapticDuration &&
        //   normalizedDistanceFromStep < 0.2
        // ) {
        //   // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;
        //   // metaframe.setOutput(
        //   //   "distance-to-step-normalized",
        //   //   normalizedDistanceFromStep
        //   // );
        //   // timeSinceLastHaptic = now;
        //   // const amplitude = Math.floor(
        //   //   normalizedDistanceFromStep *
        //   //     HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
        //   // );
        //   // metaframe.setOutput("h", {
        //   //   pattern: [0, feedbackHapticDuration],
        //   //   amplitude: [0, amplitude],
        //   // });
        //   // metaframe.setOutput("distance-to-step", distanceFromStep);
        // }
      }
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [deviceIO, startStep, steps, setStep]);

  useEffect(() => {

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
    let initialOrientationForHandRotateSelect: number| undefined;

    const processOrientation = useZeroOrientationFromBuffer({bufferSize:30, tolerance: 6});

    const bindingOrientation = deviceIO.userOrientation.add((rawOrientation: EulerArray) => {
      let { orientation } = processOrientation(rawOrientation);

        let yaw: number  = orientation[0];
        let roll: number = orientation[1];

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
        if (rollDelta > 1.2) {
          setStep(stepRef.current);
          setActuallySelectedStep(stepRef.current);
        }


        // rollNormalized.current = (roll + (Math.PI / 2) ) / Math.PI;
        rollNormalized.current = (roll  ) / (Math.PI * 2);
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

        // // for rendering
        // // yawNormalized.current = yawNormalized;
        // const now = Date.now();

        // const index = stepValues.findIndex((v) => yawNormalized.current < v);
        // setStepState(index);
        // stepRef.current = index;

        // if (index >= 0 && index < steps && index !== currentStep) {
        //   currentStep = index;
        //   metaframe.setOutput("index", currentStep + 1);
        //   metaframe.setOutput("h", {
        //     pattern: [0, newStepHapticDuration],
        //     amplitude: [0, 255],
        //   });
        //   // timeSinceLastStep = now + 1000;
        //   timeSinceLastStep = now;
        //   timeSinceLastHaptic = now;
        // } else {
        //   // feedback haptic
        //   const distanceFromStep = stepValuesForDistanceCompute.reduce(
        //     (acc: number, current: number) => {
        //       return Math.min(Math.abs(current - yawNormalized.current), acc);
        //     },
        //     1.0
        //   );

        //   // Math.min(Math.abs(yawNormalized - stepValues[currentStep]), currentStep > 0 ? Math.abs(yawNormalized - stepValues[currentStep]) : 0);
        //   // metaframe.setOutput("distance-to-step", distanceFromStep);
        //   const normalizedDistanceFromStep = distanceFromStep / stepInterval;
        //   distanceFromStepNormalized.current = normalizedDistanceFromStep;
        //   if (
        //     now - timeSinceLastHaptic > feedbackHapticDuration &&
        //     now - timeSinceLastStep > newStepHapticDuration &&
        //     normalizedDistanceFromStep < 0.2
        //   ) {
        //     // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;

        //     metaframe.setOutput(
        //       "distance-to-step-normalized",
        //       normalizedDistanceFromStep
        //     );
        //     timeSinceLastHaptic = now;
        //     const amplitude = Math.floor(
        //       normalizedDistanceFromStep *
        //         HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
        //     );
        //     metaframe.setOutput("h", {
        //       pattern: [0, feedbackHapticDuration],
        //       amplitude: [0, amplitude],
        //     });
        //     // metaframe.setOutput("distance-to-step", distanceFromStep);
        //   }
        // }


    });
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));





    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [
    deviceIO,
    steps,
    startStep,
    setStep,
    yawNormalized,
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

  const renderSlider = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw the rect on the transformed context
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        0,
        0,
        sliderNormalized.current * ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${sliderNormalized.current}`, 2, 16);
    },
    [sliderNormalized]
  );

  return (
    <VStack align="flex-start" w="100%">
      <Box w="100%">Selected Step</Box>
      <Box w="100%">{actuallySelectedStep}</Box>
      <Box w="100%">Normalized yaw (left/right)</Box>
      <CanvasElement height={20} render={renderYawValue} />
      <Box w="100%">Slider </Box>
      <CanvasElement height={20} render={renderSlider} />
      <Box w="100%">Normalized roll (twist rotate)</Box>
      <CanvasElement height={20} render={renderRollValue} />
    </VStack>
  );
};
