import { Box } from "@chakra-ui/react";
import type { Map as LeafletMap } from "leaflet";
import { useState } from "react";
import DetailPanel from "./components/DetailPanel";
import LocateFab from "./components/LocateFab";
import SearchBar from "./components/SearchBar";
import LayerChips from "./components/map/LayerChips";
import MapView from "./components/map/MapView";
import SettingsPanel from "./components/settings/SettingsPanel";

/**
 * La carte occupe tout l'écran ; le reste de l'interface flotte
 * au-dessus (recherche, chips de couches, panneaux).
 */
function App() {
  const [map, setMap] = useState<LeafletMap | null>(null);

  return (
    <Box h="100dvh" w="100%" position="relative" overflow="hidden">
      <MapView onMapReady={setMap} />
      <SearchBar map={map} />
      <LayerChips />
      <LocateFab map={map} />
      <DetailPanel />
      <SettingsPanel />
    </Box>
  );
}

export default App;
