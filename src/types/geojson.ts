/** Types minimaux pour les GeoJSON statiques servis depuis public/data/. */

export type GeoFeature<P> = {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString" | "MultiLineString";
    coordinates: number[] | number[][] | number[][][];
  };
  properties: P;
};

export type GeoCollection<P> = {
  type: "FeatureCollection";
  features: GeoFeature<P>[];
};

export type TramStopProps = {
  description: string;
  lignes_passantes: string;
  lignes_et_directions: string;
  station: string;
  commune: string;
};

export type TramLineProps = {
  id_lignes_sens: string;
  nom_ligne: string;
  num_exploitation: number;
  sens: string;
  code_couleur: string;
};

export type FountainProps = {
  noms: string;
  adresses: string;
  commune: string;
  nettoyage: string;
  gestionnai: string;
};

export type ToiletProps = {
  nom: string;
  h_ouvert: string;
  hfermeture: string;
  pmr: string;
  enservice: string;
  extparkint: string;
  gestion: string;
};

export type EvChargerProps = {
  id: string;
  nom_station: string;
  adresse: string;
  commune: string;
  operateur: string;
  nbre_pdc: number;
  puissance_max: number;
  gratuit: boolean;
  horaires: string;
  pmr: string;
  prises: string[];
};
