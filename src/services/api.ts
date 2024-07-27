import { BikeInfo } from "../types/bikeInfo";

export const fetchBikeStation = async (): Promise<BikeInfo> => {
  const response = await fetch(
    "https://portail-api-data.montpellier3m.fr/bikestation?limit=1000"
  );
  if (!response.ok) {
    throw new Error("Could not fetch bike from the bikestation");
  }
  return response.json();
};

export const fetchParkingPlaces = async (): Promise<BikeInfo> => {
  const response = await fetch(
    "https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000"
  );
  if (!response.ok) {
    throw new Error("Could not fetch parking places");
  }
  return response.json();
};
