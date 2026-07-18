import type { IconType } from "react-icons";

export type LayerId =
  | "bikes"
  | "parkings"
  | "tram"
  | "ecocounters"
  | "fountains"
  | "toilets"
  | "ev";

/** Disponibilité d'un lieu, utilisée pour colorer les badges (vert/orange/rouge). */
export type MarkerStatus = {
  /** Taux de disponibilité entre 0 et 1, ou null si non applicable. */
  ratio: number | null;
  /** Texte court affiché dans le badge, ex. "12 vélos". */
  label: string;
};

export type MarkerField = { label: string; value: string };

/** Représentation normalisée d'un point, quelle que soit la source de données. */
export type MarkerData = {
  id: string;
  position: [number, number]; // toujours [lat, lng]
  title: string;
  subtitle?: string;
  status?: MarkerStatus;
  /** Champs détaillés, affichés dans le popup (2-3 premiers) et le panneau de détail (tous). */
  fields: MarkerField[];
  /** Horodatage ISO de la donnée pour les sources temps réel. */
  updatedAt?: string;
};

export type LayerDef = {
  id: LayerId;
  /** Nom affiché dans les réglages, ex. "Stations VéloMagg". */
  label: string;
  /** Nom court pour les chips sur la carte, ex. "Vélos". */
  shortLabel: string;
  description: string;
  icon: IconType;
  /** Couleur de la catégorie (marqueurs, chips, popups). */
  color: string;
  kind: "realtime" | "static";
  url: string;
  /** Regroupe les marqueurs proches quand ils sont nombreux. */
  cluster: boolean;
  defaultVisible: boolean;
  /** Normalise la réponse brute de l'API/du GeoJSON en marqueurs. */
  toMarkers: (raw: unknown) => MarkerData[];
  /** Source open data affichée dans "À propos". */
  attribution: string;
};
