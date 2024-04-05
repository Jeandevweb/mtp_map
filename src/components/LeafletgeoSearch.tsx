import { useEffect, EffectCallback } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { positionIcon } from "../utils/icons";

const LeafletgeoSearch = () => {
  const map = useMap();
  useEffect((): ReturnType<EffectCallback> => {
    const provider: OpenStreetMapProvider = new OpenStreetMapProvider({
      params: {
        "accept-language": "fr",
        countrycodes: "fr",
        citycodes: 34172,
      },
    });
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: "bar",
      notFoundMessage: "Sorry, that address could not be found.",
      marker: {
        icon: positionIcon,
      },
      autoClose: true,
    });

    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

export default LeafletgeoSearch;
