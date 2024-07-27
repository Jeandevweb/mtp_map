import "./css/App.css";
import "leaflet/dist/leaflet.css";

import { useBikeStation, useParkingPlaces } from "./services/queries";

import { useEffect } from "react";
import Map from "./components/Map";
import CardControl from "./components/CardControl/CardControl";
import { Box } from "@chakra-ui/react";
import InformationCard from "./components/Informations/InformationCard";

function App() {
  const { data: bikestation } = useBikeStation();
  const { data: parkingplaces } = useParkingPlaces();

  useEffect(() => {
    if (!bikestation) return;
    if (!parkingplaces) return;
  }, [bikestation, parkingplaces]);

  return (
    <Box height="100vh" width="100vw" position="relative">
      <CardControl />
      <InformationCard />
      <Map />
    </Box>
  );
}

export default App;
