import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useStore } from '/@/store';

import {
  Box,
  Button,
  VStack,
} from '@chakra-ui/react';

import {
  clamp,
  EulerArray,
} from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import { useZeroOrientationFromBufferAfterADelay } from '../hand-os/Filters';
import {
  DoubleHardShort,
  HapticInternal,
  SingleHardShort,
} from './haptics/HapticLibrary';
import { Haptic } from './haptics/haptics-common';

const HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT = { min: 1, max: 160 };
const ThresholdsForMotionHapticFeedback = { min: 0.45, max: 0.55 };
const ThresholdsToIncrement = { min: 0.08, max: 0.92 };
// const SliderMoveIncrement = 0.01;
const MotionHapticDuration = 100;
const intervalPerEvent = Math.floor(1000.0 / 30);

const generateRealTimeHapticFromNormal = (normalized: number) :Haptic|undefined => {

  if (normalized <= ThresholdsForMotionHapticFeedback.min) {
    return {
      intensities: [
        0,
        Math.floor((((ThresholdsForMotionHapticFeedback.min - normalized) / ThresholdsForMotionHapticFeedback.min)) * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max),

      ],
      pattern: [0, intervalPerEvent],
    };
  } else if (normalized >= ThresholdsForMotionHapticFeedback.max) {
    return {
      intensities: [
        0,
        Math.floor(((normalized - ThresholdsForMotionHapticFeedback.max) / (1 - ThresholdsForMotionHapticFeedback.max)) * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max),

      ],
      pattern: [0, intervalPerEvent],
    };
  }
};

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

// const DelayUntilNextIncrement = 1000;
const tolerance = 0.03;
const bufferSize = 30;

/**
 * Left/Right switch, no physics, just haptic feedback
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const LeftRightSwitchNoPhysics: React.FC<{
  // [-1 | 1]
  setIncrement: (inc: number) => void;
}> = ({ setIncrement }) => {
  const yawNormalized = useRef<number>(0.5);
  const accelerationZ = useRef<number>(0);
  const [randToReset, setRandToReset]  = useState<number>(0);

  const deviceIO = useStore(
    (state) => state.deviceIO
  );

  const metaframeOutputs = useStore(
    (state) => state.metaframeOutputs
  );

  useEffect(() => {
    if (!deviceIO) {
      return;
    }
    const disposers: (() => void)[] = [];

    const intervalAllowedForSettingBaseline = 1500;
    const processOrientation = useZeroOrientationFromBufferAfterADelay({bufferSize, tolerance, intervalAllowedForSettingBaseline});

    // Send a gradually decreasing haptic to indicate the user should set the baseline
    // this would be better if it were not smooth
    deviceIO.haptics.dispatch(new HapticInternal().appendSmooth({duration:intervalAllowedForSettingBaseline, startHaptic: 155, endHaptic: 0, divisions: Math.floor(20) }).haptic);

    const bindingAccelerometer = deviceIO.userAccelerometer.add((acceleration: EulerArray) => {
      accelerationZ.current = Math.max(...acceleration);
    });
    disposers.push(() => deviceIO.userAccelerometer.detach(bindingAccelerometer));

    const bindingOrientation = deviceIO.userOrientation.add((rawOrientation: EulerArray) => {
      let { orientation } = processOrientation(rawOrientation);
      let yaw: number  = orientation[0];

      yaw = Math.max(Math.min(yaw, 1), -1);
      yawNormalized.current = 1- (yaw + 1) / 2;
      if (yawNormalized.current > ThresholdsToIncrement.max) {
        metaframeOutputs.dispatch({"single-pole-doublethrow-switch": 1});
        deviceIO.haptics.dispatch(DoubleHardShort);
        setRandToReset(Math.random());
      } else if (yawNormalized.current < ThresholdsToIncrement.min) {
        metaframeOutputs.dispatch({"single-pole-doublethrow-switch": -1});
        deviceIO.haptics.dispatch(SingleHardShort);
        setRandToReset(Math.random());
      } else {
        const maybeHaptic = generateRealTimeHapticFromNormal(yawNormalized.current);
        if (maybeHaptic) {
          deviceIO.haptics.dispatch(maybeHaptic);
        }
      }
    });
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [deviceIO, yawNormalized, metaframeOutputs, randToReset]);

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
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${yawNormalized.current}`, 2, 16);
    },
    [yawNormalized]
  );

  const reset = useCallback(() => {
    setRandToReset(Math.random());
  }, [setRandToReset]);

  return (
    <VStack align="flex-start" w="100%">
      <Button onClick={reset}>Reset</Button>
      <Box w="100%">Normalized yaw (left/right)</Box>
      <CanvasElement height={20} render={renderYawValue} />

      {/* <Box w="100%">Slider </Box> */}
      {/* <UseBaselineFromBuffer tolerance={tolerance} bufferSize={bufferSize}/> */}
    </VStack>
  );
};
