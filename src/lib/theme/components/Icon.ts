export const Icon = {
  baseStyle: (props: any) => {
    return {
      color: props.color || "gray.600",
      boxSize: props.boxSize || "1.2rem",
      cursor: props.cursor || "pointer",
    };
  },
};