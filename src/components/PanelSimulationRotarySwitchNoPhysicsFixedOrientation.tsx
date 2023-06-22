import {
  useEffect,
  useRef,
} from 'react';

import { useMetaframe } from '@metapages/metaframe-hook';

import { clamp } from './common';

/**
 * Rotary switch, no physics, just haptic feedback
 * HARDCODED POSITION: arm down against body, screen facing up
 * yaw is rotation keeping the phone flat aligned with the ground
 * roll is flipping the phone on it's side triggereing the switch
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const PanelSimulationRotarySwitchNoPhysicsFixedOrientation: React.FC<{steps:number, startStep?:number}> = ({steps = 5, startStep = 0}) => {
  const forceRef = useRef<number>(0);
  const metaframeObject = useMetaframe();

  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];

    const rad = Math.PI / 180;
    const hapticInterval = 100;
    let timeLastHaptic = Date.now();


    let yaw = 0;
    let currentStep = startStep;

    const stepInterval = 1.0 / (steps);
    const stepValues :number[] = [...Array(steps - 1), 1.0].map((_, i) => i * stepInterval + stepInterval );
    const stepValuesForDistanceCompute = [...Array(steps - 1)].map((_, i) => i * stepInterval + stepInterval );
    // console.log('steps', steps);
    // console.log('stepValues', stepValues);
    // console.log('stepValuesForDistanceCompute', stepValuesForDistanceCompute);


    const newStepHapticDuration = 100;
    const feedbackHapticDuration = 10;
    let timeSinceLastStep = Date.now();
    let timeSinceLastHaptic = Date.now();
    // const newStepHapticQueue = [];
    const valuesToFigureOutCenterTotal = 50;
    const valuesToFigureOutYawCenter :number[] = [];
    const valuesToFigureOutPitchCenter :number[] = [];
    let yawCenter = 0;
    let pitchCenter = 0;


    disposers.push(
      metaframe.onInput("o", (orientation: number[]) => {

        const yaw = orientation[0];
        const pitch = orientation[1];
        // figure out the "center" yaw by sucking in values before we start
        if (valuesToFigureOutYawCenter.length < valuesToFigureOutCenterTotal) {
          valuesToFigureOutYawCenter.push(yaw);
          valuesToFigureOutPitchCenter.push(pitch);
          return;
        }
        if (valuesToFigureOutYawCenter.length === valuesToFigureOutCenterTotal) {
          valuesToFigureOutYawCenter.push(yaw);
          valuesToFigureOutPitchCenter.push(pitch);
          yawCenter = valuesToFigureOutYawCenter.reduce((acc, current) => acc + current, 0) / valuesToFigureOutCenterTotal;
          pitchCenter = valuesToFigureOutPitchCenter.reduce((acc, current) => acc + current, 0) / valuesToFigureOutCenterTotal;
          // console.log('yawCenter', yawCenter);
        }
        const now = Date.now();
        // screen up, left: -1, right: 1
        const yawCentered = -(yaw - yawCenter);
        const pitchCentered = -(pitch - pitchCenter);
        // console.log('yawCentered', yawCentered);
        // This is naturally [-1, 1] in the half circle, which is natural for human motion
        const yawNormalizedNeg1To1 = clamp(yawCentered, -1.5, 1.5);
        // console.log('yawNormalizedNeg1To1', yawNormalizedNeg1To1);
        const yawNormalized0to1 = (1 + yawNormalizedNeg1To1) / 2;

        metaframe.setOutput("force", yawNormalized0to1);
        // metaframe.setOutput("force", pitchCentered);

        if (pitchCentered > 0.4 && now - timeSinceLastStep > newStepHapticDuration) {
          timeSinceLastStep = now;
          metaframe.setOutput("index", currentStep + 1);
        }

        // console.log('Math.abs(pitchCentered)', Math.abs(pitchCentered));
        if (Math.abs(pitchCentered) > 0.4) {
          return;
        }





        const index = stepValues.findIndex((v) => yawNormalized0to1 < v);

        if (index >= 0 && index < steps && index !== currentStep) {
          currentStep = index;

          metaframe.setOutput("h", {duration: newStepHapticDuration, amplitude: 255 });
          // timeSinceLastStep = now + 1000;
          timeSinceLastHaptic = now;
        } else {
          // feedback haptic
          const distanceFromStep = stepValuesForDistanceCompute.reduce((acc:number, current:number) => {
            return Math.min(Math.abs(current - yawNormalized0to1), acc);
          }, 1.0);

          const normalizedDistanceFromStep = distanceFromStep / stepInterval;
          if (now - timeSinceLastHaptic > feedbackHapticDuration && now - timeSinceLastStep > newStepHapticDuration && normalizedDistanceFromStep  < 0.3) {
            // const normalizedDistanceFromStep = (stepInterval - distanceFromStep) / stepInterval;

            metaframe.setOutput("distance-to-step-normalized", normalizedDistanceFromStep);
            timeSinceLastHaptic = now;
            const amplitude = Math.floor(normalizedDistanceFromStep * 200);
            metaframe.setOutput("h", {duration: feedbackHapticDuration, amplitude });
            metaframe.setOutput("distance-to-step", distanceFromStep);
          }


        }
      })
    );


    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [metaframeObject?.metaframe, steps, startStep]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
