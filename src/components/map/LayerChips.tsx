import {
  Box,
  Flex,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useIsFetching } from "@tanstack/react-query";
import { layers } from "../../layers/registry";
import type { LayerDef } from "../../layers/types";
import useLayersStore from "../../store/useLayersStore";

/**
 * Rangée de "chips" façon Google Maps : un raccourci par couche de
 * données, activable en un tap, qui sert aussi de légende — chaque
 * catégorie garde sa couleur et son pictogramme partout dans l'app.
 */
const LayerChips = () => (
  <Box
    position="absolute"
    top={{ base: "68px", md: "76px" }}
    left={{ base: 0, md: 4 }}
    right={{ base: 0, md: 4 }}
    zIndex="mapOverlay"
    overflowX="auto"
    px={{ base: 3, md: 0 }}
    pb="2"
    sx={{
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    }}
  >
    <Flex gap="2" w="max-content">
      {layers.map((layer) => (
        <LayerChip key={layer.id} layer={layer} />
      ))}
    </Flex>
  </Box>
);

const LayerChip = ({ layer }: { layer: LayerDef }) => {
  const active = useLayersStore((s) => s.visibility[layer.id]);
  const toggle = useLayersStore((s) => s.toggle);
  const isFetching =
    useIsFetching({ queryKey: ["layer", layer.id] }) > 0 && active;
  const shadow = useColorModeValue("floating", "floatingDark");

  return (
    <Flex
      as="button"
      onClick={() => toggle(layer.id)}
      aria-pressed={active}
      align="center"
      gap="2"
      h="38px"
      px="3.5"
      borderRadius="full"
      bg={active ? layer.color : "bg.surface"}
      color={active ? "white" : "fg.default"}
      boxShadow={shadow}
      fontSize="sm"
      fontWeight="500"
      whiteSpace="nowrap"
      transition="background-color 0.15s ease-out, color 0.15s ease-out, transform 0.15s ease-out"
      _hover={{ transform: "translateY(-1px)" }}
      _focusVisible={{
        outline: "none",
        boxShadow: "0 0 0 3px var(--chakra-colors-accent-300)",
      }}
    >
      {isFetching ? (
        <Spinner size="xs" speed="0.7s" />
      ) : (
        <Icon
          as={layer.icon}
          boxSize="3.5"
          color={active ? "white" : layer.color}
        />
      )}
      <Text as="span">{layer.shortLabel}</Text>
    </Flex>
  );
};

export default LayerChips;
