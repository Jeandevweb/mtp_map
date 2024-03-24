import { create } from "zustand";

type BikeStationState = {
  stations: [];
  setStations: (value: []) => void;
  locationClient: [number, number];
  setLocationClient: (value: [number, number]) => void;
};

const useBikeStationStore = create<BikeStationState>()((set) => ({
  stations: [],
  setStations: (value) => set(() => ({ stations: value })),

  locationClient: [43.610769, 3.876716],
  setLocationClient: (value) => set(() => ({ locationClient: value })),
}));

export default useBikeStationStore;
