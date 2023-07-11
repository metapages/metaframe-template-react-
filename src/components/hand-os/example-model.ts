import { MetapageDefinitionV3 } from '@metapages/metapage';

import { SlidesProjectorUrl } from './constants';
import { RotateObject1 } from './example-model-metapages';
import exampleRotateEarth from './example-rotate-earth.metapage.json';
import {
  Menu,
  MenuConfig,
  MenuItemDefinition,
  MenuItemTypes,
} from './MenuModel';

const notionKey = "secret_LOPc0zkwYqlBsoK7gUPoRbqE3pjFljW9Bv7Ov0dHjUE";
const notionCache = true;

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
  sendToSlideProjector: `${SlidesProjectorUrl}/menu-1`,
};

const menu2: Menu = {
  id: "menu-2",
  items: [...threeSlidesMenu2.map((item) => item.id)],
  state: {
    selectedIndex: -1,
  },
  sendToSlideProjector: `${SlidesProjectorUrl}/menu-2`,
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
// menu2.items.unshift(menuItemGoToMenu1.id);
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

const metapageExampleRotateObjectEarth: MenuItemDefinition = {
  id: "Rotate earth",
  type: MenuItemTypes.metapage,
  value: {
    menu: menu2.id,
    metapage: exampleRotateEarth  as MetapageDefinitionV3, 
    // RotateObjectEarth as MetapageDefinitionV3,
  },
}
menu1.items.push(metapageExampleRotateObjectEarth.id);


const notionSlide1: MenuItemDefinition = {
  id: "notion slide 1",
  type: MenuItemTypes.notion,
  value: {
    key: notionKey,
    // page: "https://www.notion.so/metapages/slide-1-32be0e603c004579a7e5ffb60fba415c?pvs=4",
    page: "https://www.notion.so/metapages/1st-Slide-show-how-to-hold-the-phone-2bf0e1e1c63049a3ab03d2f437aa05bf?pvs=4",
    cache: notionCache,
  },
}
menu1.items.unshift(notionSlide1.id);

const notionSlide2: MenuItemDefinition = {
  id: "notion slide 2",
  type: MenuItemTypes.notion,
  value: {
    key: notionKey,
    page: "https://www.notion.so/metapages/slide-2-bc77e33c9e1b4f308e6d5dbcd1920652?pvs=4",
    cache: notionCache,
  },
}
menu1.items.push(notionSlide2.id);

const notionProjectAnywhere: MenuItemDefinition = {
  id: "notion project anywhere",
  type: MenuItemTypes.notion,
  value: {
    key: notionKey,
    page: "https://www.notion.so/metapages/You-can-project-anywhere-f158fc4a2ea6432496f9e2102f5cd567?pvs=4",
    cache: notionCache,
  },
}
menu1.items.push(notionProjectAnywhere.id);





const MENU_ITEMS: MenuItemDefinition[] = [
  ...threeSlidesMenu1,
  ...threeSlidesMenu2,
  metapageExample1,
  metapageExampleRotateObjectEarth,
  menuItemGoToMenu1,
  menuItemGoToMenu2,
  notionSlide1,
  notionSlide2,
  notionProjectAnywhere,
];

const MENUS: Menu[] = [menu1, menu2];

export const DemoMenuConfig :MenuConfig = {menus:MENUS, menuItems: MENU_ITEMS};
