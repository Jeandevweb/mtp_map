import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { theme } from "./theme.tsx";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Fonts from "./assets/Fonts.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoaderComponent from "./components/LoaderComponent.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Fonts />
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
