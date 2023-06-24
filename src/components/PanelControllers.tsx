import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useHashParamInt } from '@metapages/hash-query';

import { ButtonSetBaselineQuaternion } from './ButtonSetBaselineQuaternion';
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
        <TabList textAlign={"left"} >
          <Tab textAlign={"left"}>LeftRightSwitchNoPhysics</Tab>
          <Tab textAlign={"left"}>RotarySwitchNoPhysics</Tab>
          <Tab textAlign={"left"}>RotaryConstantSpeedSwitchNoPhysics</Tab>
          <Tab>StepDialRotary</Tab>
          <Tab>StepDialSlider</Tab>
          <Tab>HapticFeedbackTesting</Tab>
        </TabList>

        <TabPanels borderWidth='1px' borderRadius='lg' >
          <TabPanel >
            <LeftRightSwitchNoPhysics
              // steps={steps}
              // startStep={startStep}
            />
          </TabPanel>
          <TabPanel>
            <RotarySwitchNoPhysics
              steps={steps}
              startStep={startStep}
              setStep={()=> {}}
            />
          </TabPanel>
          <TabPanel>
            <RotaryConstantSpeedSwitchNoPhysics
              steps={steps}
              startStep={startStep}
              setStep={()=> {}}
            />
          </TabPanel>
          <TabPanel>
            <StepDialRotary />
          </TabPanel>
          <TabPanel>
            <StepDialSlider steps={steps} startStep={startStep} setStep={()=> {}}/>
          </TabPanel>

          <TabPanel>
            <HapticFeedbackTesting />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
