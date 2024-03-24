import L from "leaflet";
import bicycle from "../assets/bicycle.svg";
import home from "../assets/home.svg";

export const bikeIcon = new L.Icon({
  iconUrl: bicycle,
  iconRetinaUrl: bicycle,
  popupAnchor: [-0, -0],
  iconSize: [60, 60],
});

export const homeIcon = new L.Icon({
  iconUrl: home,
  iconRetinaUrl: home,
  popupAnchor: [-0, -0],
  iconSize: [60, 60],
});
