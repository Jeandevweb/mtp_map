import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Progress,
  Text,
} from "@chakra-ui/react";
import {
  FaDiamondTurnRight,
  FaCircleInfo,
  FaHeart,
  FaPersonWalking,
  FaRegHeart,
} from "react-icons/fa6";
import useFavoritesStore from "../../store/useFavoritesStore";
import type { LayerDef, MarkerData } from "../../layers/types";
import { googleMapsDirections } from "../../utils/externalLink";
import {
  distanceMeters,
  formatDistanceWalk,
  statusColorScheme,
  timeAgo,
} from "../../utils/format";
import useUIStore from "../../store/useUIStore";

type Props = {
  layer: LayerDef;
  marker: MarkerData;
};

/** Contenu de la bulle affichée au clic sur un marqueur. */
const MarkerPopup = ({ layer, marker }: Props) => {
  const setSelection = useUIStore((s) => s.setSelection);
  const userPosition = useUIStore((s) => s.userPosition);
  const isFavorite = useFavoritesStore((s) =>
    s.favorites.some((f) => f.markerId === marker.id)
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [lat, lng] = marker.position;
  const status = marker.status;
  const colorScheme = status ? statusColorScheme(status.ratio) : null;
  const distance = userPosition
    ? distanceMeters(userPosition, marker.position)
    : null;

  return (
    <Box p="4" pt="3.5">
      {/* En-tête : pictogramme de la catégorie + nom du lieu */}
      <Flex align="flex-start" gap="2.5" pr="7">
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
        <Box minW={0}>
          <Text fontWeight="600" fontSize="sm" lineHeight="short" noOfLines={2}>
            {marker.title}
          </Text>
          {marker.subtitle && (
            <Text fontSize="xs" color="fg.muted" mt="0.5" noOfLines={1}>
              {marker.subtitle}
            </Text>
          )}
          {distance !== null && (
            <Flex align="center" gap="1.5" mt="1" color="fg.muted">
              <Icon as={FaPersonWalking} boxSize="3" aria-hidden />
              <Text fontSize="xs">{formatDistanceWalk(distance)}</Text>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Disponibilité en un coup d'œil */}
      {status && colorScheme && (
        <Flex align="center" gap="2.5" mt="3">
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
            px="2"
            textTransform="none"
            fontSize="xs"
          >
            {status.label}
          </Badge>
        </Flex>
      )}

      {/* 2-3 informations clés */}
      <Box mt="3">
        {marker.fields.slice(0, 3).map((field) => (
          <Flex key={field.label} justify="space-between" gap="3" py="0.5">
            <Text fontSize="xs" color="fg.muted">
              {field.label}
            </Text>
            <Text fontSize="xs" fontWeight="500" textAlign="right">
              {field.value}
            </Text>
          </Flex>
        ))}
      </Box>

      {marker.updatedAt && (
        <Text fontSize="2xs" color="fg.muted" mt="1.5">
          Donnée mesurée {timeAgo(marker.updatedAt)}
        </Text>
      )}

      {/* Actions */}
      <Flex gap="2" mt="3">
        <Button
          as={Link}
          href={googleMapsDirections(lat, lng)}
          isExternal
          size="sm"
          flex="1"
          colorScheme="accent"
          leftIcon={<FaDiamondTurnRight />}
          borderRadius="10px"
          _hover={{ textDecoration: "none" }}
        >
          Itinéraire
        </Button>
        <Button
          size="sm"
          variant="outline"
          borderRadius="10px"
          leftIcon={<FaCircleInfo />}
          onClick={() =>
            setSelection({ layerId: layer.id, markerId: marker.id })
          }
        >
          Détails
        </Button>
        {/* Loin du bouton × de fermeture pour éviter les clics ratés */}
        <IconButton
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
          aria-pressed={isFavorite}
          icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
          size="sm"
          variant="outline"
          color={isFavorite ? "red.400" : "fg.muted"}
          borderRadius="10px"
          flexShrink={0}
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
      </Flex>
    </Box>
  );
};

export default MarkerPopup;
