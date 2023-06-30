import {
  Box,
  VStack,
} from '@chakra-ui/react';

import { EmbeddedDeviceConnection } from './hand-os/EmbeddedDeviceConnection';
import { PanelHandOs } from './hand-os/PanelHandOs';
import { useSuperslidesConfig } from './hand-os/useSuperslidesConfig';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {
  const { menuModel } = useSuperslidesConfig();

  return (
    <VStack align="flex-start">
      <EmbeddedDeviceConnection />
      { menuModel?
      <PanelHandOs superslides={menuModel} />  : <Box>...</Box>}
    </VStack>
  );
};
