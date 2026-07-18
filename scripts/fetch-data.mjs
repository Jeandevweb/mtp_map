/**
 * Télécharge les jeux de données statiques open data de Montpellier
 * vers public/data/ (les fichiers sont commités : le serveur
 * data.montpellier3m.fr n'envoie pas de header CORS, on ne peut donc
 * pas les récupérer depuis le navigateur).
 *
 * Le jeu de données IRVE (bornes de recharge) contient une entité par
 * point de charge (~1600, 3 Mo) : on l'agrège ici par station et on ne
 * garde que les champs utilisés par l'app (~150 Ko).
 *
 * Usage : node scripts/fetch-data.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = "https://data.montpellier3m.fr/sites/default/files/ressources";

const round6 = (n) => Math.round(n * 1e6) / 1e6;
const roundCoords = (coords) =>
  typeof coords[0] === "number"
    ? coords.map(round6)
    : coords.map(roundCoords);

function roundGeometry(geojson) {
  for (const f of geojson.features) {
    f.geometry.coordinates = roundCoords(f.geometry.coordinates);
  }
  return geojson;
}

function aggregateEvStations(geojson) {
  const stations = new Map();
  for (const f of geojson.features) {
    const p = f.properties;
    const key = p.id_station_itinerance || `${p.nom_station}|${p.coordonneesXY}`;
    let s = stations.get(key);
    if (!s) {
      s = {
        type: "Feature",
        geometry: f.geometry,
        properties: {
          id: key,
          nom_station: p.nom_station,
          adresse: p.adresse_station,
          commune: p.consolidated_commune,
          operateur: p.nom_operateur,
          nbre_pdc: p.nbre_pdc ?? 0,
          points_vus: 0,
          puissance_max: 0,
          gratuit: false,
          horaires: p.horaires,
          pmr: p.accessibilite_pmr,
          prises: [],
        },
      };
      stations.set(key, s);
    }
    const sp = s.properties;
    sp.points_vus += 1;
    sp.puissance_max = Math.max(sp.puissance_max, p.puissance_nominale ?? 0);
    if (p.gratuit === "True" || p.gratuit === true) sp.gratuit = true;
    for (const [flag, label] of [
      ["prise_type_2", "Type 2"],
      ["prise_type_combo_ccs", "Combo CCS"],
      ["prise_type_chademo", "CHAdeMO"],
      ["prise_type_ef", "Prise domestique"],
    ]) {
      if ((p[flag] === "True" || p[flag] === true) && !sp.prises.includes(label))
        sp.prises.push(label);
    }
  }
  for (const s of stations.values()) {
    const sp = s.properties;
    sp.nbre_pdc = Math.max(sp.nbre_pdc, sp.points_vus);
    delete sp.points_vus;
  }
  return { type: "FeatureCollection", features: [...stations.values()] };
}

const DATASETS = [
  { file: "tram-stops.json", url: `${BASE}/MMM_MMM_ArretsTram.json` },
  { file: "tram-lines.json", url: `${BASE}/MMM_MMM_LigneTram.json` },
  { file: "fountains.json", url: `${BASE}/VilleMTP_MTP_FontainesPublic.json` },
  { file: "toilets.json", url: `${BASE}/MMM_MTP_WC_Publics.json` },
  {
    file: "ev-chargers.json",
    url: `${BASE}/MMM_MMM_BornesElec.json`,
    transform: aggregateEvStations,
  },
];

const outDir = resolve(import.meta.dirname, "../public/data");
await mkdir(outDir, { recursive: true });

for (const { file, url, transform } of DATASETS) {
  process.stdout.write(`→ ${url}\n`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ÉCHEC ${res.status} ${res.statusText}`);
    process.exitCode = 1;
    continue;
  }
  let json = await res.json();
  if (transform) json = transform(json);
  json = roundGeometry(json);
  await writeFile(resolve(outDir, file), JSON.stringify(json));
  const kb = Math.round(JSON.stringify(json).length / 1024);
  process.stdout.write(
    `  OK → public/data/${file} (${json.features.length} entités, ${kb} Ko)\n`
  );
}

process.stdout.write(`\nSnapshot du ${new Date().toISOString().slice(0, 10)}\n`);
