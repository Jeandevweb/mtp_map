import { Flex, Image, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import useTileLayersStore from "../../store/useTileLayersStore";
import { tileLayers } from "../../utils/tileLayers";

const MapLayers = () => {
  const { tileLayerValue, setTileLayerValue } = useTileLayersStore();

  return (
    <AnimatePresence>
      {tileLayers.map((tile) => {
        return (
          <Flex
            as={motion.div}
            key={tile.name}
            boxShadow="lg"
            rounded="2xl"
            padding="12px"
            marginBottom="10px"
            color="darkslategrey"
            backgroundColor="whiteAlpha.900"
            zIndex={10}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1 },
            }}
            cursor="pointer"
            onClick={() =>
              setTileLayerValue(
                tile.attribution,
                tile.url,
                tile.name,
                !tile.visible
              )
            }
          >
            <Flex align="center" flex="1">
              <Image
                as={motion.img}
                borderRadius="10px"
                src={tile.image || tile.url}
                background={"no-repeat"}
                height={"100%"}
                width={"100%"}
                boxSize="42px"
                objectFit="cover"
                marginRight="20px"
                rounded="xl"
                boxShadow="md"
                sx={{
                  filter: tileLayerValue.url === tile.url ? "grayscale(0)" : "",
                  outline:
                    tileLayerValue.url === tile.url ? "4px double #32a1ce" : "",
                  borderRadius: tileLayerValue.url === tile.url ? "10px" : "",
                }}
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 },
                }}
              />
              <Flex
                width="75%"
                direction="column"
                justify="center"
                as="span"
                textAlign="left"
              >
                <Text fontSize="14px" fontWeight="400">
                  {tile.name}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        );
      })}
    </AnimatePresence>
  );
};

export default MapLayers;
