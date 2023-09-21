import { useCallback } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

export const ButtonTabsToggle: React.FC<{menuhidden:boolean, setMenuHidden:(v:boolean) => void, mode:string|undefined}> = ({mode, menuhidden, setMenuHidden}) => {
  // const [mode] = useHashParam("button", undefined);
  // const [hideMenu, sethideMenu] = useHashParamBoolean("menuhidden");

  const toggleMenu = useCallback(() => {
    setMenuHidden(!menuhidden);
  }, [menuhidden, setMenuHidden]);

  const button = (
    <IconButton
      aria-label="options"
      variant="ghost"
      color="gray.400"
      onClick={toggleMenu}
      opacity={( mode === "invisible" || mode === "hidden") && menuhidden ? 0 : 1}
      disabled={mode === "hidden" && menuhidden}
      icon={<HamburgerIcon />}
    />
  );
  if (menuhidden || mode === "invisible" || mode === "hidden") {
    return button;
  }
  return <Tooltip label="Toggle view mode">{button}</Tooltip>;
};
