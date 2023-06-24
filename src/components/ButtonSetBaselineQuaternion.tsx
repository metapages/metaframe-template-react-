import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import Quaternion from 'quaternion';

import { Button } from '@chakra-ui/react';
import { useMetaframe } from '@metapages/metaframe-hook';

import { useStore } from '../store';

const rad = Math.PI / 180;

export const ButtonSetBaselineQuaternion: React.FC = () => {
  const setQuaternionBaseline = useStore(
    (state) => state.setQuaternionBaseline
  );
  const quaternionBaseline = useStore((state) => state.quaternionBaseline);
  const refCurrentOrientation = useRef<number[] | null>(null);

  const metaframeObject = useMetaframe();

  // listen for orientation changes
  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe) {
      return;
    }
    const disposers: (() => void)[] = [];
    disposers.push(
      metaframe.onInput("o", (orientation: number[]) => {
        // console.log('orientation', orientation);
        refCurrentOrientation.current = orientation;
      })
    );

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [metaframeObject?.metaframe]);

  const onClick = useCallback(() => {
    if (!refCurrentOrientation.current) {
      return;
    }
    var q = Quaternion.fromEuler(refCurrentOrientation.current[0] * rad, refCurrentOrientation.current[1] * rad, refCurrentOrientation.current[2] * rad, 'ZXY');
    setQuaternionBaseline(q);
    // baselineQuaternion = q;//q.inverse();
  }, [setQuaternionBaseline, refCurrentOrientation]);

  return (
    <Button
      aria-label="set baseline"
      variant="solid"
      colorScheme='blue'
      onClick={onClick}
    >{quaternionBaseline ? "Re-" : "" }Set baseline orientation</Button>
  );
};
