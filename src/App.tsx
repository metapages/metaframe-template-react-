import '/@/app.css';

import { PanelHelp } from '/@/components/PanelHelp';
import { PanelMain } from '/@/components/PanelMain';

import {
  EditIcon,
  InfoIcon,
  UpDownIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import {
  useHashParam,
  useHashParamBoolean,
  useHashParamInt,
} from '@metapages/hash-query';

import {
  useMetaframeSignals,
} from './components/communication/useMetaframeSignals';
import { ButtonTabsToggle } from './components/options/ButtonTabsToggle';
import { PanelOptions } from './components/options/PanelOptions';
import { PanelControllers } from './components/PanelControllers';

export const App: React.FC = () => {
  const [hideMenu] = useHashParamBoolean("menuhidden");
  const [mode] = useHashParam("button", undefined);
  const [tab, setTab] = useHashParamInt("tab");
  // Wire up the metaframe signals, other components can listen more conveniently
  useMetaframeSignals();

  if (hideMenu) {
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
              <ButtonTabsToggle />
            </Show>
          </HStack>
          { tab === 1 ? <PanelControllers /> : <PanelMain />}

        </>
      );
    } else if (mode === "hidden") {
      return <PanelMain />;
    }
  }
  return (
    <VStack align="flex-start" w="100%">
    <Tabs index={tab || 0} isLazy={true} onChange={setTab} w="100%">
      <TabList>
        <Tab>
          <ViewIcon /> &nbsp; Superslides
        </Tab>
        <Tab>
          <UpDownIcon /> &nbsp; Controllers
        </Tab>
        <Tab>
          <EditIcon /> &nbsp; Options
        </Tab>
        <Tab>
          <InfoIcon />
          &nbsp; Help
        </Tab>
        <Spacer /> <ButtonTabsToggle />
      </TabList>

      <TabPanels>
        <TabPanel>
          <PanelMain />
        </TabPanel>
        <TabPanel>
          <PanelControllers />
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
