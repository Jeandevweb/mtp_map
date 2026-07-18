import { useQuery } from "@tanstack/react-query";
import { GeoJSON } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import type { GeoCollection, TramLineProps } from "../../types/geojson";
import useLayersStore from "../../store/useLayersStore";

/**
 * Tracé des 5 lignes de tramway, chacune dans sa couleur officielle TAM
 * (fournie par l'open data). Chargé uniquement quand la couche tram est
 * activée.
 */
const TramLines = () => {
  const visible = useLayersStore((s) => s.visibility.tram);

  const { data } = useQuery({
    queryKey: ["tram-lines"],
    queryFn: async (): Promise<GeoCollection<TramLineProps>> => {
      const res = await fetch("data/tram-lines.json");
      if (!res.ok) throw new Error("Impossible de charger les lignes de tram");
      return res.json();
    },
    enabled: visible,
    staleTime: Infinity,
  });

  if (!visible || !data) return null;

  return (
    <GeoJSON
      data={data as unknown as GeoJsonObject}
      style={(feature) => ({
        color: (feature?.properties as TramLineProps)?.code_couleur ?? "#F97316",
        weight: 3.5,
        opacity: 0.85,
      })}
    />
  );
};

export default TramLines;
