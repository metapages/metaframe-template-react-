import { useCallback } from 'react';

import { useStore } from '/@/store';

import { Button } from '@chakra-ui/react';

import { Haptic } from './haptics-common';

export const ButtonSendHapticSignal: React.FC<{
  haptic: Haptic;
  name: string;
}> = ({ haptic, name }) => {
  const deviceIO = useStore((state) => state.deviceIO);

  const onClick = useCallback(() => {
    if (!deviceIO) {
      return;
    }
    deviceIO.haptics.dispatch({
      ...haptic,
      repeat: haptic.repeat === undefined ? -1 : haptic.repeat,
      duration: haptic.duration === undefined ? -1 : haptic.duration,
      amplitude: haptic.amplitude === undefined ? -1 : haptic.amplitude,
    });
  }, [deviceIO, haptic]);

  return (
    <Button
      aria-label="send haptic signal"
      variant="solid"
      colorScheme="blue"
      // color="gray.400"
      onClick={onClick}
    >
      {name}
    </Button>
  );
};
