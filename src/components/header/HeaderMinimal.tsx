import { useCallback } from 'react';

import {
  ButtonCopyExternalLink,
} from '/@/components/header/components/ButtonCopyExternalLink';
import {
  ButtonGotoExternalLink,
} from '/@/components/header/components/ButtonGotoExternalLink';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { HeaderHeight } from '/@/constants';
import { useStore } from '/@/store';
import { FaCheck } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

import {
  ChevronDownIcon,
  EditIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import {
  Button,
  Center,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { PanelCode } from '../code/PanelCode';
import { PanelMain } from '../main/PanelMain';
import { PanelOptions } from '../options/PanelOptions';
import { ButtonTabsToggle } from './components/ButtonTabsToggle';

export const HeaderMinimal: React.FC = () => {
  const tab = useStore((state) => state.tab);
  const setTab = useStore((state) => state.setTab);

  const onJSClick = useCallback(() => {
    if (tab === 0) {
      setTab(1);
    } else {
      setTab(0);
    }
  }, [tab]);

  return (
    <HStack spacing="0px" h="100vh" w="100%" className="borderDashedPurple">
      <Tabs w="100%" h="100%" isLazy={true} index={tab} onChange={setTab}>
        <TabList bg="white" h={HeaderHeight}>
          <Center pl={3}>
            <IconButton
              aria-label="Main"
              onClick={onJSClick}
              icon={tab === 0 ? <EditIcon /> : <FaCheck />}
            />
          </Center>

          <Center pl={3}>
            <Menu>
              <MenuButton as={Button}>
                <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setTab(2)}>
                  <FiSettings /> &nbsp; Options
                </MenuItem>
                <ButtonCopyExternalLink menuitem={true} />
                <ButtonGotoExternalLink menuitem={true} />
                <MenuItem onClick={() => setTab(3)}>
                  <InfoIcon /> &nbsp; Docs
                </MenuItem>
              </MenuList>
            </Menu>
          </Center>

          <Spacer />
          <HStack p={1} spacing={4} align="center">
            <ButtonTabsToggle />
          </HStack>
        </TabList>

        <TabPanels h={`calc(100% - ${HeaderHeight})`}>
          <TabPanel p="0px" h="100%">
            <PanelMain />
          </TabPanel>
          <TabPanel p="0px" h="100% ">
            <PanelCode />
          </TabPanel>
          <TabPanel p="0px" m="0px" h="100%">
            <PanelOptions />
          </TabPanel>
          <TabPanel p="0px" h="100%">
            <PanelHelp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HStack>
  );
};
