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
import {
  CanvasElement,
  CanvasElementRenderValue,
} from '../generic/CanvasElement';
import { createAbsoluteAccelerationFilter } from '../hand-os/Filters';
import { TapDirection } from '../hand-os/MenuModel';

const directionMap:Map<number, TapDirection> = new Map();
directionMap.set(-1, "forward");
directionMap.set(1, "back");
directionMap.set(-2, "up");
directionMap.set(2, "down");
directionMap.set(3, "left");
directionMap.set(-3, "right");



/**
 * Use taps etc of the accelerometer to have buttons
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const AccelerometerButtons: React.FC<{
  onDirection: (d: TapDirection | undefined) => void;
}> = ({ onDirection }) => {

  const metaframeObject = useMetaframe();
  const accelerationButtonRef  = useRef<number>(0);
  const [buffer, setBuffer]  = useState<EulerArray[]>([]);
  const [lastDirection, setLastDirection] = useState<string>("");

  const EventsPerSecond = 30;
  // How long to wait (in seconds) until checking for another tap
  const TapIntervalSeconds = 0.5;
  // How long to wait (in events) until checking for another tap
  // const EventsForTapInterval = Math.floor(EventsPerSecond * TapIntervalSeconds);
  // How many events to buffer to check for tap events
  // const BufferTimeSeconds = 0.5;
  // const TapBufferSize = Math.floor(EventsPerSecond * BufferTimeSeconds);
  // Displacement tolerance for tap events
  // const ToleranceDisplacement = 3 * TapBufferSize;
  const ToleranceAccelerationMax = 15;

  // const bufferSize = 30;


  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];

    const accelerometerButtonDetect = createAbsoluteAccelerationFilter({
      eventsPerSecond: EventsPerSecond,
      // toleranceDisplacement:ToleranceDisplacement,
      toleranceAccelerationMax: ToleranceAccelerationMax,
      tapBufferInterval: TapIntervalSeconds,
      timeBufferWindowOnThreshold: 1.0 / 3,
    });
    let isBufferSet = false;

    // let eventCount = 0;
    // const eventCountInterval = setInterval(() => {
    //   console.log(`Events/s=${eventCount}`);
    //   eventCount = 0;
    // }, 1000);
    // disposers.push(() => clearInterval(eventCountInterval));

    disposers.push(
      metaframe.onInput("ua", (acceleration: EulerArray) => {
        // eventCount++;
        const [accelerometerButton, internalBuffer] = accelerometerButtonDetect(acceleration);

        if (!isBufferSet) {
          setBuffer(internalBuffer);
          isBufferSet = true;
        }
        // console.log('accelerometerButton', accelerometerButton);
        if (accelerationButtonRef.current !== accelerometerButton) {
          const direction = directionMap.get(accelerometerButton);
          // console.log('direction', direction);
          onDirection(direction);
          if (direction) {
            setLastDirection(direction);
          }
          // if (direction) {
          // }
        }
        accelerationButtonRef.current = accelerometerButton;
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
    <VStack align="flex-start" w="100%" borderWidth='1px' borderRadius='lg' p={2}>
      <Box w="100%">Accelerometer Button</Box>
      <CanvasElement height={20} render={render} />
      <Box>Last direction: {lastDirection}</Box>
      {/* <AccelerometerButtonsDiagnosis buffer={buffer} toleranceDisplacement={ToleranceDisplacement} buttonComputeTimeout={TapIntervalSeconds * 1000} /> */}
    </VStack>
  );
};

