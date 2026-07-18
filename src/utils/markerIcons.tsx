import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import type { LayerDef } from "../layers/types";

/**
 * Fabrique les icônes Leaflet des marqueurs : une pastille ronde de la
 * couleur de la couche avec son pictogramme. Construites une seule fois
 * par couche (et non par marqueur) puis mises en cache.
 */

const iconCache = new Map<string, L.DivIcon>();

/**
 * `selected` : version agrandie avec anneau accent, utilisée pour le
 * marqueur dont le panneau de détail est ouvert — repérable d'un coup
 * d'œil parmi les autres.
 */
export function layerMarkerIcon(layer: LayerDef, selected = false): L.DivIcon {
  const key = selected ? `${layer.id}--selected` : layer.id;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const Icon = layer.icon;
  const size = selected ? 42 : 30;
  const html = renderToStaticMarkup(
    <span
      className={`mtp-pin${selected ? " mtp-pin--selected" : ""}`}
      style={{ backgroundColor: layer.color }}
    >
      <Icon size={selected ? 20 : 15} aria-hidden />
    </span>
  );
  const icon = L.divIcon({
    html,
    className: "mtp-pin-wrap",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
  iconCache.set(key, icon);
  return icon;
}

/** Icône de groupe (cluster) : cercle de la couleur de la couche avec le compte. */
export function clusterIconFactory(layer: LayerDef) {
  return (cluster: { getChildCount: () => number }) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 34 : count < 100 ? 40 : 46;
    return L.divIcon({
      html: `<div class="mtp-cluster" style="background-color:${layer.color};width:${size}px;height:${size}px">${count}</div>`,
      className: "mtp-pin-wrap",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };
}

/** Point bleu « ma position ». */
export const locateIcon = L.divIcon({
  html: '<div class="mtp-locate-dot"></div>',
  className: "mtp-pin-wrap",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/** Épingle du résultat de recherche d'adresse. */
export const searchPinIcon = L.divIcon({
  html: `<svg width="34" height="34" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(15,23,42,.4))">
    <path fill="#2563EB" stroke="white" stroke-width="24" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0z"/>
    <circle cx="192" cy="192" r="72" fill="white"/>
  </svg>`,
  className: "mtp-pin-wrap",
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -30],
});
