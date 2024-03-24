import { useQuery } from "@tanstack/react-query";
import { fetchBikeStation } from "./api";

import useBikeStationStore from "../../src/store/useBikeStationStore";
import { BikeInfo } from "../types/bikeInfo";

// type BikeQuery = {
//   data: undefined;
//   isError: boolean;
//   isPending: boolean;
//   queryFn?: undefined;
// };

export function useBikeStation() {
  const { setStations } = useBikeStationStore();
  return useQuery({
    queryKey: ["bikeStation"],
    queryFn: async () => {
      const res = await fetchBikeStation();
      setStations(res);
    },
  });
  //   return {
  //     isPending,
  //     isError,
  //     data,
  //   };
}