// let's see the guts of the estimation
export const AccelerometerButtonsDiagnosis: React.FC<{toleranceDisplacement:number, buttonComputeTimeout:number, buffer: EulerArray[]}> = ({toleranceDisplacement, buttonComputeTimeout, buffer,}) => {

  // count up all the accelerations, each direction
  const [accelerationSums, setAccelerationSums]  = useState<number[]>([0,0,0]);
  const [accelerationDisplacement, setAccelerationDisplacement]  = useState<number[]>([0,0,0]);
  const [accelerationMeans, setAccelerationMeans]  = useState<number[]>([0,0,0]);
  const [estimate, setEstimate]  = useState<number[]>([0,0,0]);
  const [lastDirection, setLastDirection] = useState<string>("");

  const intervalTime = 1000 / 60;
  useEffect(() => {
    let timeRemainingUntilNextButtonEstimate = [0,0,0];
    const estimateLocal = [0,0,0];

    const interval = setInterval(() => {
      const accelerationSumsLocal = [0,0,0];
      const accelerationDisplacementLocal = [0,0,0];
      const accelerationMeansLocal = [0,0,0];


      [0,1,2].forEach((i) => {
        timeRemainingUntilNextButtonEstimate[i] = Math.max(0, timeRemainingUntilNextButtonEstimate[i] - intervalTime);
        accelerationDisplacementLocal[i] = buffer.reduce((acc, currentAcc) => acc + Math.abs(currentAcc[i]), 0);
        accelerationSumsLocal[i] = buffer.reduce((acc, currentAcc) => acc + currentAcc[i], 0);
        accelerationMeansLocal[i] = accelerationSumsLocal[i] / buffer.length;
        // console.log('timeRemainingUntilNextButtonEstimate[i]', timeRemainingUntilNextButtonEstimate[i]);
        if (timeRemainingUntilNextButtonEstimate[i] <= 0) {
          // console.log("computing...")
          if (accelerationDisplacementLocal[i] > toleranceDisplacement) {
            estimateLocal[i] = (accelerationSumsLocal[i] > 0) ? (i + 1) :  -(i + 1);
            timeRemainingUntilNextButtonEstimate[i] = buttonComputeTimeout;
          } else {
            estimateLocal[i] = 0;
          }
          // console.log(`accelerationMeansLocal[${i}] > tolerance => ${accelerationMeansLocal[i]} > ${tolerance} `, accelerationMeansLocal[i] > tolerance);
          // if (estimateLocal[i] !== 0) {
          //   // console.log(`estimateLocal[${i}]`, estimateLocal[i]);

          // }
          // if (estimateLocal[i] !== 0) {
          //   timeRemainingUntilNextButtonEstimate[i] = buttonComputeTimeout;
          // }
        }
      });
      // console.log('estimateLocal', estimateLocal);
      setEstimate([...estimateLocal]);
      setAccelerationDisplacement(accelerationDisplacementLocal);
      setAccelerationMeans(accelerationMeansLocal);
      setAccelerationSums(accelerationSumsLocal);
    }, intervalTime);

    return () => {
      clearInterval(interval);
    }
  }, [toleranceDisplacement, buttonComputeTimeout, buffer, setEstimate]);


  return (
    <VStack align="flex-start" w="100%" borderWidth='1px' borderRadius='lg' p={2}>
      <Box w="100%">Accelerometer button insight</Box>
      <Box>ToleranceDisplacement: {`${toleranceDisplacement}`}</Box>
      <Box>estimate: {`${estimate}`}</Box>
      <Box>Last direction: {lastDirection}</Box>
      <Box>Acceleration Displacement</Box>
      <CanvasElementRenderValue height={20} value={accelerationDisplacement[0]} />
      <CanvasElementRenderValue height={20} value={accelerationDisplacement[1]} />
      <CanvasElementRenderValue height={20} value={accelerationDisplacement[2]} />
      <Box>Acceleration Means</Box>
      <CanvasElementRenderValue height={20} value={accelerationMeans[0]} />
      <CanvasElementRenderValue height={20} value={accelerationMeans[1]} />
      <CanvasElementRenderValue height={20} value={accelerationMeans[2]} />
      <Box>Acceleration Sums</Box>
      <CanvasElementRenderValue height={20} value={accelerationSums[0]} />
      <CanvasElementRenderValue height={20} value={accelerationSums[1]} />
      <CanvasElementRenderValue height={20} value={accelerationSums[2]} />
    </VStack>
  );
};
