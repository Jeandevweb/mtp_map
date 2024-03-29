import "./App.css";
import "leaflet/dist/leaflet.css";

import { useBikeStation } from "./services/queries";

import { useEffect } from "react";
import Map from "./components/Map";
import CardControl from "./components/CardControl/CardControl";
import { Box } from "@chakra-ui/react";

function App() {
  const { data } = useBikeStation();

  useEffect(() => {
    if (!data) return;
  }, [data]);

  return (
    <Box height="100vh" width="100vw" position="relative">
      <CardControl />
      <Map />
    </Box>
  );
}

export default App;
