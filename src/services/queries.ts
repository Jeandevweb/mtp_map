import { useQuery } from "@tanstack/react-query";
import type { LayerDef, MarkerData } from "../layers/types";
import useLayersStore from "../store/useLayersStore";

const REALTIME_REFRESH_MS = 60_000;

async function fetchLayer(layer: LayerDef): Promise<MarkerData[]> {
  const response = await fetch(layer.url);
  if (!response.ok) {
    throw new Error(`Impossible de charger « ${layer.label} » (${response.status})`);
  }
  return layer.toMarkers(await response.json());
}

/**
 * Données d'une couche, chargées uniquement quand elle est visible.
 * Les couches temps réel se rafraîchissent toutes les 60 s ; les couches
 * statiques (fichiers locaux) sont chargées une seule fois.
 */
export function useLayerData(layer: LayerDef) {
  const visible = useLayersStore((s) => s.visibility[layer.id]);

  return useQuery({
    queryKey: ["layer", layer.id],
    queryFn: () => fetchLayer(layer),
    enabled: visible,
    staleTime: layer.kind === "realtime" ? REALTIME_REFRESH_MS : Infinity,
    refetchInterval: layer.kind === "realtime" ? REALTIME_REFRESH_MS : false,
  });
}
