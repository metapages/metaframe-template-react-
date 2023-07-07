import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useHashParamInt } from '@metapages/hash-query';

import {
  ButtonSetBaselineQuaternion,
} from './control-mechanisms/ButtonSetBaselineQuaternion';
import {
  HapticFeedbackTesting,
} from './control-mechanisms/haptics/HapticFeedbackTesting';
import {
  LeftRightSwitchNoPhysics,
} from './control-mechanisms/LeftRightSwitchNoPhysics';
import {
  RotaryConstantSpeedSwitchNoPhysics,
} from './control-mechanisms/RotaryConstantSpeedSwitchNoPhysics';
import {
  RotarySwitchNoPhysics,
} from './control-mechanisms/RotarySwitchNoPhysics';
import { StepDialRotary } from './control-mechanisms/StepDialRotary';
import { StepDialSlider } from './control-mechanisms/StepDialSlider';
import {
  UseBaselineFromBuffer,
} from './control-mechanisms/UseBaselineFromBuffer';
import { DeviceIO } from './hand-os/DeviceIO';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelControllers: React.FC = () => {
  const [tab, setTab] = useHashParamInt("controller");

  const steps = 5;
  const startStep = 0;

  return (
    <VStack align="flex-start">
      <DeviceIO />
      <ButtonSetBaselineQuaternion />
      <Tabs
        align="start"
        textAlign={"left"}
        index={tab || 0}
        isLazy={true}
        onChange={setTab}
        orientation="vertical"
        w="100%"
      >
        <TabList>
          <Tab>UseBaselineFromBuffer</Tab>
          <Tab>LeftRightSwitchNoPhysics</Tab>
          <Tab>RotarySwitchNoPhysics</Tab>
          <Tab>RotaryConstantSpeedSwitchNoPhysics</Tab>
          <Tab>StepDialRotary</Tab>
          <Tab>StepDialSlider</Tab>
          <Tab>HapticFeedbackTesting</Tab>
        </TabList>

        <TabPanels borderWidth="1px" borderRadius="lg">
          <TabPanel>
            <UseBaselineFromBuffer tolerance={0.3} />
          </TabPanel>
          <TabPanel>
            <LeftRightSwitchNoPhysics
              setIncrement={(inc: number) => {
                console.log(`inc: ${inc} ${Date.now()}`);
              }}
              // steps={steps}
              // startStep={startStep}
            />
          </TabPanel>
          <TabPanel>
            <RotarySwitchNoPhysics
              steps={steps}
              startStep={startStep}
              setStep={() => {}}
            />
          </TabPanel>
          <TabPanel>
            <RotaryConstantSpeedSwitchNoPhysics
              steps={steps}
              startStep={startStep}
              setStep={() => {}}
            />
          </TabPanel>
          <TabPanel>
            <StepDialRotary />
          </TabPanel>
          <TabPanel>
            <StepDialSlider
              steps={steps}
              startStep={startStep}
              setStep={() => {}}
            />
          </TabPanel>

          <TabPanel>
            <HapticFeedbackTesting />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
