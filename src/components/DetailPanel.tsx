import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Link,
  Progress,
  Skeleton,
  Text,
  useColorModeValue,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowUpRightFromSquare,
  FaDiamondTurnRight,
  FaHeart,
  FaPersonWalking,
  FaRegHeart,
  FaXmark,
} from "react-icons/fa6";
import { Fragment } from "react";
import EcoCounterSparkline from "./EcoCounterSparkline";
import ErrorBoundary from "./ErrorBoundary";
import { layerById } from "../layers/registry";
import { useLayerData } from "../services/queries";
import useFavoritesStore from "../store/useFavoritesStore";
import useUIStore from "../store/useUIStore";
import type { LayerDef } from "../layers/types";
import { googleMapsDirections, googleMapsSearch } from "../utils/externalLink";
import {
  distanceMeters,
  formatDistanceWalk,
  statusColorScheme,
  timeAgo,
} from "../utils/format";

/**
 * Panneau de détail d'un lieu, ouvert via « Détails » dans un popup.
 * Desktop : panneau flottant à gauche ; mobile : bottom sheet.
 * Générique : fonctionne pour les 7 couches de données.
 */
const DetailPanel = () => {
  const selection = useUIStore((s) => s.selection);
  const layer = selection ? layerById.get(selection.layerId) : undefined;

  return (
    <AnimatePresence>
      {selection && layer && (
        <DetailPanelContent
          key={selection.markerId}
          layer={layer}
          markerId={selection.markerId}
        />
      )}
    </AnimatePresence>
  );
};

