import { useCallback } from 'react';

import { Button } from '@chakra-ui/react';
import { useMetaframe } from '@metapages/metaframe-hook';

type Haptic = {
  amplitude?: number;
  duration?: number;
  pattern?: number[];
  intensities?: number[];
  repeat?: number;
}

export const ButtonSendHapticSignal: React.FC<{haptic:Haptic, name:string}> = ({haptic, name}) => {
  const metaframeObject = useMetaframe();

  const onClick = useCallback(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }

    metaframe.setOutput("h", {
      ...haptic,
      repeat : haptic.repeat === undefined ? -1 : haptic.repeat,
      duration: haptic.duration === undefined ? -1 : haptic.duration,
      amplitude: haptic.amplitude === undefined ? -1 : haptic.amplitude,
    });
  }, [metaframeObject, haptic]);

  return (
    <Button
      aria-label="send haptic signal"
      variant="solid"
      colorScheme='blue'
      // color="gray.400"
      onClick={onClick}
    >{name}</Button>
  );
};
