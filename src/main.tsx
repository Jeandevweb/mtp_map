import { ChakraProvider, ColorModeScript, createStandaloneToast } from "@chakra-ui/react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { theme } from "./theme.tsx";

import "@fontsource-variable/inter";
import "leaflet/dist/leaflet.css";
import "./css/index.css";
import "./css/leaflet-overrides.css";

const { ToastContainer, toast } = createStandaloneToast({ theme });

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Une erreur réseau ne bloque jamais la carte : on prévient, c'est tout.
    onError: (error, query) => {
      const id = `query-error-${query.queryHash}`;
      if (toast.isActive(id)) return;
      toast({
        id,
        title: "Données indisponibles",
        description:
          error instanceof Error
            ? error.message
            : "Vérifiez votre connexion puis réessayez.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
        <ToastContainer />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
