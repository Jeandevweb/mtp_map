import { MapContainer, TileLayer } from "react-leaflet";
import useTileLayersStore from "../store/useTileLayersStore";
import BikeStationMarker from "./BikeStationMarker";
import LocationMarker from "./LocationMarker";
import LeafletgeoSearch from "./LeafletgeoSearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

const Map = () => {
  const { tileLayerValue } = useTileLayersStore();

  return (
    <MapContainer center={[43.610769, 3.876716]} zoom={14}>
      <TileLayer
        attribution={tileLayerValue.attribution}
        url={tileLayerValue.url}
        zIndex={-100}
      />
      <BikeStationMarker />
      <LocationMarker />
      <LeafletgeoSearch />
    </MapContainer>
  );
};

export default Map;
