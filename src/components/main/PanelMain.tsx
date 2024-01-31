import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  VStack,
} from '@chakra-ui/react';
import { useHashParamBase64 } from '@metapages/hash-query';
import { useMetaframe } from '@metapages/metaframe-hook';
import {
  MetaframeEvents,
  MetaframeInputMap,
} from '@metapages/metapage';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {
  // This is currently the most performant way to get metaframe
  // inputs and cleanup properly
  const metaframeObject = useMetaframe();
  const [inputs, setInputs] = useState<MetaframeInputMap | undefined>();
  const [code] = useHashParamBase64("js");
  const [codeResult, setCodeResult] = useState<any>();
  const [codeError, setCodeError] = useState<any | undefined>();

  // run the code
  // you can do this multiple ways:
  //   - on new code or new inputs
  //   - only on new code
  //   - only on inputs
  useEffect(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    let cancelled = false;
    const metaframe = metaframeObject.metaframe;
    // const context = {};
    setCodeError(undefined);
    setCodeResult(undefined);
    (async () => {
      if (cancelled) {
        return;
      }
      try {
        const codeWithAsync = `(async () => {
          ${code}
        })()`;
        const evalPromise = eval(codeWithAsync);
        const result = await evalPromise;
        if (cancelled) {
          return;
        }
        setCodeResult(result);
      } catch (err) {
        setCodeError(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [metaframeObject.metaframe, code]);

  // listen to inputs and cleanup up listener
  useEffect(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    const metaframe = metaframeObject.metaframe;
    const onInputs = (newinputs: MetaframeInputMap): void => {
      setInputs(newinputs);
    };
    metaframe.addListener(MetaframeEvents.Inputs, onInputs);

    return () => {
      // If the metaframe is cleaned up, also remove the inputs listener
      metaframe.removeListener(MetaframeEvents.Inputs, onInputs);
    };
  }, [metaframeObject.metaframe, setInputs]);

  // I am not rendering these in a fancy way, just throwing them there
  return (
    <VStack justifyItems="flex-start" alignItems="flex-start">
      <Badge>metaframe inputs:</Badge>{" "}
      <Box>{inputs ? JSON.stringify(inputs) : "none yet"}</Box>
      <Box>{codeResult ? (`${JSON.stringify(codeResult)  }`) : null}</Box>
      <Box>{codeError ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Code error</AlertTitle>
          <AlertDescription>{`${codeError}`}</AlertDescription>
        </Alert>
      ) : null}</Box>
    </VStack>
  );
};
