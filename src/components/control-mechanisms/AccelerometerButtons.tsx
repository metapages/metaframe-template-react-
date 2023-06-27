import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  VStack,
} from '@chakra-ui/react';
import { useMetaframe } from '@metapages/metaframe-hook';

import { EulerArray } from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import { createAbsoluteAccelerationFilter } from '../hand-os/Filters';
import { TapDirection } from '../hand-os/MenuModel';

const directionMap:Map<number, TapDirection> = new Map();
directionMap.set(-1, "forward");
directionMap.set(1, "back");
directionMap.set(3, "left");
directionMap.set(-3, "right");

/**
 * Use taps etc of the accelerometer to have buttons
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const AccelerometerButtons: React.FC<{
  onDirection: (d: TapDirection) => void;
}> = ({ onDirection }) => {

  const metaframeObject = useMetaframe();
  const accelerationButtonRef  = useRef<number>(0);
  const [lastDirection, setLastDirection] = useState<string>("");

  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];
    const tapBufferInterval = 30;
    const tolerance = 20;
    const bufferSize = 30;
    const accelerometerButtonDetect = createAbsoluteAccelerationFilter({bufferSize, tolerance, tapBufferInterval});

    disposers.push(
      metaframe.onInput("ua", (acceleration: EulerArray) => {
        const acceleromterButton = accelerometerButtonDetect(acceleration);
        if (accelerationButtonRef.current !== acceleromterButton && acceleromterButton !== 0) {
          const direction = directionMap.get(acceleromterButton);
          if (direction) {
            onDirection(direction);
            setLastDirection(direction);
          }
        }
        accelerationButtonRef.current = acceleromterButton;
      }),
    );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [metaframeObject?.metaframe, onDirection, setLastDirection]);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${accelerationButtonRef.current}`, 2, 16);
    },
    [accelerationButtonRef]
  );

  return (
    <VStack align="flex-start" w="100%">
      <Box w="100%">Accelerometer Button</Box>
      <CanvasElement height={20} render={render} />
      <Box>Last direction: {lastDirection}</Box>
    </VStack>
  );
};
