import { useEffect } from 'react';

import { useStore } from '/@/store';

import { VStack } from '@chakra-ui/react';

import {
  clamp,
  EulerArray,
  rotateEulerFromBaselineQuaternion,
} from '../../common';
import { ButtonSendHapticSignal } from './ButtonSendHapticSignal';
import { ButtonToggleHapticStream } from './ButtonToggleHapticStream';
import {
  HAPTIC_INTERVAL_FOR_APPROACHING_GENTLE_CONTACT,
  HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT,
} from './haptics-common';

/**
 * Rotary switch, no physics, just haptic feedback
 * HARDCODED POSITION: arm down against body, screen facing up
 * yaw is rotation keeping the phone flat aligned with the ground
 * roll is flipping the phone on it's side triggereing the switch
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const HapticFeedbackTesting: React.FC = () => {
  const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const sendHapticStream = useStore((state) => state.sendHapticStream);
  const deviceIO = useStore((state) => state.deviceIO);

  useEffect(() => {
    if (!deviceIO) {
      return;
    }

    const disposers: (() => void)[] = [];
    const maxHapticAmplitude = 200;
    const hapticTimeInterval = 100;
    let timeLastHapticTime = Date.now();

    const bindingOrientation = deviceIO.userOrientation.add(
      (orientation: EulerArray) => {
        let yaw: number | undefined;
        if (quaternionBaseline) {
          const rotated = rotateEulerFromBaselineQuaternion(
            orientation,
            quaternionBaseline
          );
          yaw = rotated.yaw;
        } else {
          yaw = orientation[0];
        }
        // let's use yaw as the force
        // rotated values [ -1, 1] approx, it's like just under half a circle
        yaw = Math.max(Math.min(yaw, 1.0), -1.0);
        let yawNormalized = (yaw - -1) / 2;
        yawNormalized = 1 - yawNormalized;

        const now = Date.now();
        // add a little padding to the haptic interval
        // to make sure we overlap
        if (
          now - timeLastHapticTime >=
          HAPTIC_INTERVAL_FOR_APPROACHING_GENTLE_CONTACT
        ) {
          timeLastHapticTime = now;
          const amplitude = Math.floor(
            clamp(
              yawNormalized * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max,
              0,
              HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
            )
          );
          const haptic = {
            repeat: -1,
            intensities: [0, amplitude],
            pattern: [0, HAPTIC_INTERVAL_FOR_APPROACHING_GENTLE_CONTACT],
            duration: -1,
            amplitude: -1,
          };
          if (sendHapticStream) {
            deviceIO.haptics.dispatch(haptic);
          }
        }
      }
    );
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [deviceIO, quaternionBaseline, sendHapticStream]);

  return (
    <VStack align="flex-start" p={1}>
      <ButtonToggleHapticStream />
      <ButtonSendHapticSignal
        name="test"
        haptic={{
          amplitude: 10,
          duration: 1000,
        }}
      />
      <ButtonSendHapticSignal
        name="ker-thunk"
        haptic={{
          pattern: [0, 1000, 0, 2000, 0, 3000, 0, 500],
          intensities: [0, 128, 0, 255, 0, 64, 0, 255],
        }}
      />
    </VStack>
  );
};
