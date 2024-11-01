import { defineStyleConfig } from "@chakra-ui/react";

export const inputTheme = defineStyleConfig({
  defaultProps: {
    size: "sm",
    variant: "outline",
  },
});

export const Input = {
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
};