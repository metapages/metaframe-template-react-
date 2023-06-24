import { MetapageDefinitionV3 } from '@metapages/metapage';

// These data structures represent:
//   - a cursor position, starting at the first menu
//   - the cursor position can be moved "into" a menu item
//   - to move "out of" a menu item, back into the menu, is defined
//     by the menu itself, e.g. move up to get out of the menu item

type MenuItemId = string;
type MenuId = string;

// Default: if no selectedIndex, start at 0
export type MenuType = "Default";
export const MenuTypes: Record<MenuType, MenuType> = {
  Default: "Default",
};

export type MenuController = "Default";

export interface Menu {
  id: MenuId;
  type?: MenuType;
  name?: string;
  // i imagine there can be different ways to control the menu
  controller?: MenuController;
  // the core: the menu items
  items: MenuItemId[];

  // keep current state, mostly which menuitem is selected
  state: {
    // if a menuitem is selected (they stay selected)
    selectedIndex: number;
    // isSelectedMenuItemControlled: boolean;
    // how to
    // exit: any;
  };
}

// export interface MenuItem {
//   id: string; // needed for this?
// }

export type MenuItemType = "menuImmediate" | "menuUrl" | "url" | "metapage";
export const MenuItemTypes: Record<MenuItemType, MenuItemType> = {
  menuImmediate: "menuImmediate",
  menuUrl: "menuUrl",
  url: "url",
  metapage: "metapage",
};

export type MenuItemMenuUrl = { url: string; menu: string };

export interface MenuItemDefinition {
  id: MenuItemId;
  name?: string;
  type: MenuItemType;
  value: string | MetapageDefinitionV3 | MenuItemMenuUrl;

  // url: string;
  // wss: string;
}

export interface SuperslidesChange {
  item?: MenuItemDefinition;
  menu?: Menu;
}

export class MenuModel {
  root: Menu;
  current: Menu;
  menus: Record<MenuId, Menu> = {};
  menuItems: Record<MenuItemId, MenuItemDefinition> = {};

  constructor(menus: Menu[], menuItems: MenuItemDefinition[] = []) {
    this.root = menus[0];
    this.current = this.root;

    // process all the Menus and MenuItems
    menus.forEach((menu) => {
      if (this.menus[menu.id]) {
        throw `Menu with id ${menu.id} already exists!`;
      }
      this.menus[menu.id] = menu;
    });
    menuItems.forEach((item) => {
      if (this.menuItems[item.id]) {
        throw `MenuItem with id ${item.id} already exists!`;
      }
      this.menuItems[item.id] = item;
      // some basic checks
      if (item.type === MenuItemTypes.menuImmediate) {
        const menuId = item.value as string;
        const isMenu = this.menus[menuId];
        if (!isMenu) {
          throw `MenuItem with id=${item.id} with value=${item.value} refers to a Menu that does not exist!`;
        }
      }
      if (item.type === MenuItemTypes.menuUrl) {
        const payload = item.value as MenuItemMenuUrl;
        if (typeof payload !== "object") {
          throw `MenuItem with id=${item.id}, value=${item.value} should be of type MenuItemMenuUrl`;
        }
        const isMenu = this.menus[payload.menu];
        if (!isMenu) {
          throw `MenuItem with id=${item.id} with value=${item.value} refers to a Menu that does not exist!`;
        }
      }
    });
    // run these even though the current is set above because it
    // does a bunch of checks
    this.setMenu(this.root.id);
  }

  setMenu(menuId: string): SuperslidesChange {
    const menu = this.menus[menuId];
    if (!menu) {
      return {};
    }
    this.current = menu;
    const menuType: MenuType = menu.type || MenuTypes.Default;

    switch (menuType) {
      // Make sure this Menu has a selected index
      case MenuTypes.Default:
        if (
          menu.state.selectedIndex === -1 ||
          (menu.state.selectedIndex === undefined && menu.items.length > 0)
        ) {
          menu.state.selectedIndex = 0;
        }
        break;
      default:
        break;
    }
    const menuItemId: string | undefined =
      typeof menu.state.selectedIndex === "number"
        ? menu.items[menu.state.selectedIndex]
        : undefined;

    return {
      menu,
      item: menuItemId ? this.menuItems[menuItemId] : undefined,
    };
  }

  setMenuItemSelection(menuItemIndex: number): SuperslidesChange {
    const currentMenu = this.current;
    currentMenu.state.selectedIndex = menuItemIndex;
    const menuItemId = currentMenu?.items[menuItemIndex];
    const menuItem = this.menuItems[menuItemId];
    const result: SuperslidesChange = { item: menuItem };
    let newMenuId;
    let newMenu: Menu;
    if (menuItem) {
      switch (menuItem.type) {
        case MenuItemTypes.menuUrl:
          //   const payloadUrl = menuItem.value as MenuItemMenuUrl;
          //   newMenuId = payloadUrl.menu;
          //   newMenu = this.menus[newMenuId];
          //   console.log(`switched to menu ${newMenu.id})`);
          //   this.current = newMenu;
          //   result.menu = newMenu;
          break;
        case MenuItemTypes.menuImmediate:
          newMenuId = menuItem.value as MenuItemId;
          const deltaResult = this.setMenu(newMenuId);
          if (deltaResult.menu?.id === currentMenu.id) {
            // this is going to go back and forth between the same menus
            // so we need to reset the selectedIndex
            // or set it back by one?
            currentMenu.state.selectedIndex = -1;
          }
          return deltaResult;
          // newMenu = this.menus[newMenuId];
          // console.log(`switched to menu ${newMenu.id})`);
          // this.current = newMenu;
          // result.menu = newMenu;
          // break;
        case "url":
          break;
        case "metapage":
          break;
        default:
          throw `Unknown MenuItem type ${menuItem.type}`;
      }
    }
    return result;
  }

  getMenuItemSelected(): MenuItemDefinition | undefined {
    const menuItemId: string | undefined =
      typeof this.current.state.selectedIndex === "number"
        ? this.current.items[this.current.state.selectedIndex]
        : undefined;

    if (menuItemId) {
      return this.menuItems[menuItemId];
    }
  }

  reset(): SuperslidesChange {
    this.current = this.root;
    const result: SuperslidesChange = { menu: this.root };
    return result;
  }
}
