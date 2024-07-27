import { useQuery } from "@tanstack/react-query";
import { fetchBikeStation, fetchParkingPlaces } from "./api";

import useBikeStationStore from "../../src/store/useBikeStationStore";
import useParkingPlacesStore from "../store/useParkingPlacesStore";

export function useBikeStation() {
  const { setStations } = useBikeStationStore();

  return useQuery({
    queryKey: ["bikeStation"],
    queryFn: async () => {
      const res = await fetchBikeStation();
      setStations(res);
      return res;
    },
  });
}
export function useParkingPlaces() {
  const { setPlaces } = useParkingPlacesStore();
  return useQuery({
    queryKey: ["parkingplaces"],
    queryFn: async () => {
      const res = await fetchParkingPlaces();
      setPlaces(res);
      return res;
    },
  });
}
