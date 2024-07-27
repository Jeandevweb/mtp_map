import L from "leaflet";
import bicycle from "../assets/bicycle.svg";
import home from "../assets/home.svg";
import parking from "../assets/parking.svg";
import position from "../assets/position.svg";

export const bikeIcon = new L.Icon({
  iconUrl: bicycle,
  iconRetinaUrl: bicycle,
  popupAnchor: [-0, -0],
  iconSize: [40, 40],
});

export const parkingIcon = new L.Icon({
  iconUrl: parking,
  iconRetinaUrl: parking,
  popupAnchor: [-0, -0],
  iconSize: [40, 40],
});

export const homeIcon = new L.Icon({
  iconUrl: home,
  iconRetinaUrl: home,
  popupAnchor: [-0, -0],
  iconSize: [60, 60],
});

export const positionIcon = new L.Icon({
  iconUrl: position,
  iconRetinaUrl: position,
  popupAnchor: [-0, -0],
  iconSize: [40, 40],
});
