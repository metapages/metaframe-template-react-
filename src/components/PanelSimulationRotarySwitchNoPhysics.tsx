import {
  useEffect,
  useRef,
} from 'react';

import { fromEuler } from 'quaternion';

import { useMetaframe } from '@metapages/metaframe-hook';

import { yawFromQuaternion } from './common';

/**
 * Rotary switch, no physics, just haptic feedback
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const PanelSimulationRotarySwitchNoPhysics: React.FC<{steps:number, startStep?:number}> = ({steps = 5, startStep = 0}) => {
  const forceRef = useRef<number>(0);
  const metaframeObject = useMetaframe();

  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];

    // const normalizer = createNormalizer(30, 1);
    // disposers.push(metaframe.onInput("input-rotation", (value: number) => {
    //   const valueNormalized = normalizer(value);
    //   forceRef.current = valueNormalized;
    // }));



    const rad = Math.PI / 180;
    const hapticInterval = 100;
    let timeLastHaptic = Date.now();

    let yaw = 0;
    // const intervalRef = setInterval(() => {
    //   if (ref?.current) {
    //     ref.current.innerText = yaw.toFixed(3);
    //   }
    // }, 200);

    let currentStep = startStep;

    const stepInterval = 1.0 / (steps);
    const stepValues :number[] = [...Array(steps - 1), 1.0].map((_, i) => i * stepInterval + stepInterval );
    const stepValuesForDistanceCompute = [...Array(steps - 1)].map((_, i) => i * stepInterval + stepInterval );
    console.log('steps', steps);
    console.log('stepValues', stepValues);
    console.log('stepValuesForDistanceCompute', stepValuesForDistanceCompute);


    const newStepHapticDuration = 100;
    const feedbackHapticDuration = 10;
    let timeSinceLastStep = Date.now();
    let timeSinceLastHaptic = Date.now();
    const newStepHapticQueue = [];

    disposers.push(
      metaframe.onInput("o", (orientation: number[]) => {
        var q = fromEuler(
          orientation[0] * rad,
          orientation[1] * rad,
          orientation[2] * rad,
          "ZXY"
        );
        // this returns values from circa [-0.02, 0.02]
        yaw = yawFromQuaternion(q);
        // console.log('yaw', yaw);
        yaw = Math.max(Math.min(yaw, 0.028), -0.028);
        let yawNormalized = (yaw - -0.028) / (0.028 - -0.028);
        yawNormalized = 1 - yawNormalized;
        // console.log('forceNormalized', forceNormalized);
        metaframe.setOutput("force", yawNormalized);
        // metaframe.setOutput("index", yawNormalized);

        const now = Date.now();

        const index = stepValues.findIndex((v) => yawNormalized < v);

        if (index >= 0 && index < steps && index !== currentStep) {
          currentStep = index;
          metaframe.setOutput("index", currentStep + 1);
          metaframe.setOutput("h", {duration: newStepHapticDuration, amplitude: 255 });
          // timeSinceLastStep = now + 1000;
          timeSinceLastStep = now;
          timeSinceLastHaptic = now;
        } else {
          // feedback haptic
          const distanceFromStep = stepValuesForDistanceCompute.reduce((acc:number, current:number) => {
            return Math.min(Math.abs(current - yawNormalized), acc);
          }, 1.0);

          // Math.min(Math.abs(yawNormalized - stepValues[currentStep]), currentStep > 0 ? Math.abs(yawNormalized - stepValues[currentStep]) : 0);
          // metaframe.setOutput("distance-to-step", distanceFromStep);
          const normalizedDistanceFromStep = distanceFromStep / stepInterval;
          if (now - timeSinceLastHaptic > feedbackHapticDuration && now - timeSinceLastStep > newStepHapticDuration && normalizedDistanceFromStep  < 0.2) {
            // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;

            // console.log(`(${stepInterval} - ${distanceFromStep}) / ${stepInterval} = ${normalizedDistanceFromStep}`)
            metaframe.setOutput("distance-to-step-normalized", normalizedDistanceFromStep);
            timeSinceLastHaptic = now;
            const amplitude = Math.floor(normalizedDistanceFromStep * 150);
            metaframe.setOutput("h", {duration: feedbackHapticDuration, amplitude });
            // metaframe.setOutput("distance-to-step", distanceFromStep);
          }


        }

        // console.log('index', index);



        // const now = Date.now();
        // const absForceNormalizedNegative1ToPositive1 = Math.abs(forceNormalizedNegative1ToPositive1);
        // console.log('absForceNormalizedNegative1ToPositive1', absForceNormalizedNegative1ToPositive1);
        // if (absForceNormalizedNegative1ToPositive1 > 0.3 && now - timeLastHaptic > hapticInterval) {
        //   const amplitude = Math.floor((absForceNormalizedNegative1ToPositive1 - 0.3) * 255);
        //   console.log('amplitude', amplitude);
        //   metaframe.setOutput("h", {duration: hapticInterval, amplitude });
        //   // metaframe.setOutput("h", {duration: hapticInterval, amplitude });
        //   // metaframe.setOutput("hg", {medium: true});
        //   timeLastHaptic = now;
        // }


        // console.log('forceNormalized', forceNormalized);
        // console.log('o-yaw', yaw);
      })
    );


    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
      // clearInterval(intervalRef);
    };
  }, [metaframeObject?.metaframe, steps, startStep]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
