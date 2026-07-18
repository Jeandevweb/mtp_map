/**
 * Types pour l'API temps réel de Montpellier Méditerranée Métropole
 * (portail-api-data.montpellier3m.fr, format NGSI v2 : chaque champ est
 * enveloppé dans { type, value, metadata }).
 */

export type NgsiValue<T> = {
  type?: string;
  value: T;
  metadata?: Record<string, { type?: string; value: string }>;
};

export type NgsiPoint = {
  type: "Point";
  /** Attention : l'ordre varie selon les jeux de données ([lng,lat] ou [lat,lng]). */
  coordinates: [number, number];
};

export type BikeStation = {
  id: string;
  type: "BikeHireDockingStation";
  address: NgsiValue<{
    addressCountry?: string;
    addressLocality?: string;
    streetAddress: string;
  }>;
  availableBikeNumber: NgsiValue<number>;
  freeSlotNumber: NgsiValue<number>;
  totalSlotNumber: NgsiValue<number>;
  status: NgsiValue<string>;
  location: NgsiValue<NgsiPoint>;
};

export type OffStreetParking = {
  id: string;
  type: "OffStreetParking";
  name: NgsiValue<string>;
  availableSpotNumber: NgsiValue<number>;
  totalSpotNumber: NgsiValue<number>;
  status: NgsiValue<string>;
  category: NgsiValue<string[]>;
  allowedVehicleType: NgsiValue<string[]>;
  requiredPermit: NgsiValue<string>;
  location: NgsiValue<NgsiPoint>;
};

export type EcoCounter = {
  id: string;
  type: "EcoCounter";
  intensity: NgsiValue<number>;
  laneId: NgsiValue<number>;
  reversedLane: NgsiValue<boolean>;
  vehicleType: NgsiValue<string>;
  location: NgsiValue<NgsiPoint>;
};
