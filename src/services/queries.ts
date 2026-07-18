import { useQuery } from "@tanstack/react-query";
import { API } from "../layers/registry";
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

export type EcoHistoryPoint = { time: string; value: number };

/**
 * Historique horaire d'un éco-compteur (dernières 24 mesures).
 * L'API renvoie 404 quand la fenêtre ne contient aucun point : on le
 * traite comme « pas de données », pas comme une erreur.
 */
export function useEcoCounterHistory(counterId: string | null) {
  return useQuery({
    queryKey: ["eco-history", counterId],
    enabled: counterId !== null,
    staleTime: 10 * 60_000,
    queryFn: async (): Promise<EcoHistoryPoint[]> => {
      const to = new Date();
      const from = new Date(to.getTime() - 7 * 24 * 3600 * 1000);
      const fmt = (d: Date) => d.toISOString().slice(0, 19);
      const url = `${API}/ecocounter_timeseries/${counterId}/attrs/intensity?fromDate=${fmt(from)}&toDate=${fmt(to)}`;
      const response = await fetch(url);
      if (response.status === 404) return [];
      if (!response.ok) {
        throw new Error(`Historique du compteur indisponible (${response.status})`);
      }
      const data: { index: string[]; values: number[] } = await response.json();
      return data.index
        .map((time, i) => ({ time, value: data.values[i] ?? 0 }))
        .slice(-24);
    },
  });
}
