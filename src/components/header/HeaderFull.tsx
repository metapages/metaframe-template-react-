import { PanelCode } from '/@/components/code/PanelCode';
import {
  ButtonCopyExternalLink,
} from '/@/components/header/components/ButtonCopyExternalLink';
import {
  ButtonGotoExternalLink,
} from '/@/components/header/components/ButtonGotoExternalLink';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { PanelOptions } from '/@/components/options/PanelOptions';
import { HeaderHeight } from '/@/constants';
import { useStore } from '/@/store';
import { FiSettings } from 'react-icons/fi';

import {
  EditIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { PanelMain } from '../main/PanelMain';
import { ButtonTabsToggle } from './components/ButtonTabsToggle';

export const HeaderFull: React.FC = () => {
  const tab = useStore((state) => state.tab);
  const setTab = useStore((state) => state.setTab);
  return (
    <HStack spacing="0px" h="100vh" w="100%" className="borderDashedPurple">
      <Tabs index={tab} onChange={setTab} w="100%" h="100%" isLazy={true}>
        <TabList bg="white" h={HeaderHeight}>
          <Tab>
            <EditIcon /> &nbsp; Main
          </Tab>
          <Tab>
            <EditIcon /> &nbsp; Code
          </Tab>

          <Tab>
            <FiSettings /> &nbsp; Options
          </Tab>
          <Tab>
            <InfoIcon /> &nbsp; Docs
          </Tab>

          <Spacer />
          <HStack p={1} spacing={4} align="center">
            <ButtonGotoExternalLink />
            <ButtonCopyExternalLink />

            <ButtonTabsToggle />
          </HStack>
        </TabList>

        <TabPanels h={`calc(100% - ${HeaderHeight})`}>
          <TabPanel p="0px" h="100%">
            <PanelMain />
          </TabPanel>
          <TabPanel p="0px" h="100%">
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
