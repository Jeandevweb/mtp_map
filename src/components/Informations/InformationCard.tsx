import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import useBikeStationStore from "../../store/useBikeStationStore";
import useGenericStore from "../../store/useGenericStore";
import { BikeInfo } from "../../types/bikeInfo";

const InformationCard = () => {
  const stations = useBikeStationStore((state) => state.stations);
  const id = useGenericStore((state) => state.id);
  const openInfo = useGenericStore((state) => state.openInfo);

  return (
    <AnimatePresence>
      {openInfo && (
        <VStack
          as={motion.aside}
          initial={{
            opacity: 0,
            width: 0,
          }}
          animate={{
            opacity: 1,
            width: "250px",
          }}
          exit={{
            opacity: 0,
            width: 0,
          }}
          h="200px"
          w="250px"
          bg="rgba(246,246,246,0.8)"
          position="fixed"
          zIndex={999}
          left="23px"
          top="100px"
          color="black"
          padding="10px"
          borderRadius="10px"
        >
          <Box
            opacity="none"
            backgroundColor="white"
            padding="7px 5px"
            zIndex={1999}
            width="100%"
            height="100%"
            maxHeight="200px"
            overflowY="scroll"
            sx={{
              "&::-webkit-scrollbar": {
                w: "2",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                bg: "blackAlpha.100",
              },
            }}
            borderRadius="10px"
          >
            {stations?.map((station: BikeInfo) => {
              console.log(id === station.id && station);
              return (
                id === station.id && (
                  <>
                    <Heading textAlign="center" size="md" marginBottom="5px">
                      {" "}
                      {station.address.value.streetAddress}{" "}
                    </Heading>
                    <Text as="i">
                      Vélo disponible : {station.availableBikeNumber.value} /{" "}
                      {station.totalSlotNumber.value}
                    </Text>
                    <br />
                    <Text as="i">
                      Place libre : {station.freeSlotNumber.value} /{" "}
                      {station.totalSlotNumber.value}
                    </Text>
                  </>
                )
              );
            })}
          </Box>
        </VStack>
      )}
    </AnimatePresence>
  );
};

export default InformationCard;
