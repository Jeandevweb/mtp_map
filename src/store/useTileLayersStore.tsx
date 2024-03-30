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
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    name: "Carte Esri",
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
