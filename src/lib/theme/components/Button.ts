import { defineStyleConfig } from "@chakra-ui/react";

const buttonTheme = defineStyleConfig({
  defaultProps: {
    size: "sm",
    variant: "solid",
  },
});

export const Button = {
  ...buttonTheme,
  variants: {
    solid: (props: any) => {
      return {
        fontSize: props.fontSize || "0.9rem",
        fontWeight: props.fontWeight || 400,
      };
    },
  },
};