const DetailPanelContent = ({
  layer,
  markerId,
}: {
  layer: LayerDef;
  markerId: string;
}) => {
  const setSelection = useUIStore((s) => s.setSelection);
  const userPosition = useUIStore((s) => s.userPosition);
  const { data, isLoading } = useLayerData(layer);
  const marker = data?.find((m) => m.id === markerId);
  const reducedMotion = usePrefersReducedMotion();
  const shadow = useColorModeValue("floating", "floatingDark");
  const distance =
    userPosition && marker ? distanceMeters(userPosition, marker.position) : null;
  const isFavorite = useFavoritesStore((s) =>
    s.favorites.some((f) => f.markerId === markerId)
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const close = () => setSelection(null);
  const status = marker?.status;
  const colorScheme = status ? statusColorScheme(status.ratio) : null;

  // Une seule animation (fondu + légère montée) valable pour les deux
  // dispositions : le style responsive reste du ressort de Chakra, la
  // transition vit dans les variantes pour ne pas entrer en conflit avec
  // la prop `transition` (CSS) de Chakra.
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const motionProps = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { type: "tween", duration: 0.25, ease: easeOut },
        },
        exit: {
          opacity: 0,
          y: 24,
          transition: { type: "tween", duration: 0.15, ease: easeOut },
        },
      };

  return (
    <Box
      as={motion.section}
      {...motionProps}
      aria-label={marker ? `Détails : ${marker.title}` : "Détails du lieu"}
      position="absolute"
      zIndex="panel"
      bg="bg.surface"
      boxShadow={shadow}
      display="flex"
      flexDirection="column"
      left={{ base: 0, md: 4 }}
      right={{ base: 0, md: "auto" }}
      bottom={{ base: 0, md: 6 }}
      top={{ base: "auto", md: "76px" }}
      w={{ base: "auto", md: "380px" }}
      maxH={{ base: "60%", md: "none" }}
      borderRadius={{ base: "16px 16px 0 0", md: "panel" }}
      pb={{ base: "env(safe-area-inset-bottom)", md: 0 }}
    >
      {/* Poignée visuelle du bottom sheet (mobile uniquement) */}
      <Box
        display={{ base: "block", md: "none" }}
        w="36px"
        h="4px"
        borderRadius="full"
        bg="border.default"
        mx="auto"
        mt="2.5"
        flexShrink={0}
        aria-hidden
      />

      <Flex align="flex-start" gap="3" p="5" pb="3" flexShrink={0}>
        <Flex
          align="center"
          justify="center"
          boxSize="44px"
          borderRadius="12px"
          bg={layer.color}
          color="white"
          flexShrink={0}
          aria-hidden
        >
          <Icon as={layer.icon} boxSize="5" />
        </Flex>
        <Box flex="1" minW={0}>
          {marker ? (
            <>
              <Text fontWeight="700" fontSize="md" lineHeight="short">
                {marker.title}
              </Text>
              {marker.subtitle && (
                <Text fontSize="sm" color="fg.muted" mt="0.5">
                  {marker.subtitle}
                </Text>
              )}
              {distance !== null && (
                <Flex align="center" gap="1.5" mt="1" color="fg.muted">
                  <Icon as={FaPersonWalking} boxSize="3.5" aria-hidden />
                  <Text fontSize="sm">{formatDistanceWalk(distance)}</Text>
                </Flex>
              )}
            </>
          ) : (
            <>
              <Skeleton h="18px" w="70%" borderRadius="md" />
              <Skeleton h="14px" w="45%" mt="2" borderRadius="md" />
            </>
          )}
        </Box>
        {marker && (
          <IconButton
            aria-label={
              isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
            aria-pressed={isFavorite}
            icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
            size="sm"
            variant="ghost"
            color={isFavorite ? "red.400" : "fg.muted"}
            borderRadius="10px"
            onClick={() =>
              toggleFavorite({
                layerId: layer.id,
                markerId: marker.id,
                title: marker.title,
                subtitle: marker.subtitle,
                position: marker.position,
              })
            }
          />
        )}
        <IconButton
          aria-label="Fermer le panneau de détails"
          icon={<FaXmark />}
          size="sm"
          variant="ghost"
          color="fg.muted"
          borderRadius="10px"
          onClick={close}
        />
      </Flex>

      <Box px="5" pb="5" overflowY="auto">
        {status && colorScheme && (
          <Flex align="center" gap="3" mb="4">
            {status.ratio !== null && (
              <Progress
                value={Math.round(status.ratio * 100)}
                colorScheme={colorScheme}
                size="sm"
                borderRadius="full"
                flex="1"
                bg="bg.hover"
                aria-label="Taux de disponibilité"
              />
            )}
            <Badge
              colorScheme={colorScheme}
              borderRadius="full"
              px="2.5"
              py="0.5"
              textTransform="none"
            >
              {status.label}
            </Badge>
          </Flex>
        )}

        {marker ? (
          <Box
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="12px"
            px="4"
            py="1"
          >
            {marker.fields.map((field, i) => (
              <Fragment key={field.label}>
                {i > 0 && <Divider borderColor="border.default" />}
                <Flex justify="space-between" gap="4" py="2.5">
                  <Text fontSize="sm" color="fg.muted">
                    {field.label}
                  </Text>
                  <Text fontSize="sm" fontWeight="500" textAlign="right">
                    {field.value}
                  </Text>
                </Flex>
              </Fragment>
            ))}
          </Box>
        ) : (
          isLoading && (
            <Box>
              <Skeleton h="44px" borderRadius="12px" />
              <Skeleton h="44px" borderRadius="12px" mt="2" />
            </Box>
          )
        )}

        {!marker && !isLoading && (
          <Text fontSize="sm" color="fg.muted">
            Ce lieu n'est plus disponible dans les données. Réactivez la couche
            « {layer.label} » ou fermez ce panneau.
          </Text>
        )}

        {/* Historique horaire, uniquement pour les éco-compteurs */}
        {marker && layer.id === "ecocounters" && (
          <ErrorBoundary>
            <EcoCounterSparkline counterId={marker.id} />
          </ErrorBoundary>
        )}

        {marker?.updatedAt && (
          <Text fontSize="xs" color="fg.muted" mt="3">
            Donnée mesurée {timeAgo(marker.updatedAt)}
          </Text>
        )}

        {marker && (
          <Flex gap="2" mt="4">
            <Button
              as={Link}
              href={googleMapsDirections(...marker.position)}
              isExternal
              flex="1"
              colorScheme="accent"
              leftIcon={<FaDiamondTurnRight />}
              borderRadius="12px"
              _hover={{ textDecoration: "none" }}
            >
              Itinéraire
            </Button>
            <Button
              as={Link}
              href={googleMapsSearch(...marker.position)}
              isExternal
              variant="outline"
              leftIcon={<FaArrowUpRightFromSquare />}
              borderRadius="12px"
              _hover={{ textDecoration: "none" }}
            >
              Google Maps
            </Button>
          </Flex>
        )}

        <Text fontSize="2xs" color="fg.muted" mt="4">
          Source : {layer.attribution}
        </Text>
      </Box>
    </Box>
  );
};

export default DetailPanel;
