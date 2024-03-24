import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";

import { useBikeStation } from "./services/queries";

import BikeStationMarker from "./components/BikeStationMarker";
import { useEffect } from "react";
import LocationMarker from "./components/LocationMarker";

function App() {
  const { data } = useBikeStation();

  useEffect(() => {
    if (!data) return;
  }, [data]);

  return (
    <MapContainer center={[43.610769, 3.876716]} zoom={14}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Bike Station">
          <BikeStationMarker />
        </LayersControl.Overlay>
      </LayersControl>
      <LocationMarker />
    </MapContainer>
  );
}

export default App;
