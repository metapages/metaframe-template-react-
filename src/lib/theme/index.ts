import "@fontsource-variable/jetbrains-mono";
import { extendTheme } from "@chakra-ui/react";
import { defaultColors } from "./colors";
import { contentHeight, footerHeight, headerHeight, panelHeaderHeight } from "./constants";
import { Input } from './components/Input';
import { Code } from './components/Code';
import { Button } from './components/Button';
import { Icon } from './components/Icon';
import { Tabs } from './components/Tabs';
import { Table } from './components/Table';
import { Text } from './components/Text';

const getColor = (theme: any, color: string, fallback: string): string => {
  const chakraColor = color.split(".");

  if (Object.prototype.hasOwnProperty.call(theme.colors, chakraColor[0])) {
    if (Object.prototype.hasOwnProperty.call(theme.colors[chakraColor[0]], chakraColor[1])) {
      return theme.colors[chakraColor[0]][chakraColor[1]];
    }
  }

  return theme.colors[fallback]["300"];
};

const theme = extendTheme(defaultColors, {
  sizes: {
    contentHeight,
    headerHeight,
    footerHeight,
    panelHeaderHeight,
  },
  borders: {
    "1px": `1px solid ${getColor(defaultColors, "gray.300", "gray")}`,
  },
  fonts: {
    body: `'JetBrains Mono Variable', monospace`,
    mono: `'JetBrains Mono Variable', monospace`,
  },
  components: {
    Text,
    Icon,
    Input,
    Code,
    Tabs,
    Table,
    Button,
    PanelContainer: {
      baseStyle: {
        bg: "gray.100",
        w: "100%",
        minHeight: contentHeight,
        maxHeight: contentHeight,
        overflow: "scroll",
      },
    },
    PanelHeaderContainer: {
      baseStyle: {
        w: "100%",
        minHeight: 6,
        maxHeight: 6,
        borderBottom: "1px solid",
        borderColor: "gray.300",
      },
    },
  },
});

export default theme;