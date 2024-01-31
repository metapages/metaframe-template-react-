import {
  useCallback,
  useRef,
} from 'react';

import { ResizingTabPanel } from '/@/components/layout/ResizingTabPanel';
import { useMetaframeUrl } from '/@/hooks/useMetaframeUrl';

import { useHashParamBase64 } from '@metapages/hash-query';
import { MetaframeInputMap } from '@metapages/metapage';
import { MetaframeStandaloneComponent } from '@metapages/metapage-grid-react';

export const PanelCode: React.FC = () => {
  const [code, setCode] = useHashParamBase64("js");
  const { url } = useMetaframeUrl();
  return (
    <ResizingTabPanel>
      {url ? <LocalEditor code={code} setCode={setCode} /> : null}
    </ResizingTabPanel>
  );
};

const LocalEditor: React.FC<{
  code: string;
  setCode: (code: string) => void;
}> = ({ code, setCode }) => {
  // only use the code prop initially, but then ignore so we don't get clobbering
  const codeInternal = useRef<string>(code);
  const inputs = useRef<{ text: string }>({ text: codeInternal.current });
  const onCodeOutputsUpdate = useCallback(
    (outputs: MetaframeInputMap) => {
      setCode(outputs.text);
    },
    [setCode]
  );

  return (
    <MetaframeStandaloneComponent
      url={
        "https://editor.mtfm.io/#?hm=disabled&options=JTdCJTIyYXV0b3NlbmQlMjIlM0F0cnVlJTJDJTIybW9kZSUyMiUzQSUyMmphdmFzY3JpcHQlMjIlMkMlMjJzYXZlbG9hZGluaGFzaCUyMiUzQXRydWUlMkMlMjJ0aGVtZSUyMiUzQSUyMnZzLWRhcmslMjIlN0Q="
      }
      inputs={inputs.current}
      onOutputs={onCodeOutputsUpdate}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
