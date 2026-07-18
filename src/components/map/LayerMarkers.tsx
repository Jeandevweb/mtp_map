import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { LayerDef } from "../../layers/types";
import { useLayerData } from "../../services/queries";
import useLayersStore from "../../store/useLayersStore";
import { clusterIconFactory, layerMarkerIcon } from "../../utils/markerIcons";
import MarkerPopup from "./MarkerPopup";

type Props = { layer: LayerDef };

/**
 * Affiche tous les marqueurs d'une couche. Composant unique pour les 7
 * couches : les données arrivent déjà normalisées (MarkerData) par le
 * registre. Les couches denses sont regroupées en clusters.
 */
const LayerMarkers = memo(function LayerMarkers({ layer }: Props) {
  const visible = useLayersStore((s) => s.visibility[layer.id]);
  const { data } = useLayerData(layer);

  if (!visible || !data) return null;

  const markers = data.map((marker) => (
    <Marker
      key={marker.id}
      position={marker.position}
      icon={layerMarkerIcon(layer)}
      title={marker.title}
      alt={`${layer.shortLabel} : ${marker.title}`}
      riseOnHover
    >
      <Popup closeButton>
        <MarkerPopup layer={layer} marker={marker} />
      </Popup>
    </Marker>
  ));

  if (!layer.cluster) return <>{markers}</>;

  return (
    <MarkerClusterGroup
      chunkedLoading
      showCoverageOnHover={false}
      maxClusterRadius={60}
      spiderfyOnMaxZoom
      iconCreateFunction={clusterIconFactory(layer)}
    >
      {markers}
    </MarkerClusterGroup>
  );
});

export default LayerMarkers;
