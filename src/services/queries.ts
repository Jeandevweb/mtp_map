import { useQuery } from "@tanstack/react-query";
import { fetchBikeStation } from "./api";

import useBikeStationStore from "../../src/store/useBikeStationStore";

export function useBikeStation() {
  const { setStations } = useBikeStationStore();
  return useQuery({
    queryKey: ["bikeStation"],
    queryFn: async () => {
      const res = await fetchBikeStation();
      setStations(res);
    },
  });
}
