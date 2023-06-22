import {
  PanelSimulationRotarySwitchNoPhysicsFixedOrientation,
} from './PanelSimulationRotarySwitchNoPhysicsFixedOrientation';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {

  return (
    <div>
      <PanelSimulationRotarySwitchNoPhysicsFixedOrientation steps={5} startStep={1} />
    </div>
  );
};
