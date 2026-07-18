/** Fonds de carte disponibles. Le choix "auto" suit le thème clair/sombre. */

export type Basemap = {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
};

const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CARTO_ATTR = `${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`;

export const cartoLight: Basemap = {
  id: "carto-light",
  name: "Clair",
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution: CARTO_ATTR,
  maxZoom: 20,
};

export const cartoDark: Basemap = {
  id: "carto-dark",
  name: "Sombre",
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution: CARTO_ATTR,
  maxZoom: 20,
};

export const basemaps: Basemap[] = [
  cartoLight,
  cartoDark,
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: `${OSM_ATTR} contributors`,
    maxZoom: 19,
  },
  {
    id: "cyclosm",
    name: "Cyclable",
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution: `${OSM_ATTR} contributors · CyclOSM`,
    maxZoom: 19,
  },
  {
    id: "esri-satellite",
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri — Source : Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
];

/** Résout le fond réellement affiché ("auto" → clair ou sombre selon le thème). */
export function resolveBasemap(id: string, colorMode: "light" | "dark"): Basemap {
  if (id === "auto") return colorMode === "dark" ? cartoDark : cartoLight;
  return basemaps.find((b) => b.id === id) ?? cartoLight;
}

/**
 * URL d'une tuile du centre de Montpellier (zoom 13), utilisée comme
 * vignette d'aperçu dans les réglages — un vrai extrait de carte plutôt
 * qu'une image embarquée.
 */
export function previewTileUrl(basemap: Basemap): string {
  return basemap.url
    .replace("{s}", "a")
    .replace("{r}", "")
    .replace("{z}", "13")
    .replace("{x}", "4184")
    .replace("{y}", "2991");
}
