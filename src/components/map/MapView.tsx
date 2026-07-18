import { useColorMode } from "@chakra-ui/react";
import type { Map as LeafletMap } from "leaflet";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { layers } from "../../layers/registry";
import useUIStore from "../../store/useUIStore";
import { searchPinIcon } from "../../utils/markerIcons";
import { resolveBasemap } from "../../utils/tileLayers";
import LayerMarkers from "./LayerMarkers";
import LocationLayer from "./LocationLayer";
import TramLines from "./TramLines";

const MONTPELLIER_CENTER: [number, number] = [43.610769, 3.876716];

/** Recale la grille de tuiles si le conteneur change de taille
 * (rotation d'écran, redimensionnement de fenêtre…). */
const InvalidateOnResize = () => {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
};

type Props = {
  onMapReady: (map: LeafletMap) => void;
};

/** La carte plein écran : fond de carte lié au thème + les 7 couches de données. */
const MapView = ({ onMapReady }: Props) => {
  const { colorMode } = useColorMode();
  const basemapId = useUIStore((s) => s.basemapId);
  const searchResult = useUIStore((s) => s.searchResult);
  const basemap = resolveBasemap(basemapId, colorMode);

  return (
    <MapContainer
      center={MONTPELLIER_CENTER}
      zoom={14}
      minZoom={10}
      zoomControl={false}
      ref={onMapReady}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        key={basemap.id}
        url={basemap.url}
        attribution={basemap.attribution}
        maxZoom={basemap.maxZoom}
      />
      <ZoomControl position="bottomright" />
      <InvalidateOnResize />
      <TramLines />
      {layers.map((layer) => (
        <LayerMarkers key={layer.id} layer={layer} />
      ))}
      <LocationLayer />
      {searchResult && (
        <Marker position={searchResult.position} icon={searchPinIcon}>
          <Popup closeButton={false}>
            <span style={{ display: "block", padding: "10px 14px", fontSize: 13 }}>
              {searchResult.label}
            </span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
