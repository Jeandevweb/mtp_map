import { create } from "zustand";
import { ParkingPlaces } from "../types/parkingPlaces";

type ParkingPlaceState = {
  places: ParkingPlaces[];
  setPlaces: (value: any) => void;

  isShowPlaces: boolean;
  setisShowPlaces: () => void;
};

const useParkingPlacesStore = create<ParkingPlaceState>()((set) => ({
  places: [],
  setPlaces: (value: ParkingPlaces[]) => set(() => ({ places: value })),

  isShowPlaces: true,
  setisShowPlaces: () =>
    set((state) => ({ isShowPlaces: !state.isShowPlaces })),
}));

export default useParkingPlacesStore;
