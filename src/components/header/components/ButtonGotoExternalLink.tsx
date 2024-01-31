import { useMetaframeUrl } from '/@/hooks/useMetaframeUrl';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Link,
  MenuItem,
} from '@chakra-ui/react';
import { isIframe } from '@metapages/hash-query';

const isFramed = isIframe();

export const ButtonGotoExternalLink: React.FC<{ menuitem?: boolean }> = ({
  menuitem,
}) => {
  const { url } = useMetaframeUrl();

  if (menuitem) {
    return (
      <MenuItem w="100%" as="a" href={url} target="_parent">
        <ExternalLinkIcon />
        &nbsp; Go to source URL
      </MenuItem>
    );
  }

  return (
    <Link _hover={undefined} href={url} isExternal target={isFramed ? "_parent" : "_blank"}>
      <IconButton aria-label="go to source url" icon={<ExternalLinkIcon />} />
    </Link>
  );
};
