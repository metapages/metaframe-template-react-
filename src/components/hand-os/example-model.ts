import { MetapageDefinitionV3 } from '@metapages/metapage';

import { RotateObject1 } from './example-model-metapages';
import {
  Menu,
  MenuItemDefinition,
  MenuItemTypes,
  MenuModel,
} from './MenuModel';

const menuItemUrlTextSlide1: MenuItemDefinition = {
  id: "text slide 1",
  type: MenuItemTypes.url,
  value: {
    url: `https://markdown.mtfm.io/#?base64=${btoa("# Slide 1!")}`,
  },
};

const menuItemUrlTextSlide2: MenuItemDefinition = {
  id: "text slide 2",
  type: MenuItemTypes.url,
  value: {
    url: `https://markdown.mtfm.io/#?base64=${btoa("# Slide 2!")}`,
  },
};

const menuItemUrlTextSlide3: MenuItemDefinition = {
  id: "text slide 3",
  type: MenuItemTypes.url,
  value: {
    url: `https://markdown.mtfm.io/#?base64=${btoa("# Slide 3!")}`,
  },
};

const threeSlidesMenu1: MenuItemDefinition[] = [
  menuItemUrlTextSlide1,
  menuItemUrlTextSlide2,
  menuItemUrlTextSlide3,
];

// generate identical slides for menu 2 but slight name change
const threeSlidesMenu2: MenuItemDefinition[] = [
  ...threeSlidesMenu1.map((item, i) => ({
    ...item,
    id: `${item.id}-menu2`,
    value: {
      url: `https://markdown.mtfm.io/#?base64=${btoa(
        `# Slide ${i + 1} but MENU 2!`
      )}`,
    },
  })),
];

const menu1: Menu = {
  id: "menu-1",
  items: [...threeSlidesMenu1.map((item) => item.id)],
  state: {
    selectedIndex: -1,
  },
  sendToSlideProjector: "https://slides-remote.glitch.me/menu-1",
};

const menu2: Menu = {
  id: "menu-2",
  items: [...threeSlidesMenu2.map((item) => item.id)],
  state: {
    selectedIndex: -1,
  },
  sendToSlideProjector: "https://slides-remote.glitch.me/menu-2",
};

const menuItemGoToMenu1: MenuItemDefinition = {
  id: "Go to Menu 1",
  type: MenuItemTypes.menu,
  value: {
    menu: menu1.id,
    url: `https://markdown.mtfm.io/#?base64=${btoa("# Go to Menu 1")}`,
  },
};

const menuItemGoToMenu2: MenuItemDefinition = {
  id: "Go to Menu 2",
  type: MenuItemTypes.menu,
  value: {
    menu: menu2.id,
    url: `https://markdown.mtfm.io/#?base64=${btoa("# Go to Menu 2")}`,
  },
};

menu1.items.push(menuItemGoToMenu2.id);
menu2.items.push(menuItemGoToMenu1.id);

const metapageExample1: MenuItemDefinition = {
  id: "Rotate widget",
  type: MenuItemTypes.metapage,
  value: {
    menu: menu2.id,
    metapage: RotateObject1 as MetapageDefinitionV3,
  },
}
menu1.items.push(metapageExample1.id);

export const MENU_ITEMS: MenuItemDefinition[] = [
  ...threeSlidesMenu1,
  ...threeSlidesMenu2,
  metapageExample1,
  menuItemGoToMenu1,
  menuItemGoToMenu2,
];

export const MENUS: Menu[] = [menu1, menu2];

export const DEMO_MENU = new MenuModel(MENUS, MENU_ITEMS);
