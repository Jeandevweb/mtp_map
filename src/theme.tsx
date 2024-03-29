import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Quicksand",
    body: "Quicksand",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  colors: {
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#111",
    },
    black: "#000000",
    white: "#ffffff",
  },
  breakpoints: {
    base: "0em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
  },
});
