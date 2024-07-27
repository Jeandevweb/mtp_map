import { Marker, Popup } from "react-leaflet";
import { Fragment } from "react/jsx-runtime";
import useParkingPlacesStore from "../store/useParkingPlacesStore";
import useGenericStore from "../store/useGenericStore";

import { ParkingPlaces } from "../types/parkingPlaces";

import { linkGoogle, linkGooglePlus } from "../utils/externalLink";

import { parkingIcon } from "../utils/icons";
import { Box, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";

const ParkingPlacesMarker = () => {
  const { places, isShowPlaces } = useParkingPlacesStore();
  const setOpenInfo = useGenericStore((state) => state.setOpenInfo);
  const setId = useGenericStore((state) => state.setId);

  return (
    <>
      {isShowPlaces &&
        places?.map((places: ParkingPlaces) => {
          return (
            <Fragment key={places.id}>
              <Marker
                position={[
                  places.location.value.coordinates[1],
                  places.location.value.coordinates[0],
                ]}
                icon={parkingIcon}
                eventHandlers={{
                  click: () => {
                    setId(places.id);
                    setOpenInfo(false);
                  },
                }}
              >
                <Box
                  onClick={() => console.log("cliked")}
                  onChange={(e) => console.log(e)}
                >
                  <Popup
                    eventHandlers={{
                      click: () => {
                        console.log("marker clicked");
                      },
                    }}
                  >
                    <Flex direction="column" align="center" gap="2">
                      <Heading as="h4" size="md">
                        {places.name.value}
                        <Link
                          onClick={() => setOpenInfo(true)}
                          fontSize="md"
                          marginLeft="15px"
                        >
                          Voir plus...
                        </Link>
                      </Heading>
                      <Text as="i">
                        Places disponibles : {places.availableSpotNumber.value}{" "}
                        / {places.totalSpotNumber.value}
                      </Text>
                      <Divider
                        w="100%"
                        height="1px"
                        bg="lightgray"
                        borderRadius="5px"
                      />
                      <Link
                        href={linkGoogle(
                          places.location.value.coordinates[1],
                          places.location.value.coordinates[0],
                          places.id
                        )}
                        isExternal
                      >
                        Ouvrir dans Google Maps
                      </Link>
                      <Link
                        href={linkGooglePlus(
                          places.location.value.coordinates[1],
                          places.location.value.coordinates[0]
                        )}
                        isExternal
                      >
                        Calcul d'itinéraire dans Google Maps
                      </Link>
                    </Flex>
                  </Popup>
                </Box>
              </Marker>
            </Fragment>
          );
        })}
    </>
  );
};

export default ParkingPlacesMarker;
