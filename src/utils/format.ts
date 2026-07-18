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
