import "@fontsource-variable/jetbrains-mono";
import { defineStyle, defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { defaultColors } from "./colors";
import { contentHeight, footerHeight, headerHeight, panelHeaderHeight } from "./constants";

const getColor = (theme: any, color: string, fallback: string): string => {
  const chakraColor = color.split(".");

  if (Object.prototype.hasOwnProperty.call(theme.colors, chakraColor[0])) {
    if (Object.prototype.hasOwnProperty.call(theme.colors[chakraColor[0]], chakraColor[1])) {
      return theme.colors[chakraColor[0]][chakraColor[1]];
    }
  }

  return theme.colors[fallback]["300"];
};

export const inputTheme = defineStyleConfig({
  defaultProps: {
    size: "sm",
    variant: "outline",
  },
});

export const buttonTheme = defineStyleConfig({
  defaultProps: {
    size: "sm",
    variant: "solid",
  },
});

export const codeTheme = defineStyle({
  fontSize: "0.9rem",
  fontWeight: 500,
});

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
    Text: {
      baseStyle: (props: any) => {
        return {
          color: props.color || "gray.600",
          fontSize: props.fontSize || "0.9rem",
        };
      },
    },
    Icon: {
      baseStyle: (props: any) => {
        return {
          color: props.color || "gray.600",
          boxSize: props.boxSize || "1.2rem",
          cursor: props.cursor || "pointer",
        };
      },
    },
    Input: {
      ...inputTheme,
      variants: {
        outline: {
          field: {
            bg: "#ECECEC !important",
            border: "1px solid",
            borderRadius: "5px",
            borderColor: "gray.300",
            _hover: {
              borderColor: "gray.87",
            },
            _focusVisible: {
              outline: "none",
              borderColor: "gray.87",
              boxShadow: "0 0 0 0px transparent !important",
            },
          },
        },
      },
    },
    Code: {
      variants: { subtle: codeTheme },
    },
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
    Tabs: {
      variants: {
        line: {
          tab: {
            border: "none",
            borderBottom: "none",
            color: "none",
            borderColor: "none",
            bg: "gray.300",
            _selected: {
              border: "none",
              borderColor: "none",
              color: "none",
              bg: "none",
              borderBottom: "none",
            },
          },
          tablist: {
            borderBottom: "0px solid",
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          td: {
            fontSize: "0.8rem",
            borderColor: "gray.87",
          },
          thead: {
            borderBottom: "1px solid var(--chakra-colors-gray-87)",
          },
        },
      },
    },
    Button: {
      ...buttonTheme,
      variants: {
        solid: (props: any) => {
          return {
            fontSize: props.fontSize || "0.9rem",
            fontWeight: props.fontWeight || 400,
          };
        },
      },
    },
  },
});

export default theme;