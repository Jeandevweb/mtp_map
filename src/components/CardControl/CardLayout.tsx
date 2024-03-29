import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import useTileLayersStore from "../../store/useTileLayersStore";
import { tileLayers } from "../../utils/tileLayers";

const CardLayout = () => {
  const { tileLayerValue, setTileLayerValue } = useTileLayersStore();

  return (
    <Box
      as={motion.div}
      top="95px"
      zIndex={999}
      right="20px"
      position="absolute"
      backgroundColor="white"
      color="white"
      padding="15px 15px 5px"
      transition="all 1s ease-out"
      borderRadius="10px"
    >
      {tileLayers.map((tile) => {
        return (
          <Flex
            key={tile.name}
            boxShadow="lg"
            rounded="2xl"
            padding="12px"
            marginBottom="10px"
            color="darkslategrey"
            backgroundColor="whiteAlpha.900"
            zIndex={10}
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
                sx={
                  tileLayerValue.url === tile.url && {
                    filter: "grayscale(0)",
                    outline: "4px double #32a1ce",
                    borderRadius: "10px",
                  }
                }
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 },
                }}
                onClick={() =>
                  setTileLayerValue(
                    tile.attribution,
                    tile.url,
                    tile.name,
                    !tile.visible
                  )
                }
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
    </Box>
  );
};

export default CardLayout;
