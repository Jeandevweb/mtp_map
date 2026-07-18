import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Switch,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FaCircleCheck, FaMoon, FaSun } from "react-icons/fa6";
import { layers } from "../../layers/registry";
import type { MarkerData } from "../../layers/types";
import useLayersStore from "../../store/useLayersStore";
import useUIStore from "../../store/useUIStore";
import { basemaps, previewTileUrl } from "../../utils/tileLayers";

/**
 * Panneau de réglages : thème, fond de carte, couches de données,
 * sources. Drawer latéral sur desktop, bottom sheet sur mobile.
 */
const SettingsPanel = () => {
  const isOpen = useUIStore((s) => s.isSettingsOpen);
  const setOpen = useUIStore((s) => s.setSettingsOpen);
  const placement = useBreakpointValue<"bottom" | "right">({
    base: "bottom",
    md: "right",
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      placement={placement ?? "right"}
      size={placement === "bottom" ? "full" : "sm"}
    >
      <DrawerOverlay bg="blackAlpha.400" />
      <DrawerContent
        bg="bg.surface"
        color="fg.default"
        borderTopRadius={placement === "bottom" ? "panel" : 0}
        maxH={placement === "bottom" ? "85dvh" : "100dvh"}
        mt={placement === "bottom" ? "auto" : 0}
      >
        <DrawerCloseButton borderRadius="10px" top="14px" />
        <DrawerHeader fontSize="lg" fontWeight="700" pb="2">
          Réglages
        </DrawerHeader>
        <DrawerBody pb="8">
          <SectionTitle>Apparence</SectionTitle>
          <ThemeSelector />

          <SectionTitle mt="7">Fond de carte</SectionTitle>
          <BasemapPicker />

          <SectionTitle mt="7">Couches de données</SectionTitle>
          <LayerList />

          <SectionTitle mt="7">Légende de disponibilité</SectionTitle>
          <StatusLegend />

          <SectionTitle mt="7">À propos</SectionTitle>
          <About />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const SectionTitle = ({
  children,
  mt,
}: {
  children: string;
  mt?: string | number;
}) => (
  <Text fontSize="sm" fontWeight="600" color="fg.muted" mb="3" mt={mt}>
    {children}
  </Text>
);

/** Choix clair / sombre : deux grandes cibles, état sélectionné évident. */
const ThemeSelector = () => {
  const { colorMode, setColorMode } = useColorMode();

  const options = [
    { id: "light", label: "Clair", icon: FaSun },
    { id: "dark", label: "Sombre", icon: FaMoon },
  ] as const;

  return (
    <SimpleGrid columns={2} gap="2">
      {options.map((option) => {
        const selected = colorMode === option.id;
        return (
          <Flex
            key={option.id}
            as="button"
            onClick={() => setColorMode(option.id)}
            aria-pressed={selected}
            align="center"
            justify="center"
            gap="2"
            h="44px"
            borderRadius="12px"
            borderWidth="2px"
            borderColor={selected ? "accent.solid" : "border.default"}
            bg={selected ? "accent.subtle" : "transparent"}
            fontWeight="500"
            fontSize="sm"
            transition="border-color 0.15s ease-out, background-color 0.15s ease-out"
            _hover={{ borderColor: selected ? "accent.solid" : "fg.muted" }}
            _focusVisible={{
              outline: "none",
              boxShadow: "0 0 0 3px var(--chakra-colors-accent-300)",
            }}
          >
            <Icon as={option.icon} boxSize="4" />
            {option.label}
          </Flex>
        );
      })}
    </SimpleGrid>
  );
};

/** Vignettes de fonds de carte : un vrai extrait de tuile comme aperçu. */
const BasemapPicker = () => {
  const basemapId = useUIStore((s) => s.basemapId);
  const setBasemapId = useUIStore((s) => s.setBasemapId);

  const options = [
    { id: "auto", name: "Auto (thème)", preview: null },
    ...basemaps.map((b) => ({ id: b.id, name: b.name, preview: previewTileUrl(b) })),
  ];

  return (
    <SimpleGrid columns={3} gap="2">
      {options.map((option) => {
        const selected = basemapId === option.id;
        return (
          <Box
            key={option.id}
            as="button"
            onClick={() => setBasemapId(option.id)}
            aria-pressed={selected}
            borderRadius="12px"
            overflow="hidden"
            borderWidth="2px"
            borderColor={selected ? "accent.solid" : "border.default"}
            position="relative"
            transition="border-color 0.15s ease-out"
            _hover={{ borderColor: selected ? "accent.solid" : "fg.muted" }}
            _focusVisible={{
              outline: "none",
              boxShadow: "0 0 0 3px var(--chakra-colors-accent-300)",
            }}
          >
            {option.preview ? (
              <Image
                src={option.preview}
                alt=""
                h="56px"
                w="100%"
                objectFit="cover"
                draggable={false}
              />
            ) : (
              <Flex
                h="56px"
                align="center"
                justify="center"
                bgGradient="linear(to-br, gray.100 50%, gray.800 50%)"
              >
                <Icon as={FaSun} color="gray.700" boxSize="3.5" mr="1" />
                <Icon as={FaMoon} color="gray.200" boxSize="3.5" />
              </Flex>
            )}
            {selected && (
              <Icon
                as={FaCircleCheck}
                position="absolute"
                top="1.5"
                right="1.5"
                color="accent.solid"
                bg="white"
                borderRadius="full"
                boxSize="4"
              />
            )}
            <Text fontSize="xs" py="1.5" fontWeight="500" noOfLines={1}>
              {option.name}
            </Text>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

/** Interrupteur par couche, avec le nombre d'éléments chargés. */
const LayerList = () => {
  const visibility = useLayersStore((s) => s.visibility);
  const toggle = useLayersStore((s) => s.toggle);
  const queryClient = useQueryClient();

  return (
    <Box>
      {layers.map((layer) => {
        const count = queryClient.getQueryData<MarkerData[]>([
          "layer",
          layer.id,
        ])?.length;
        return (
          <Flex key={layer.id} align="center" gap="3" py="2.5">
            <Flex
              align="center"
              justify="center"
              boxSize="34px"
              borderRadius="10px"
              bg={layer.color}
              color="white"
              flexShrink={0}
              aria-hidden
            >
              <Icon as={layer.icon} boxSize="4" />
            </Flex>
            <Box flex="1" minW={0}>
              <Flex align="center" gap="2">
                <Text fontSize="sm" fontWeight="500">
                  {layer.label}
                </Text>
                {visibility[layer.id] && count !== undefined && (
                  <Badge
                    borderRadius="full"
                    px="2"
                    fontSize="2xs"
                    textTransform="none"
                    colorScheme="gray"
                  >
                    {count}
                  </Badge>
                )}
              </Flex>
              <Text fontSize="xs" color="fg.muted" noOfLines={1}>
                {layer.description}
              </Text>
            </Box>
            <Switch
              isChecked={visibility[layer.id]}
              onChange={() => toggle(layer.id)}
              aria-label={`Afficher la couche ${layer.label}`}
            />
          </Flex>
        );
      })}
    </Box>
  );
};

/** Explique les couleurs des badges de disponibilité. */
const StatusLegend = () => {
  const items = [
    { color: "green.400", label: "Bonne disponibilité (≥ 50 %)" },
    { color: "orange.400", label: "Disponibilité limitée (20 – 50 %)" },
    { color: "red.400", label: "Presque complet (< 20 %)" },
  ];
  return (
    <Box>
      {items.map((item) => (
        <Flex key={item.label} align="center" gap="2.5" py="1">
          <Box boxSize="10px" borderRadius="full" bg={item.color} aria-hidden />
          <Text fontSize="sm" color="fg.muted">
            {item.label}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

const About = () => (
  <Box fontSize="sm" color="fg.muted">
    <Text>
      MTP Map rassemble les services utiles de Montpellier sur une seule
      carte : vélos et parkings en temps réel, tramway, fontaines, toilettes
      et bornes de recharge.
    </Text>
    <Text mt="2">
      Données :{" "}
      <Link
        href="https://data.montpellier3m.fr"
        isExternal
        color="accent.solid"
      >
        open data de Montpellier Méditerranée Métropole
      </Link>
      . Les données temps réel sont actualisées toutes les 60 secondes.
    </Text>
    <Text mt="2">
      Fond de carte ©{" "}
      <Link href="https://www.openstreetmap.org/copyright" isExternal color="accent.solid">
        OpenStreetMap
      </Link>{" "}
      · ©{" "}
      <Link href="https://carto.com/attributions" isExternal color="accent.solid">
        CARTO
      </Link>
    </Text>
  </Box>
);

export default SettingsPanel;
