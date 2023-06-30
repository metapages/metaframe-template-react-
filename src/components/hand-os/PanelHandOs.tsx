import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useStore } from '/@/store';

import {
  Box,
  HStack,
  Link,
  Tag,
  VStack,
} from '@chakra-ui/react';

import {
  AccelerometerButtons,
} from '../control-mechanisms/AccelerometerButtons';
import {
  BackHaptic,
  CannotGoForwardHaptic,
  CannotGoLeftHaptic,
  CannotGoRightHaptic,
  ForwardHaptic,
  LeftHaptic,
  RightHaptic,
} from '../control-mechanisms/haptics/HapticLibrary';
import {
  Menu,
  MenuItemActionMenu,
  MenuItemActionUrl,
  MenuItemDefinition,
  MenuItemTypes,
  MenuModel,
  MenuModelCursor,
  TapDirection,
} from './MenuModel';

/**
 * The main panel for the HandOS
 *
 */
export const PanelHandOs: React.FC<{
  superslides: MenuModel;
}> = ({ superslides }) => {
  const [menu, setMenu] = useState<Menu>(superslides.root);
  const [menus, _] = useState<Menu[]>(
    Object.keys(superslides.menus).map((id) => superslides.menus[id])
  );
  const [menuItem, setMenuItem] = useState<MenuItemDefinition | undefined>();
  const [menuItems, setMenuItems] = useState<MenuItemDefinition[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();
  const deviceIO = useStore((state) => state.deviceIO);

  const onMenuItemSelect = useCallback(
    (index: number) => {
      const cursor = superslides.setMenuItemSelection(index);
      setMenuItem(cursor.item);
      if (cursor.menu) {
        setMenu(cursor.menu);
      }
    },
    [menu, setMenuItem, superslides]
  );

  const onMenuDirection = useCallback(
    (direction: TapDirection | undefined) => {
      if (!direction || !deviceIO) {
        return;
      }
      let cursor: MenuModelCursor | undefined;

      if (direction === "left") {
        cursor = superslides.onMenuLeft();
        if (cursor.previous) {
          deviceIO.haptics.dispatch(LeftHaptic);
          // sendHaptic(LeftHaptic);
        } else {
          deviceIO.haptics.dispatch(CannotGoLeftHaptic);
          // sendHaptic(CannotGoLeftHaptic);
        }
        setMenuItem(cursor.item);
        if (cursor.menu) {
          setMenu(cursor.menu);
        }
      } else if (direction === "right") {
        cursor = superslides.onMenuRight();
        if (cursor.previous) {
          deviceIO.haptics.dispatch(RightHaptic);
        } else {
          deviceIO.haptics.dispatch(CannotGoRightHaptic);
        }
        setMenuItem(cursor.item);
        if (cursor.menu) {
          setMenu(cursor.menu);
        }
      } else if (direction === "forward") {
        cursor = superslides.onMenuForward();
        if (
          cursor.previous?.item?.type === MenuItemTypes.menu ||
          cursor.previous?.item?.type === MenuItemTypes.metapage
        ) {
          deviceIO.haptics.dispatch(ForwardHaptic);
        } else {
          deviceIO.haptics.dispatch(CannotGoForwardHaptic);
        }

        setMenuItem(cursor.item);
        if (cursor.menu) {
          setMenu(cursor.menu);
        }
      } else if (direction === "back") {
        cursor = superslides.onMenuBack();
        if (cursor.previous && cursor.previous?.menu !== cursor.menu) {
          deviceIO.haptics.dispatch(BackHaptic);
          setMenu(cursor.menu);
        } else {
          deviceIO.haptics.dispatch(CannotGoForwardHaptic);
        }
      }
    },
    [setMenuItem, superslides, deviceIO]
  );

  const controller = menu ? (
    <AccelerometerButtons onDirection={onMenuDirection} />
  ) : null;

  const onMenuSelect = useCallback(
    (menu: Menu) => {
      const { menu: newMenu, item } = superslides.setMenu(menu.id);
      setMenu(newMenu);
      setMenuItem(item);
    },
    [menu, setMenu]
  );

  const onMenuClick = useCallback(() => {
    onMenuItemSelect(-1);
  }, [onMenuItemSelect]);

  const onMenuItemClick = useCallback(() => {
    if (!menuItem) {
      return;
    }
    if (menuItem.type === MenuItemTypes.menu) {
      const blob = menuItem.value as MenuItemActionMenu;
      const change: MenuModelCursor = superslides.setMenu(blob.menu);
      if (change.menu) {
        setMenu(change.menu);
      }
    }
  }, [menuItem, superslides, setMenu]);

  // On new Menu, update the menuItems, and selected
  useEffect(() => {
    setMenuItems(
      superslides.current.items.map((itemId) => superslides.menuItems[itemId])
    );
    setMenuItem(superslides.getMenuItemSelected());
  }, [menu, setMenuItems, setMenuItem, superslides]);

  // On new MenuItem
  useEffect(() => {
    let url: string | undefined = undefined;
    if (menuItem?.type === MenuItemTypes.url) {
      const blob = menuItem.value as MenuItemActionUrl;
      url = blob.url;
    }
    if (menuItem?.type === MenuItemTypes.menu) {
      const blob = menuItem.value as MenuItemActionMenu;
      url = blob.url;
    }

    if (menu.sendToSlideProjector) {
      url = `https://slides-remote.glitch.me/#?channel=${new URL(
        menu.sendToSlideProjector
      ).pathname.replace("/", "")}`;
    }

    setIframeUrl(url);
  }, [menuItem, menu]);

  // On new Superslides, update the menu
  useEffect(() => {
    setMenu(superslides.root);
  }, [superslides, setMenu]);

  return (
    <VStack align="flex-start" w="100%">
      {controller}
      <HStack>
        {menus.map((m, index) => (
          <VStack
            align="flex-start"
            key={index}
            borderColor={m.id === menu.id ? "blue" : undefined}
            onClick={m === menu ? () => onMenuClick : () => onMenuSelect(m)}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Tag>{m.name || m.id}</Tag>
          </VStack>
        ))}
      </HStack>
      <VStack align="flex-start">
        Projector URL:{" "}
        {menu.sendToSlideProjector ? (
          <Link
            isExternal
            href={`https://slides-remote.glitch.me/#?channel=${new URL(
              menu.sendToSlideProjector
            ).pathname.replace("/", "")}`}
          >{`https://slides-remote.glitch.me/#?channel=${new URL(
            menu.sendToSlideProjector
          ).pathname.replace("/", "")}`}</Link>
        ) : null}
      </VStack>

      <HStack>
        {menuItems.map((item, index) => (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor={menuItem?.id === item.id ? "red" : undefined}
            key={index}
            onClick={() => onMenuItemSelect(index)}
          >
            <Tag>{item.name || item.id}</Tag>
          </Box>
        ))}
      </HStack>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        w="100%"
        h="500px"
        onClick={onMenuItemClick}
        className="iframe-container"
      >
        {iframeUrl ? <iframe className="iframe" src={iframeUrl} /> : null}
      </Box>
    </VStack>
  );
};
