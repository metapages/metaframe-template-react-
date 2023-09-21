import '/@/app.css';

import { useState } from 'react';

import { PanelHelp } from '/@/components/PanelHelp';
import { PanelMain } from '/@/components/PanelMain';
import { FiSettings } from 'react-icons/fi';

import {
  CopyIcon,
  InfoIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  HStack,
  IconButton,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  isIframe,
  useHashParam,
} from '@metapages/hash-query';

import {
  ButtonTabsToggle,
} from './components/options/components/ButtonTabsToggle';
import { PanelOptions } from './components/options/PanelOptions';

const isFramed = isIframe();

export const App: React.FC = () => {
  const [menuhidden, setMenuHidden] = useState<boolean>(isFramed);
  const [mode] = useHashParam("hm", undefined);
  const [tab, setTab] = useState<number>(0);
  const toast = useToast();

  if (menuhidden) {
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
              <ButtonTabsToggle menuhidden={menuhidden} setMenuHidden={setMenuHidden} mode={mode}/>
            </Show>
          </HStack>
          <PanelMain />
        </>
      );
    } else if (mode === "disabled") {
      return <PanelMain />;
    }
  }
  return (
    <VStack align="flex-start" w="100%">
      <Tabs index={tab || 0} isLazy={true} onChange={setTab} w="100%">
        <TabList>
          <Tab>
            <Tooltip label="View markdown page">
              <HStack spacing="0px">
                <ViewIcon />
                <Box>&nbsp; Main</Box>
              </HStack>
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Customize page">
              <HStack spacing="0px">
                <FiSettings />
                <Box>&nbsp; Options</Box>
              </HStack>
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Documentation">
              <HStack spacing="0px">
                <InfoIcon />
                <Box>&nbsp; Help</Box>
              </HStack>
            </Tooltip>
          </Tab>
          <Tooltip label="Copy URL to clipboard">
            <IconButton
              aria-label="copy url"
              variant="ghost"
              icon={<CopyIcon />}
              onClick={() => {
                window.navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Copied URL to clipboard",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            />
          </Tooltip>
          <Spacer />
          <ButtonTabsToggle menuhidden={menuhidden} setMenuHidden={setMenuHidden} mode={mode} />
        </TabList>

        <TabPanels>
          <TabPanel>
            <PanelMain />
          </TabPanel>
          <TabPanel>
            <PanelOptions />
          </TabPanel>
          <TabPanel>
            <PanelHelp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
