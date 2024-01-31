import '/@/app.css';

import { useStore } from '/@/store';

import {
  HStack,
  Show,
  Spacer,
  useMediaQuery,
} from '@chakra-ui/react';
import { useHashParam } from '@metapages/hash-query';

import {
  ButtonTabsToggle,
} from './components/header/components/ButtonTabsToggle';
import { HeaderFull } from './components/header/HeaderFull';
import { HeaderMinimal } from './components/header/HeaderMinimal';
import { PanelMain } from './components/main/PanelMain';
import { MinScreenWidthToShowFullHeader } from './constants';

export const App: React.FC = () => {
  const editMode = useStore((state) => state.editMode);

  const [mode] = useHashParam("hm", undefined);
  const [isLargerEnoughForFullHeader] = useMediaQuery(
    `(min-width: ${MinScreenWidthToShowFullHeader})`
  );

  if (!editMode) {
    if (mode === undefined || mode === "visible" || mode === "invisible") {
      return (
        <>
          <HStack
            style={{ position: "absolute" }}
            width="100%"
            justifyContent="flex-end"
          >
            <Spacer />
            <Show breakpoint="(min-width: 200px)">
              <HStack p={1} spacing={4} align="center">
                <ButtonTabsToggle mt={1} />
              </HStack>
            </Show>
          </HStack>
          <PanelMain />
        </>
      );
    } else if (mode === "disabled") {
      return <PanelMain />;
    }
  }

  return isLargerEnoughForFullHeader ? <HeaderFull /> : <HeaderMinimal />;
};
