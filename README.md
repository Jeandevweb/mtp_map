# MTP Map — Montpellier en direct

Carte interactive des services utiles de Montpellier, alimentée par
l'open data de Montpellier Méditerranée Métropole :

- 🚲 **Stations VéloMagg** — vélos disponibles en temps réel (actualisé toutes les 60 s)
- 🅿️ **Parkings en ouvrage** — places libres en temps réel
- 🚊 **Tramway** — les 5 lignes (tracés aux couleurs officielles TAM) et leurs stations
- 📈 **Compteurs vélo** — passages mesurés en temps réel par les éco-compteurs
- ⛲ **Fontaines à boire**, 🚻 **toilettes publiques**, 🔌 **bornes de recharge**

Interface façon Google Maps : la carte occupe tout l'écran, l'UI flotte
au-dessus (recherche d'adresse, chips de couches, panneaux de détail et de
réglages), avec thème clair/sombre synchronisé au fond de carte et un
design entièrement responsive (bottom sheets sur mobile).

## Captures d'écran

> _À ajouter : capture desktop clair, desktop sombre, mobile._

## Stack

- **React 18 + TypeScript + Vite**
- **Leaflet / react-leaflet** (+ clustering via react-leaflet-cluster)
- **Chakra UI** (design system : tokens sémantiques clair/sombre, police Inter)
- **Zustand** (état UI, préférences persistées en localStorage)
- **TanStack Query** (cache et rafraîchissement des données temps réel)

### Architecture : le registre de couches

Toute la logique métier tient dans [src/layers/registry.ts](src/layers/registry.ts) :
chaque couche de données est **une entrée de configuration** (icône, couleur,
source, transformation vers un format normalisé `MarkerData`). Les composants
(marqueurs, popups, chips, réglages, panneau de détail) sont 100 % génériques —
ajouter une couche ne demande aucun nouveau composant.

## Données

| Source | Type | Accès |
|---|---|---|
| [API temps réel 3M](https://portail-api.montpellier3m.fr) (`bikestation`, `offstreetparking`, `ecocounter`) | NGSI v2 | fetch direct (CORS ouvert), refresh 60 s |
| [Fichiers open data 3M](https://data.montpellier3m.fr) (tram, fontaines, WC, bornes IRVE) | GeoJSON | snapshot commité dans `public/data/` |

Les fichiers statiques sont téléchargés par `node scripts/fetch-data.mjs`
(le serveur open data n'envoie pas d'en-têtes CORS ; le script agrège aussi
les ~1 600 points de charge IRVE en ~340 stations). **Snapshot : juillet 2026.**

Particularité amusante de l'API : `bikestation` renvoie ses coordonnées en
`[lng, lat]` mais `ecocounter` en `[lat, lng]` — normalisé par
`toLatLng()` dans [src/utils/format.ts](src/utils/format.ts).

## Lancer le projet

```bash
npm install
npm run dev        # serveur de dev Vite
npm run build      # tsc + build de production
npm run preview    # prévisualisation du build
node scripts/fetch-data.mjs   # rafraîchir les données statiques
```

Aucune clé d'API nécessaire.

## Déploiement

Prêt pour Vercel : connectez le repo GitHub sur [vercel.com](https://vercel.com),
framework « Vite », rien d'autre à configurer (`vercel.json` ajoute juste du
cache sur `/data/*`). Fonctionne aussi sur Netlify ou toute plateforme statique.

## Design

Les choix de design (hiérarchie, couleur, typographie, responsive,
accessibilité) sont expliqués dans [DESIGN.md](DESIGN.md).

## Licences des données

Données sous [Licence Ouverte / Open Licence](https://www.etalab.gouv.fr/licence-ouverte-open-licence)
(Montpellier Méditerranée Métropole, Ville de Montpellier, data.gouv.fr).
Fonds de carte © [OpenStreetMap](https://www.openstreetmap.org/copyright) © [CARTO](https://carto.com/attributions).
