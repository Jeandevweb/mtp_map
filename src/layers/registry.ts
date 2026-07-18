import {
  FaBicycle,
  FaChargingStation,
  FaFaucetDrip,
  FaGaugeHigh,
  FaRestroom,
  FaSquareParking,
  FaTrainTram,
} from "react-icons/fa6";
import type { BikeStation, EcoCounter, OffStreetParking } from "../types/ngsi";
import type {
  EvChargerProps,
  FountainProps,
  GeoCollection,
  ToiletProps,
  TramStopProps,
} from "../types/geojson";
import { plural, timeAgo, titleCase, toLatLng } from "../utils/format";
import type { LayerDef, LayerId, MarkerData } from "./types";

export const API = "https://portail-api-data.montpellier3m.fr";

/** Les compteurs qui n'ont pas émis depuis 24 h sont considérés hors service. */
const ECOCOUNTER_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const layers: LayerDef[] = [
  {
    id: "bikes",
    label: "Stations VéloMagg",
    shortLabel: "Vélos",
    description: "Vélos en libre-service, disponibilité en temps réel.",
    icon: FaBicycle,
    color: "#0D9488",
    kind: "realtime",
    url: `${API}/bikestation?limit=1000`,
    cluster: false,
    defaultVisible: true,
    attribution: "Montpellier Méditerranée Métropole — VéloMagg (temps réel)",
    toMarkers: (raw) =>
      (raw as BikeStation[])
        .filter((s) => s.location?.value?.coordinates)
        .map((s) => {
          const bikes = Number(s.availableBikeNumber?.value ?? 0);
          const free = Number(s.freeSlotNumber?.value ?? 0);
          const total = Number(s.totalSlotNumber?.value ?? 0);
          return {
            id: s.id,
            position: toLatLng(s.location.value.coordinates),
            title: titleCase(s.address?.value?.streetAddress ?? "Station VéloMagg"),
            subtitle: "Station VéloMagg",
            status:
              total > 0
                ? { ratio: bikes / total, label: plural(bikes, "vélo") }
                : undefined,
            fields: [
              { label: "Vélos disponibles", value: `${bikes} / ${total}` },
              { label: "Places libres", value: `${free} / ${total}` },
              {
                label: "État",
                value: s.status?.value === "working" ? "En service" : "Hors service",
              },
            ],
          };
        }),
  },
  {
    id: "parkings",
    label: "Parkings en ouvrage",
    shortLabel: "Parkings",
    description: "Places disponibles dans les parkings, en temps réel.",
    icon: FaSquareParking,
    color: "#4F46E5",
    kind: "realtime",
    url: `${API}/offstreetparking?limit=1000`,
    cluster: false,
    defaultVisible: true,
    attribution: "Montpellier Méditerranée Métropole — Parkings (temps réel)",
    toMarkers: (raw) =>
      (raw as OffStreetParking[])
        .filter((p) => p.location?.value?.coordinates)
        .map((p) => {
          const available = Number(p.availableSpotNumber?.value ?? 0);
          const total = Number(p.totalSpotNumber?.value ?? 0);
          const open = p.status?.value?.toLowerCase() !== "closed";
          return {
            id: p.id,
            position: toLatLng(p.location.value.coordinates),
            title: titleCase(p.name?.value ?? "Parking"),
            subtitle: "Parking en ouvrage",
            status: !open
              ? { ratio: 0, label: "Fermé" }
              : total > 0
                ? { ratio: available / total, label: plural(available, "place") }
                : undefined,
            fields: [
              { label: "Places disponibles", value: `${available} / ${total}` },
              { label: "État", value: open ? "Ouvert" : "Fermé" },
            ],
          };
        }),
  },
  {
    id: "tram",
    label: "Arrêts de tramway",
    shortLabel: "Tram",
    description: "Les 5 lignes de tramway TAM et leurs stations.",
    icon: FaTrainTram,
    color: "#F97316",
    kind: "static",
    url: "data/tram-stops.json",
    cluster: true,
    defaultVisible: false,
    attribution: "Montpellier Méditerranée Métropole — Réseau TAM",
    toMarkers: (raw) => {
      // Une entité par quai : on regroupe par nom de station.
      const byName = new Map<string, MarkerData>();
      const linesByName = new Map<string, Set<string>>();
      for (const f of (raw as GeoCollection<TramStopProps>).features) {
        if (f.geometry.type !== "Point") continue;
        const name = f.properties.description;
        const lines = (f.properties.lignes_passantes ?? "")
          .split(/\D+/)
          .filter(Boolean);
        const knownLines = linesByName.get(name);
        if (knownLines) {
          lines.forEach((l) => knownLines.add(l));
          const marker = byName.get(name)!;
          marker.fields[0].value = formatLines(knownLines);
          marker.subtitle = `Tram · ${formatLines(knownLines)}`;
          continue;
        }
        const set = new Set(lines);
        linesByName.set(name, set);
        byName.set(name, {
          id: `tram-${name}`,
          position: toLatLng(f.geometry.coordinates as [number, number]),
          title: name,
          subtitle: `Tram · ${formatLines(set)}`,
          fields: [
            { label: "Lignes", value: formatLines(set) },
            { label: "Commune", value: f.properties.commune },
          ],
        });
      }
      return [...byName.values()];
    },
  },
  {
    id: "ecocounters",
    label: "Compteurs vélo",
    shortLabel: "Compteurs",
    description: "Passages de vélos mesurés en temps réel par les éco-compteurs.",
    icon: FaGaugeHigh,
    color: "#8B5CF6",
    kind: "realtime",
    url: `${API}/ecocounter?limit=1000`,
    cluster: true,
    defaultVisible: false,
    attribution: "Montpellier Méditerranée Métropole — Éco-compteurs (temps réel)",
    toMarkers: (raw) =>
      (raw as EcoCounter[])
        .filter((c) => {
          const iso = c.intensity?.metadata?.TimeInstant?.value;
          if (!c.location?.value?.coordinates || !iso) return false;
          // Écarte les capteurs muets depuis plus de 24 h (données trompeuses).
          return Date.now() - new Date(iso).getTime() < ECOCOUNTER_MAX_AGE_MS;
        })
        .map((c) => {
          const iso = c.intensity!.metadata!.TimeInstant.value;
          const count = Number(c.intensity.value ?? 0);
          return {
            id: c.id,
            position: toLatLng(c.location.value.coordinates),
            title: "Compteur vélo",
            subtitle: `${plural(count, "passage")} sur la dernière heure`,
            fields: [
              { label: "Passages (dernière heure)", value: String(count) },
              { label: "Mesure", value: timeAgo(iso) },
            ],
            updatedAt: iso,
          };
        }),
  },
  {
    id: "fountains",
    label: "Fontaines à boire",
    shortLabel: "Fontaines",
    description: "Points d'eau potable en libre accès.",
    icon: FaFaucetDrip,
    color: "#0EA5E9",
    kind: "static",
    url: "data/fountains.json",
    cluster: true,
    defaultVisible: false,
    attribution: "Ville de Montpellier — Fontaines publiques",
    toMarkers: (raw) =>
      (raw as GeoCollection<FountainProps>).features
        .filter((f) => f.geometry.type === "Point")
        .map((f, i) => ({
          id: `fountain-${i}`,
          position: toLatLng(f.geometry.coordinates as [number, number]),
          title: "Fontaine à boire",
          subtitle: titleCase(
            [f.properties.adresses, f.properties.commune]
              .filter((v) => v && v.trim())
              .join(", ") || "Adresse inconnue"
          ),
          fields: [
            { label: "Adresse", value: titleCase(f.properties.adresses || "—") },
            { label: "Commune", value: f.properties.commune },
            { label: "Nettoyage", value: f.properties.nettoyage?.trim() || "—" },
          ],
        })),
  },
  {
    id: "toilets",
    label: "Toilettes publiques",
    shortLabel: "WC",
    description: "Toilettes publiques de la ville de Montpellier.",
    icon: FaRestroom,
    color: "#64748B",
    kind: "static",
    url: "data/toilets.json",
    cluster: true,
    defaultVisible: false,
    attribution: "Ville de Montpellier — WC publics",
    toMarkers: (raw) =>
      (raw as GeoCollection<ToiletProps>).features
        .filter((f) => f.geometry.type === "Point")
        .map((f, i) => {
          const p = f.properties;
          const inService = p.enservice === "En Service";
          return {
            id: `toilet-${i}`,
            position: toLatLng(f.geometry.coordinates as [number, number]),
            title: titleCase(p.nom),
            subtitle: "Toilettes publiques",
            status: inService
              ? undefined
              : { ratio: 0, label: "Hors service" },
            fields: [
              { label: "Horaires", value: `${p.h_ouvert} – ${p.hfermeture}` },
              { label: "Accès PMR", value: p.pmr === "PMR" ? "Oui" : "Non" },
              { label: "État", value: inService ? "En service" : "Hors service" },
            ],
          };
        }),
  },
  {
    id: "ev",
    label: "Bornes de recharge",
    shortLabel: "Recharge",
    description: "Stations de recharge pour véhicules électriques.",
    icon: FaChargingStation,
    color: "#16A34A",
    kind: "static",
    url: "data/ev-chargers.json",
    cluster: true,
    defaultVisible: false,
    attribution: "data.gouv.fr / Qualicharge — Bornes IRVE de la métropole",
    toMarkers: (raw) =>
      (raw as GeoCollection<EvChargerProps>).features
        .filter((f) => f.geometry.type === "Point")
        .map((f) => {
          const p = f.properties;
          return {
            id: p.id,
            position: toLatLng(f.geometry.coordinates as [number, number]),
            title: p.nom_station,
            subtitle: `${plural(p.nbre_pdc, "point")} de charge · ${p.puissance_max} kW max`,
            fields: [
              { label: "Points de charge", value: String(p.nbre_pdc) },
              { label: "Puissance max", value: `${p.puissance_max} kW` },
              { label: "Prises", value: p.prises.join(", ") || "—" },
              { label: "Tarif", value: p.gratuit ? "Gratuit" : "Payant" },
              { label: "Horaires", value: p.horaires || "—" },
              { label: "Adresse", value: `${p.adresse}, ${p.commune ?? ""}` },
            ],
          };
        }),
  },
];

function formatLines(lines: Set<string>): string {
  const sorted = [...lines].sort((a, b) => Number(a) - Number(b));
  return `${sorted.length > 1 ? "Lignes" : "Ligne"} ${sorted.join(", ")}`;
}

export const layerById = new Map<LayerId, LayerDef>(
  layers.map((l) => [l.id, l])
);
