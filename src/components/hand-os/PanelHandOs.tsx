import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react';

import { ButtonSetBaselineQuaternion } from '../ButtonSetBaselineQuaternion';
import {
  RotaryConstantSpeedSwitchNoPhysics,
} from '../control-mechanisms/RotaryConstantSpeedSwitchNoPhysics';
import {
  Menu,
  MenuItemDefinition,
  MenuItemMenuUrl,
  MenuItemTypes,
  Superslides,
  SuperslidesChange,
} from './MenuModel';

/**
 * The main panel for the HandOS
 *
 */
export const PanelHandOs: React.FC<{superslides: Superslides}> = ({superslides}) => {

  const [menu, setMenu] = useState<Menu>(superslides.root);
  const [menus, _] = useState<Menu[]>(Object.keys(superslides.menus).map(id => superslides.menus[id]));
  const [menuItem, setMenuItem] = useState<MenuItemDefinition|undefined>();
  const [menuItems, setMenuItems] = useState<MenuItemDefinition[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string|undefined>();

  const onMenuItemSelect = useCallback((index :number) => {
    console.log(`onMenuItemSelect(${index})`);
    const update = superslides.setMenuItemSelection(index);
    // console.log('update', update);
    setMenuItem(update.item);
    if (update.menu) {
      setMenu(update.menu);
    }
  }, [menu, setMenuItem, superslides]);

  const controller = menu  ? <RotaryConstantSpeedSwitchNoPhysics steps={menu.items.length} startStep={menu.state.selectedIndex || 0} setStep={onMenuItemSelect} /> : null;

  const onMenuSelect = useCallback((menu :Menu) => {
    const {menu:newMenu, item :newMenuItem} = superslides.setMenu(menu.id);
    if (newMenu) {
      setMenu(newMenu);
    }
  }, [menu, setMenu]);


  const onMenuClick = useCallback(() => {
    // console.log(`onMenuClick onMenuItemSelect(-1)`)
    onMenuItemSelect(-1);
  }, [onMenuItemSelect]);

  const onMenuItemClick = useCallback(() => {
    // console.log('onMenuItemClick', menuItem);
    if (!menuItem) {
      return;
    }
    if (menuItem.type === MenuItemTypes.menuUrl) {
      const blob = menuItem.value as MenuItemMenuUrl;
      const change :SuperslidesChange = superslides.setMenu(blob.menu);
      // console.log('change', change);
      if (change.menu) {
        setMenu(change.menu);
      }
    }

  }, [menuItem, superslides, setMenu]);


  // On new Menu, update the menuItems, and selected
  useEffect(() => {
    // console.log(`on new menu ${menu.id} superslides.getMenuItemSelected()=${superslides.getMenuItemSelected()?.id}`);
    setMenuItems(superslides.current.items.map(itemId => superslides.menuItems[itemId]));
    setMenuItem(superslides.getMenuItemSelected())
  }, [menu, setMenuItems, setMenuItem, superslides]);

  // On new MenuItem
  useEffect(() => {
    let url :string|undefined= undefined;
    if (menuItem?.type === MenuItemTypes.url) {
      url = menuItem.value as string;
    }
    if (menuItem?.type === MenuItemTypes.menuUrl) {
      const blob = menuItem.value as MenuItemMenuUrl;
      url = blob.url;
    }
    setIframeUrl(url);
  }, [menuItem]);

  // On new Superslides, update the menu
  useEffect(() => {
    setMenu(superslides.root);
  }, [superslides, setMenu]);


  return (
    <VStack align="flex-start">
      <ButtonSetBaselineQuaternion />
      {controller}
      <HStack>

      {menus.map((m, index) => <Box key={index} borderColor={m.id === menu.id ? "blue": undefined} onClick={m === menu ? () => onMenuClick : () => onMenuSelect(m)} borderWidth='1px' borderRadius='lg' >
        {m.name || m.id}
      </Box>)}


      </HStack>
    <HStack>
    {menuItems.map((item, index) => <Box borderWidth='1px' borderRadius='lg' borderColor={menuItem?.id === item.id ? "red": undefined} key={index} onClick={() => onMenuItemSelect(index)}>{item.name || item.id}</Box>)}

    </HStack>

    <Box borderWidth='1px' borderRadius='lg' w="100%" h="500px" onClick={onMenuItemClick}>
      {iframeUrl ? <iframe src={iframeUrl} /> : null}
      </Box>

    </VStack>
  );
};
