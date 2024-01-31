import { ReactNode } from 'react';

import { MinScreenWidthToShowCodeAndEditorColumns } from '/@/constants';

import {
  Box,
  HStack,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';

import { PanelMain } from '../main/PanelMain';

export const ResizingTabPanel: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  // single media query with no options
  const [isLargerEnough] = useMediaQuery(
    `(min-width: ${MinScreenWidthToShowCodeAndEditorColumns})`
  );

  return (
    <HStack
      w="100%"
      h="100%"
      justifyContent="flex-start"
      align="flex-start"
      spacing="0px"
      className="borderDashedBlue"
      bg={isLargerEnough ? undefined : "white"}
    >
      <Box
        h="100%"
        w="100%"
        rounded="md"
        className={"borderFatSolidOrange transparent"}
      >
        {children}
      </Box>

      {isLargerEnough ? (
        <VStack
          w="100%"
          h="100%"
          alignItems="flex-start"
          justifyItems="flex-start"
        >
          <PanelMain />
        </VStack>
      ) : null}
    </HStack>
  );
};
