import {MetapageDefinitionV3} from "@metapages/metapage";

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
  Default: "Default"
};

export type MenuController = "Default";

export type TapDirection = |"forward" | "back" | "left" | "right" | "up" | "down";

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
  // A remote superslides projector
  sendToSlideProjector?: string;
}

// export interface MenuItem {
//   id: string;  needed for this?
// }

export type MenuItemActionType = "menu" | "url" | "metapage" | "notion";
export const MenuItemTypes: Record<MenuItemActionType, MenuItemActionType> = {
  menu: "menu",
  url: "url",
  metapage: "metapage",
  notion: "notion"
};

export type MenuItemActionMenu = {
  url?: string;
  menu: string;
};
export type MenuItemActionUrl = {
  url: string;
};
export type MenuItemActionMetapage = {
  metapage: MetapageDefinitionV3;
};
export type MenuItemActionNotion = {
  key: string;
  page: string;
  cache?: boolean;
};

export interface MenuItemDefinition {
  id: MenuItemId;
  name?: string;

  type: MenuItemActionType;
  value?: |MenuItemActionMenu | MenuItemActionUrl | MenuItemActionMetapage | MenuItemActionNotion;

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
  // isMenuItemControlled: boolean;
  previous?: MenuModelCursor;
}

export interface MenuConfig {
  menus: Menu[];
  menuItems: MenuItemDefinition[];
}

/**
 * Make sure that the motion capture router is pointing to the correct channel
 * @param metapage
 */
const ensureMetapageHasRouterKey = (metapage : MetapageDefinitionV3, key : string) => {
  if (metapage.metaframes) {
    Object.keys(metapage.metaframes).forEach((metaframeKey) => {
      const metaframe = metapage.metaframes[metaframeKey];
      if (metaframe.url.includes("https://superslides-router.glitch.me")) {
        const url = new URL(metaframe.url);
        url.pathname = `/${key}`;
        metaframe.url = url.href;
      }
    });
  }
};

const processAllMenuItems = (menuItems : MenuItemDefinition[], channelKey : string): MenuItemDefinition[] => {
  return menuItems.map((menuItem) => {
    if (menuItem.type === MenuItemTypes.metapage) {
      const menuItemCopy: MenuItemDefinition = {
        ...menuItem
      };
      const metapageThing = {
        ...(menuItemCopy.value as MenuItemActionMetapage)
      };
      menuItemCopy.value = metapageThing;
      ensureMetapageHasRouterKey(metapageThing.metapage, channelKey);
      return menuItemCopy;
    }
    return menuItem;
  });
};

export class MenuModel {
  root: Menu;
  current: Menu;
  menus: Record<MenuId, Menu> = {};
  menuItems: Record<MenuItemId, MenuItemDefinition> = {};
  menuHistory: Menu[];

