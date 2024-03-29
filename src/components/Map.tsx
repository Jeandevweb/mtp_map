import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import useTileLayersStore from "../store/useTileLayersStore";
import BikeStationMarker from "./BikeStationMarker";
import LocationMarker from "./LocationMarker";

const Map = () => {
  const { tileLayerValue } = useTileLayersStore();

  console.log(tileLayerValue.url);

  return (
    <MapContainer center={[43.610769, 3.876716]} zoom={14}>
      <TileLayer
        attribution={tileLayerValue.attribution}
        url={tileLayerValue.url}
        zIndex={-100}
      />
      <LayersControl position="topleft" key="bikeStation">
        <BikeStationMarker />
      </LayersControl>
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
