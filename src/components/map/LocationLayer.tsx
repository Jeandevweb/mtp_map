import { useState } from "react";
import { Circle, Marker, useMapEvents } from "react-leaflet";
import { useToast } from "@chakra-ui/react";
import type { LatLng } from "leaflet";
import { locateIcon } from "../../utils/markerIcons";

/**
 * Affiche la position de l'utilisateur (point bleu + cercle de précision)
 * quand la géolocalisation est demandée via le bouton « Ma position ».
 */
const LocationLayer = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const toast = useToast();

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
    },
    locationerror() {
      toast({
        title: "Position indisponible",
        description:
          "Autorisez la géolocalisation dans votre navigateur pour vous situer sur la carte.",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
    },
  });

  if (!position) return null;

  return (
    <>
      {accuracy > 25 && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#3B82F6",
            weight: 1,
            opacity: 0.4,
            fillOpacity: 0.08,
          }}
        />
      )}
      <Marker
        position={position}
        icon={locateIcon}
        alt="Votre position"
        interactive={false}
      />
    </>
  );
};

export default LocationLayer;
