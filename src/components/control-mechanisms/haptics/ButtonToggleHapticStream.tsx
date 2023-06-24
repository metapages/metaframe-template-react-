import { useCallback } from 'react';

import { useStore } from '/@/store';

import { Button } from '@chakra-ui/react';

export const ButtonToggleHapticStream: React.FC = () => {

  const sendHapticStream = useStore((state) => state.sendHapticStream);
  const setSendHapticStream = useStore((state) => state.setSendHapticStream);

  const onClick = useCallback(() => {
    setSendHapticStream(!sendHapticStream);
  }, [sendHapticStream, setSendHapticStream]);

  return (
    <Button
      aria-label="toggle haptic signal"
      variant="solid"
      colorScheme={sendHapticStream ? "green" : "red"}
      onClick={onClick}
    >{sendHapticStream ? "Disable " : "Enable "} Haptic Stream</Button>
  );
};
