import france from "../img/france.png";
import carteCyclable from "../img/carteCyclable.png";
import carteMtb from "../img/carteMtb.png";
export const tileLayers = [
  {
    attribution:
      '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    name: "Carte France",
    image: france,
    visible: true,
  },
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    name: "Carte Cyclable",
    image: carteCyclable,
    visible: false,
  },
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    name: "Carte Esri",
    visible: false,
  },
  {
    attribution:
      'Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS',
    url: "http://{s}.tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
    name: "Carte Mtb",
    image: carteMtb,
    visible: false,
  },
];
