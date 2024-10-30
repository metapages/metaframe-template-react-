import { extendTheme } from "@chakra-ui/react";

export const defaultColors = extendTheme({
  colors: {
    gray: {
      100: "rgba(0, 0, 0, 0.03)",
      300: "#DEDEDE",
      600: "#585858",
    },
  },
});
