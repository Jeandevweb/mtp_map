import { IconButton, useColorModeValue } from "@chakra-ui/react";
import type { Map as LeafletMap } from "leaflet";
import { FaLocationCrosshairs } from "react-icons/fa6";

type Props = {
  map: LeafletMap | null;
};

/** Bouton « Ma position » : centre la carte sur l'utilisateur. */
const LocateFab = ({ map }: Props) => {
  const shadow = useColorModeValue("floating", "floatingDark");

  return (
    <IconButton
      aria-label="Me localiser sur la carte"
      icon={<FaLocationCrosshairs />}
      onClick={() => map?.locate({ setView: true, maxZoom: 16 })}
      position="absolute"
      right={{ base: 3, md: 4 }}
      bottom={{ base: "148px", md: "156px" }}
      zIndex="mapOverlay"
      boxSize="44px"
      borderRadius="12px"
      bg="bg.surface"
      color="accent.solid"
      boxShadow={shadow}
      _hover={{ bg: "bg.hover" }}
      fontSize="18px"
    />
  );
};

export default LocateFab;
