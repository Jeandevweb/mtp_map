import { Marker, Popup } from "react-leaflet";
import { Fragment } from "react/jsx-runtime";
import useBikeStationStore from "../store/useBikeStationStore";
import useGenericStore from "../store/useGenericStore";
import { BikeInfo } from "../types/bikeInfo";
import { linkGoogle, linkGooglePlus } from "../utils/externalLink";

import { bikeIcon } from "../utils/icons";
import { Box, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";

const BikeStationMarker = () => {
  const stations = useBikeStationStore((state) => state.stations);
  const isShowStation = useBikeStationStore((state) => state.isShowStation);
  const setOpenInfo = useGenericStore((state) => state.setOpenInfo);
  const setId = useGenericStore((state) => state.setId);

  return (
    <>
      {isShowStation &&
        stations?.map((station: BikeInfo) => {
          return (
            <Fragment key={station.id}>
              <Marker
                position={[
                  station.location.value.coordinates[1],
                  station.location.value.coordinates[0],
                ]}
                icon={bikeIcon}
                eventHandlers={{
                  click: () => {
                    setId(station.id);
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
                        {station.address.value.streetAddress}
                        <Link
                          onClick={() => setOpenInfo(true)}
                          fontSize="md"
                          marginLeft="15px"
                        >
                          Voir plus...
                        </Link>
                      </Heading>
                      <Text as="i">
                        Vélo disponible : {station.availableBikeNumber.value} /{" "}
                        {station.totalSlotNumber.value}
                      </Text>
                      <Divider
                        w="100%"
                        height="1px"
                        bg="lightgray"
                        borderRadius="5px"
                      />
                      <Link
                        href={linkGoogle(
                          station.location.value.coordinates[1],
                          station.location.value.coordinates[0],
                          station.id
                        )}
                        isExternal
                      >
                        Ouvrir dans Google Maps
                      </Link>
                      <Link
                        href={linkGooglePlus(
                          station.location.value.coordinates[1],
                          station.location.value.coordinates[0]
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

export default BikeStationMarker;
