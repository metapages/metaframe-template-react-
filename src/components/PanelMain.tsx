import { PanelSimulationStepDialSlider } from './PanelSimulationStepDialSlider';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {

  return (
    <div>
      <PanelSimulationStepDialSlider steps={7} startStep={3} />
    </div>
  );
};
