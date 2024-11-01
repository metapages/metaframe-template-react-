import { defineStyle } from "@chakra-ui/react";

const codeTheme = defineStyle({
  fontSize: "0.9rem",
  fontWeight: 500,
});

export const Code = {
  variants: { subtle: codeTheme },
}