  constructor(config : MenuConfig, channel : string) {
    if (config.menus.length === 0) {
      throw `MenuConfig must have at least one Menu!`;
    }
    if (!channel) {
      throw `MenuConfig have a channel!`;
    }
    this.root = config.menus[0];
    this.current = this.root;
    this.menuHistory = [];
    let localMenuItems = config.menuItems || [];
    localMenuItems = processAllMenuItems(localMenuItems, channel);

    // process all the Menus and MenuItems
    config.menus.forEach((menu) => {
      if (this.menus[menu.id]) {
        throw `Menu with id ${menu.id} already exists!`;
      }
      this.menus[menu.id] = menu;
    });
    localMenuItems.forEach((item) => {
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
      if (item.type === MenuItemTypes.menu) {
        const payload = item.value as MenuItemActionMenu;
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
    console.log(`new MenuModel: setMenu ${this.root.id}`);
    this.setMenu(this.root.id);
  }

  setMenu(menuId : string): MenuModelCursor {
    const menu = this.menus[menuId];
    if (!menu) {
      return this.cursor;
    }

    this.current = menu;
    const menuType: MenuType = menu.type || MenuTypes.Default;

    switch (menuType) {
        // Make sure this Menu has a selected index
      case MenuTypes.Default:
        if (menu.state.selectedIndex === -1 || (menu.state.selectedIndex === undefined && menu.items.length > 0)) {
          menu.state.selectedIndex = 0;
        }
        break;
      default:
        break;
    }

    return this.setMenuItemSelection(menu.state.selectedIndex);
  }

  setMenuItemSelection(menuItemIndex : number): MenuModelCursor {
    console.log(`setMenuItemSelection ${menuItemIndex}`);
    const currentMenu = this.current;
    menuItemIndex = Math.max(0, Math.min(menuItemIndex, currentMenu.items.length - 1));
    currentMenu.state.selectedIndex = menuItemIndex;
    this.performMenuItemAction();
    return this.cursor;
  }

  performMenuItemAction(): void {
    try {
      const menuItem = this.getMenuItemSelected();
      if (menuItem) {
        switch (menuItem.type) {
          case MenuItemTypes.menu:
            const payloadMenu = menuItem.value as MenuItemActionMenu;

            if (payloadMenu.url && this.current.sendToSlideProjector) {
              fetch(this.current.sendToSlideProjector, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({type: "url", value: payloadMenu.url})
              });
            }

            break;

          case "url":
            const payloadUrl = menuItem.value as MenuItemActionUrl;

            if (payloadUrl.url && this.current.sendToSlideProjector) {
              fetch(this.current.sendToSlideProjector, {
                method: "POST",
                redirect: "follow",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({type: "url", value: payloadUrl.url})
              });
            }

            break;
          case "notion":
            const payloadNotion = menuItem.value as MenuItemActionNotion;

            if (this.current.sendToSlideProjector) {
              fetch(this.current.sendToSlideProjector, {
                method: "POST",
                redirect: "follow",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({type: "notion", value: payloadNotion})
              });
            }

            break;
          case "metapage":
            const payloadMetapage = menuItem.value as MenuItemActionMetapage;
            const metapageDef = payloadMetapage.metapage;
            if (this.current.sendToSlideProjector) {
              fetch(this.current.sendToSlideProjector, {
                method: "POST",
                redirect: "follow",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({type: "metapage", value: metapageDef})
              });
            }

            break;
          default:
            throw `Unknown MenuItem type ${menuItem.type}`;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  getMenuItemSelected(): MenuItemDefinition | undefined {
    const menuItemId: string | undefined = typeof this.current.state.selectedIndex === "number"
      ? this.current.items[this.current.state.selectedIndex]
      : undefined;

    if (menuItemId) {
      return this.menuItems[menuItemId];
    }
  }

  onMenuLeft(): MenuModelCursor {
    const previous = this.cursor;
    const currentMenu = this.current;
    const currentMenuIndex = currentMenu.state.selectedIndex;
    if (currentMenuIndex <= 0) {
      return {
        ...previous,
        previous: undefined
      };
    }
    const newMenuitemIndex = currentMenuIndex - 1;
    return {
      ...this.setMenuItemSelection(newMenuitemIndex),
      previous
    };
  }

  onMenuRight(): MenuModelCursor {
    const previous = this.cursor;
    const currentMenu = this.current;
    const currentMenuIndex = currentMenu.state.selectedIndex;
    if (currentMenuIndex >= currentMenu.items.length - 1) {
      return {
        ...previous,
        previous: undefined
      };
    }
    const newMenuitemIndex = currentMenuIndex + 1;
    return {
      ...this.setMenuItemSelection(newMenuitemIndex),
      previous
    };
  }

  onMenuForward(): MenuModelCursor {
    const previous = this.cursor;
    const menuItem = this.getMenuItemSelected();
    if (!menuItem) {
      console.log("❗ onMenuForward this.getMenuItemSelected() is undefined");
      return previous;
    }
    switch (menuItem.type) {
      case MenuItemTypes.menu:
        const payloadMenu = menuItem.value as MenuItemActionMenu;
        const newMenuId = payloadMenu.menu;
        const newMenu = this.menus[newMenuId];
        if (newMenu === previous.menu) {
          console.log("❗ onMenuForward new menu is the same as the current");
          return previous;
        }
        this.menuHistory.push(previous.menu);
        return {
          ...this.setMenu(newMenuId),
          previous
        };
      default:
        console.log(`❗ MenuModel Unhandled: onMenuFoward where menuItem.type=${menuItem.type}`);
        return previous;
    }
  }

  onMenuBack(): MenuModelCursor {
    const previous = this.cursor;
    if (this.menuHistory.length > 0) {
      const previousMenu = this.menuHistory.pop()!;
      return {
        ...this.setMenu(previousMenu.id),
        previous
      };
    }
    return previous;
  }

  public get cursor(): MenuModelCursor {
    return {menu: this.current, item: this.getMenuItemSelected()};
  }

  reset(): MenuModelCursor {
    this.current = this.root;
    this.menuHistory = [];
    return this.cursor;
  }
}
