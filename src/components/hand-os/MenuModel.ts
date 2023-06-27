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

export type TapDirection = "forward" | "back" | "left" | "right";

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

export type MenuItemType =  "menuUrl" | "url" | "metapage";
export const MenuItemTypes: Record<MenuItemType, MenuItemType> = {
  // menuImmediate: "menuImmediate",
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

export interface MenuModelCursor {
  // The Menu the current cursor is in. Always has a value
  menu: Menu;
  // The MenuItem the current cursor is in. From the current Menu.
  // May be undefined, but only if the current Menu has no items,
  // or if the current Menu does not do selected items, or if none are
  // selected. For most Menus, there will always be a MenuItem
  item?: MenuItemDefinition;
  // Some MenuItems, e.g. metapages, can ingest motion streams and "lock"
  // the cursor to the MenuItem, until released
  isMenuItemControlled: boolean;
}

export class MenuModel {
  root: Menu;
  current: Menu;
  menus: Record<MenuId, Menu> = {};
  menuItems: Record<MenuItemId, MenuItemDefinition> = {};
  menuHistory: Menu[];

  constructor(menus: Menu[], menuItems: MenuItemDefinition[] = []) {
    this.root = menus[0];
    this.current = this.root;
    this.menuHistory = [menus[0]];

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
      // if (item.type === MenuItemTypes.menuImmediate) {
      //   const menuId = item.value as string;
      //   const isMenu = this.menus[menuId];
      //   if (!isMenu) {
      //     throw `MenuItem with id=${item.id} with value=${item.value} refers to a Menu that does not exist!`;
      //   }
      // }
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

  setMenu(menuId: string): MenuModelCursor {
    const menu = this.menus[menuId];
    if (!menu) {
      return this.cursor;
    }
    if (this.menuHistory[this.menuHistory.length - 1] !== menu) {
      this.menuHistory.push(menu);
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
    // const menuItemId: string | undefined =
    //   typeof menu.state.selectedIndex === "number"
    //     ? menu.items[menu.state.selectedIndex]
    //     : undefined;

    return this.cursor;
  }

  setMenuItemSelection(menuItemIndex: number): MenuModelCursor {
    const currentMenu = this.current;
    menuItemIndex = Math.max(0, Math.min(menuItemIndex, currentMenu.items.length - 1));
    currentMenu.state.selectedIndex = menuItemIndex;
    // const menuItemId = currentMenu?.items[menuItemIndex];
    // const menuItem = this.menuItems[menuItemId];
    // const result: MenuModelCursor = { item: menuItem };
    // let newMenuId;
    // // let newMenu: Menu;
    // if (menuItem) {
    //   switch (menuItem.type) {
    //     case MenuItemTypes.menuUrl:
    //       //   const payloadUrl = menuItem.value as MenuItemMenuUrl;
    //       //   newMenuId = payloadUrl.menu;
    //       //   newMenu = this.menus[newMenuId];
    //       //   console.log(`switched to menu ${newMenu.id})`);
    //       //   this.current = newMenu;
    //       //   result.menu = newMenu;
    //       break;
    //     // case MenuItemTypes.menuImmediate:
    //     //   newMenuId = menuItem.value as MenuItemId;
    //     //   const deltaResult = this.setMenu(newMenuId);
    //     //   if (deltaResult.menu?.id === currentMenu.id) {
    //     //     // this is going to go back and forth between the same menus
    //     //     // so we need to reset the selectedIndex
    //     //     // or set it back by one?
    //     //     currentMenu.state.selectedIndex = -1;
    //     //   }
    //     //   return deltaResult;
    //     // newMenu = this.menus[newMenuId];
    //     // console.log(`switched to menu ${newMenu.id})`);
    //     // this.current = newMenu;
    //     // result.menu = newMenu;
    //     // break;
    //     case "url":
    //       break;
    //     case "metapage":
    //       break;
    //     default:
    //       throw `Unknown MenuItem type ${menuItem.type}`;
    //   }
    // }
    return this.cursor;
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

  onMenuLeft(): MenuModelCursor {
    const currentMenu = this.current;
    const currentMenuIndex = currentMenu.state.selectedIndex;
    if (currentMenuIndex <= 0) {
      return this.setMenuItemSelection(currentMenu.state.selectedIndex);
    }
    const newMenuitemIndex = currentMenuIndex - 1;
    return this.setMenuItemSelection(newMenuitemIndex);
  }

  onMenuRight(): MenuModelCursor {
    const currentMenu = this.current;
    const currentMenuIndex = currentMenu.state.selectedIndex;
    if (currentMenuIndex >= currentMenu.items.length - 1) {
      return this.setMenuItemSelection(currentMenu.state.selectedIndex);
    }
    const newMenuitemIndex = currentMenuIndex + 1;
    return this.setMenuItemSelection(newMenuitemIndex);
  }

  onMenuForward(): MenuModelCursor {
    const currentMenu = this.current;
    // const currentMenuIndex = currentMenu.state.selectedIndex;
    // const menuItemId = currentMenu?.items[currentMenuIndex];
    const menuItem = this.getMenuItemSelected();
    // const menuItem = this.menuItems[menuItemId];
    if (!menuItem) {
      return this.cursor;
    }
    switch (menuItem.type) {
      case MenuItemTypes.menuUrl:
        const payloadUrl = menuItem.value as MenuItemMenuUrl;
        const newMenuId = payloadUrl.menu;
        return this.setMenu(newMenuId);
        // const newMenu = this.menus[newMenuId];
        // this.current = newMenu;
        // const newMenuIndex = this.current?.state?.selectedIndex;
        // const newMenuItemId = this.current?.items[newMenuIndex];
        // const newMenuItem = this.menuItems[newMenuItemId];

        // return { menu: this.current, item: newMenuItem };
      default:
        console.log(
          `MenuModel Unhandled: onMenuFoward where menuItem.type=${menuItem.type}`
        );
        return this.cursor;
    }
  }

  onMenuBack(): MenuModelCursor {
    if (this.menuHistory.length > 1 && this.current !== this.menuHistory[this.menuHistory.length-1]) {
      const previousMenu = this.menuHistory.pop()!;
      this.current = previousMenu;
      // if you go back, you might end up on a MenuItem that immediately takes you to that Menu again,
      // so go back until that is not the case
    }
    return this.cursor;
  }

  public get cursor() :MenuModelCursor {
    return {
      menu: this.current,
      item: this.getMenuItemSelected(),
      isMenuItemControlled: false,
    };
  }



  reset(): MenuModelCursor {
    this.current = this.root;
    return this.cursor;
  }
}
