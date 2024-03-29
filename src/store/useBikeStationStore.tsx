import { create } from "zustand";
import { BikeInfo } from "../types/bikeInfo";

type BikeStationState = {
  stations: BikeInfo[];
  setStations: (value: BikeInfo[]) => void;
  locationClient: [number, number];
  setLocationClient: (value: [number, number]) => void;

  isShowStation: boolean;
  setisShowStation: () => void;
};

const useBikeStationStore = create<BikeStationState>()((set) => ({
  stations: [],
  setStations: (value) => set(() => ({ stations: value })),

  locationClient: [43.610769, 3.876716],
  setLocationClient: (value) => set(() => ({ locationClient: value })),

  isShowStation: true,
  setisShowStation: () =>
    set((state) => ({ isShowStation: !state.isShowStation })),
}));

export default useBikeStationStore;
