import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useStore } from '/@/store';
import { MiniSignal } from 'mini-signals';

import { Box } from '@chakra-ui/react';
import {
  isIframe,
  useHashParam,
} from '@metapages/hash-query';
import { useMetaframe } from '@metapages/metaframe-hook';
import { MetaframeInputMap } from '@metapages/metapage';
import { MetaframeStandaloneComponent } from '@metapages/metapage-embed-react';

import { EulerArray } from '../common';
import { Haptic } from '../control-mechanisms/haptics/haptics-common';

const IsIframe :boolean = isIframe();

export const EmbeddedDeviceConnection: React.FC = () => {


  const [urlKey, setUrlKey] = useHashParam("inputchannel", "superslides-output-visualization");
  const [inputs, setInptus] = useState<MetaframeInputMap|undefined>();
  const deviceIO = useStore(
    (state) => state.deviceIO
  );
  const setDeviceIO = useStore(
    (state) => state.setDeviceIO
  );

  const onOutputs = useCallback((outputs:MetaframeInputMap) => {
    if (!deviceIO) {
      return;
    }
    if (outputs["ua"]) {
      deviceIO.userAccelerometer.dispatch(outputs["ua"]);
    }
    if (outputs["ao"]) {
      deviceIO.userOrientation.dispatch(outputs["ao"]);
    }

  }, [deviceIO]);

  useEffect(() => {
    if (!deviceIO) {
      return;
    }
    const disposers: (() => void)[] = [];
    const bindingHaptics = deviceIO.haptics.add((haptic: Haptic) => {
      setInptus({h: haptic});
    });
    disposers.push(() => deviceIO.haptics.detach(bindingHaptics));

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };

  }, [deviceIO, setInptus]);




  const metaframeObject = useMetaframe();

  // bind the metaframe to the haptic streams
  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];

    // create and bind haptic stream
    const hapticStream = new MiniSignal<[Haptic]>();
    const bindingHaptic = hapticStream.add((haptic: Haptic) => {
      metaframe.setOutput("h", haptic);
    });
    // setSignalHapticStream(hapticStream);
    disposers.push(() => {
      hapticStream.detach(bindingHaptic);
    });

    // create and bind acceleration stream
    const userAccelerometerStream = new MiniSignal<[EulerArray]>();
    disposers.push(metaframe.onInput("ua", (acceleration: EulerArray) => {
      userAccelerometerStream.dispatch(acceleration);
    }));
    // setSignalUserAccelerometerStream(userAccelerometerStream);

    // create and bind orientation stream
    const userOrientationStream = new MiniSignal<[EulerArray]>();
    disposers.push(metaframe.onInput("ao", (orientation: EulerArray) => {
      userOrientationStream.dispatch(orientation);
    }));
    // setSignalUserOrientationStream(userOrientationStream);

    setDeviceIO({
      haptics: hapticStream,
      userAccelerometer: userAccelerometerStream,
      userOrientation: userOrientationStream,
    });

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    }
  }, [metaframeObject?.metaframe, setDeviceIO]);






  // https://superslides-router.glitch.me/${urlKey}

  if (IsIframe) {
    return <Box>Iframe: expecting deviceIO via metapages</Box>;
  }
  return (
    <Box w="100%" h="150px">
      <MetaframeStandaloneComponent
        height="200px"
        url={`https://superslides-router.glitch.me/${urlKey}`}
        inputs={inputs}
        onOutputs={onOutputs}
      />
    </Box>
  );
};
