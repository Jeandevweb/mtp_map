/** Petites fonctions de formatage partagées. */

/** [a, b] → [lat, lng] quel que soit l'ordre d'origine.
 * Autour de Montpellier, lat ≈ 43.x et lng ≈ 3.x-4.x : les plages ne se
 * recouvrent pas, on peut donc détecter l'ordre de façon fiable
 * (l'API ecocounter renvoie [lat, lng] alors que bikestation renvoie [lng, lat]).
 */
export function toLatLng([a, b]: [number, number]): [number, number] {
  return a > 20 ? [a, b] : [b, a];
}

/** "2026-07-17T04:00:00Z" → "il y a 2 h" */
export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

/** "GARE SUD DE FRANCE" → "Gare Sud De France" (les données arrivent souvent en capitales). */
export function titleCase(value: string): string {
  return value
    .toLocaleLowerCase("fr-FR")
    .replace(/(^|[\s\-'’])(\p{L})/gu, (m) => m.toLocaleUpperCase("fr-FR"));
}

/**
 * Couleur sémantique d'un taux de disponibilité :
 * vert ≥ 50 %, orange 20-50 %, rouge < 20 %, gris si inconnu.
 */
export function statusColorScheme(
  ratio: number | null
): "green" | "orange" | "red" | "gray" {
  if (ratio === null || Number.isNaN(ratio)) return "gray";
  if (ratio < 0.2) return "red";
  if (ratio < 0.5) return "orange";
  return "green";
}

/** Pluralise simplement : plural(2, "vélo") → "2 vélos". */
export function plural(count: number, word: string): string {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

/** Distance à vol d'oiseau en mètres entre deux points [lat, lng] (haversine). */
export function distanceMeters(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number]
): number {
  const R = 6_371_000;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * "à 350 m · 5 min à pied" — arrondi lisible, marche estimée à 80 m/min.
 * Au-delà de 15 km on n'affiche plus le temps de marche.
 */
export function formatDistanceWalk(meters: number): string {
  const distance =
    meters < 1000
      ? `${Math.max(10, Math.round(meters / 10) * 10)} m`
      : `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
  if (meters > 15_000) return `à ${distance}`;
  const minutes = Math.max(1, Math.round(meters / 80));
  return `à ${distance} · ${minutes} min à pied`;
}
