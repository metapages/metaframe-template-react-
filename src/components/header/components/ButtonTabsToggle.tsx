import { useCallback } from 'react';

import { useStore } from '/@/store';
import { FaCheck } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

import {
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@chakra-ui/react';
import { useHashParam } from '@metapages/hash-query';

export const ButtonTabsToggle: React.FC<Omit<IconButtonProps, "aria-label">> = (props) => {
  
  const [mode] = useHashParam("hm", undefined);
  const editMode = useStore(
    (state) => state.editMode
  );
  const setEditMode = useStore(
    (state) => state.setEditMode
  );
  
  const toggleMenu = useCallback(() => {
    setEditMode(!editMode);
  }, [setEditMode, editMode]);

  const menuhidden = !editMode;

  const button = (
    <IconButton
      {...props}
      aria-label="options"
      variant="ghost"
      color="gray.400"
      onClick={toggleMenu}
      opacity={( mode === "invisible" || mode === "disabled") && menuhidden ? 0 : 1}
      disabled={mode === "disabled" && menuhidden}
      icon={menuhidden ?  <MdEdit /> : <FaCheck color="green"/>}
    />
  );
  if (menuhidden || mode === "invisible" || mode === "disabled") {
    return button;
  }
  return <Tooltip label="Toggle view mode">{button}</Tooltip>;
};
