import { create } from "zustand";

type TyleLayersState = {
  tileLayerValue: {
    attribution: string;
    url: string;
    name: string;
    visible: boolean;
  };
  setTileLayerValue: (
    attribution: string,
    url: string,
    name: string,
    visible: boolean
  ) => void;
};

const useTileLayersStore = create<TyleLayersState>()((set) => ({
  tileLayerValue: {
    attribution:
      '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    name: "Carte France",
    visible: true,
  },

  setTileLayerValue: (
    attribution: string,
    url: string,
    name: string,
    visible: boolean
  ) =>
    set(() => ({
      tileLayerValue: {
        attribution: attribution,
        url: url,
        name: name,
        visible: visible,
      },
    })),
}));

export default useTileLayersStore;
