import { useEffect } from 'react';

import { useStore } from '/@/store';

import { useMetaframe } from '@metapages/metaframe-hook';
import { MetaframeInputMap } from '@metapages/metapage';

/**
 * Get the Superslides config from the URL or supply a default
 * @returns superslides config object (there is a default)
 */
export const useMetaframeSignals = () => {

  const metaframeObject = useMetaframe();
  const metaframeInputs = useStore(
    (state) => state.metaframeInputs
  );
  const metaframeOutputs = useStore(
    (state) => state.metaframeOutputs
  );

  // listen for orientation changes
  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];
    // listen and forward inputs
    disposers.push(
      metaframe.onInputs((inputs: MetaframeInputMap) => {
        metaframeInputs.dispatch(inputs);
      })
    );
    // listen to outputs and forward
    const bindingOutputs = metaframeOutputs.add((outputs: MetaframeInputMap) => {
      metaframe.setOutputs(outputs);
    });
    disposers.push(() => metaframeOutputs.detach(bindingOutputs));

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [metaframeObject?.metaframe, metaframeInputs, metaframeOutputs]);
};
