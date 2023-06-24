import { DEMO_MENU } from './hand-os/example-model';
import { PanelHandOs } from './hand-os/PanelHandOs';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {

  return (
    <div>
      {/* <ButtonSetBaselineQuaternion /> */}
      {/* <SimulationRotarySwitchNoPhysicsFixedOrientation steps={5} startStep={1} /> */}
      {/* <HapticFeedbackTesting /> */}
      <PanelHandOs superslides={DEMO_MENU}/>
    </div>
  );
};
