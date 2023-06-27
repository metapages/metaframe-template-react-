import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  Box,
  VStack,
} from '@chakra-ui/react';
import { useMetaframe } from '@metapages/metaframe-hook';

import { EulerArray } from '../common';
import { CanvasElement } from '../generic/CanvasElement';
import { useZeroOrientationFromBuffer } from '../hand-os/Filters';

/**
 * Get the baseline orientation from the buffer
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const UseBaselineFromBuffer: React.FC = () => {

  const metaframeObject = useMetaframe();
  const meanOrientationDifferences  = useRef<number>(0);
  const maxMeanOrientationDifferences  = useRef<number>(0);
  const maxOrientationDifferences  = useRef<number>(0);
  const newBaselineQuaternionRef  = useRef<boolean>(false);
  const takingABreakRef  = useRef<boolean>(false);


  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];
    const tolerance = 0.2;
    const bufferSize = 30;
    const processOrientation = useZeroOrientationFromBuffer({bufferSize, tolerance});

    disposers.push(
      metaframe.onInput("ao", (orientation: EulerArray) => {
        const {meanOrientationBufferDifferences, overallMax, newBaselineQuaternion, takingABreak } = processOrientation(orientation);
        newBaselineQuaternionRef.current = newBaselineQuaternion;
        meanOrientationDifferences.current = meanOrientationBufferDifferences;
        takingABreakRef.current = takingABreak;
        maxMeanOrientationDifferences.current = Math.max(maxMeanOrientationDifferences.current, meanOrientationBufferDifferences);
        maxOrientationDifferences.current = overallMax;
      }),
    );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [metaframeObject?.metaframe]);

  const rendermeanOrientationDifferences = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw the rect on the transformed context
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        0,
        0,
        (meanOrientationDifferences.current / maxMeanOrientationDifferences.current) * ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(`${meanOrientationDifferences.current}`, 2, 16);
    },
    [meanOrientationDifferences]
  );

  return (
    <VStack align="flex-start" w="100%">
      <Box w="100%">Mean Orientation Diff</Box>
      <CanvasElement height={20} render={rendermeanOrientationDifferences} />
      <Box w="100%">New Baseline Quaternion: {newBaselineQuaternionRef.current ? "true" : "false"}</Box>
      <Box w="100%">Taking a break: {takingABreakRef.current ? "true" : "false"}</Box>


    </VStack>
  );
};
