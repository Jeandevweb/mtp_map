import { Marker, Popup, useMapEvents } from "react-leaflet";

import useBikeStationStore from "../store/useBikeStationStore";

import { homeIcon } from "../utils/icons";

const LocationMarker = () => {
  const { locationClient, setLocationClient } = useBikeStationStore();
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e: any) {
      setLocationClient(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return (
    <>
      <Marker position={locationClient} icon={homeIcon}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  );
};

export default LocationMarker;
