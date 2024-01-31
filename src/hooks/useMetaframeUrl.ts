import {
  useEffect,
  useState,
} from 'react';

import {
  setHashValueInHashString,
  setHashValueJsonInUrl,
  stringToBase64String,
  useHashParamBase64,
  useHashParamJson,
} from '@metapages/hash-query';
import { MetaframeDefinitionV6 } from '@metapages/metapage';

export const useMetaframeUrl = () => {
  const [url, setUrl] = useState<string>();
  const [code] = useHashParamBase64("js");
  const [metaframeDef] = useHashParamJson<MetaframeDefinitionV6>("mfjson");
  // update the url
  useEffect(() => {


    let href = window.location.href;
    if (metaframeDef) {
      href = setHashValueJsonInUrl(href, "mfjson", metaframeDef);
    }
    
    const url = new URL(href);

    // I am not sure about this anymore
    url.pathname = "";
    
    // WATCH THIS DIFFERENCE BETWEEN THIS AND BELOW
    // 1!
    if (code) {
      url.hash = setHashValueInHashString(
        url.hash,
        "js",
        stringToBase64String(code)
      );
    }
    setUrl(url.href);
  }, [ code, metaframeDef, setUrl]);

  return { url };
};
