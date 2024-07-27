import { Marker, Popup, useMapEvents } from "react-leaflet";

import useBikeStationStore from "../store/useBikeStationStore";

import { homeIcon } from "../utils/icons";
import { useState } from "react";
import useGenericStore from "../store/useGenericStore";

const LocationMarker = () => {
  const { locationClient, setLocationClient } = useBikeStationStore();
  const [clikedOnMap, setClickOnMap] = useState(false);
  const setOpenInfo = useGenericStore((state) => state.setOpenInfo);
  const setIsOpenGeneric = useGenericStore((state) => state.setIsOpenGeneric);

  const map = useMapEvents({
    click() {
      setClickOnMap(true);
      setIsOpenGeneric();
      // map.locate();
      clikedOnMap ? setOpenInfo(false) : null;
    },
    locationfound(e: any) {
      console.log("clic", clikedOnMap);
      setLocationClient(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

export default LocationMarker;
