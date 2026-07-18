import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Map as LeafletMap } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaGear, FaLocationDot, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import useUIStore from "../store/useUIStore";

type SearchHit = { position: [number, number]; label: string };

type Props = {
  map: LeafletMap | null;
};

/**
 * Carte flottante en haut de l'écran : identité de l'app + recherche
 * d'adresse (Nominatim, limitée aux environs de Montpellier) + accès aux
 * réglages. C'est le seul point d'entrée "chrome" de l'interface.
 */
const SearchBar = ({ map }: Props) => {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const setSearchResult = useUIStore((s) => s.setSearchResult);
  const shadow = useColorModeValue("floating", "floatingDark");

  const provider = useMemo(
    () =>
      new OpenStreetMapProvider({
        params: {
          "accept-language": "fr",
          countrycodes: "fr",
          // Limite les résultats à la métropole de Montpellier.
          viewbox: "3.55,43.75,4.10,43.45",
          bounded: 1,
        },
      }),
    []
  );

  // Recherche avec un léger délai pour ne pas surcharger Nominatim.
  useEffect(() => {
    if (query.trim().length < 3) {
      setHits([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await provider.search({ query });
        setHits(
          results
            .slice(0, 5)
            .map((r) => ({ position: [r.y, r.x], label: r.label }))
        );
      } catch {
        setHits([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, provider]);

  const selectHit = (hit: SearchHit) => {
    setSearchResult(hit);
    setQuery(hit.label.split(",")[0]);
    setIsOpen(false);
    map?.flyTo(hit.position, 16, { duration: 0.8 });
  };

  const clear = () => {
    setQuery("");
    setHits([]);
    setSearchResult(null);
    inputRef.current?.focus();
  };

  const showResults = isOpen && query.trim().length >= 3;

  return (
    <Box
      position="absolute"
      top={{ base: 3, md: 4 }}
      left={{ base: 3, md: 4 }}
      right={{ base: 3, md: "auto" }}
      w={{ base: "auto", md: "420px" }}
      // Au-dessus des chips pour que la liste de résultats les recouvre.
      zIndex="panel"
    >
      <Box
        bg="bg.surface"
        borderRadius="panel"
        boxShadow={shadow}
        overflow="hidden"
      >
        <Flex align="center" h="52px" pl="4" pr="1.5" gap="3">
          {/* Identité de l'app */}
          <Flex align="center" gap="2" flexShrink={0} aria-hidden>
            <Icon as={FaLocationDot} color="accent.solid" boxSize="4.5" />
            <Text
              fontWeight="700"
              fontSize="md"
              letterSpacing="-0.01em"
              display={{ base: "none", sm: "block" }}
            >
              MTP Map
            </Text>
          </Flex>
          <Divider orientation="vertical" h="24px" borderColor="border.default" />
          <Flex align="center" flex="1" gap="2" minW={0}>
            <Icon as={FaMagnifyingGlass} color="fg.muted" boxSize="3.5" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && hits[0]) selectHit(hits[0]);
                if (e.key === "Escape") setIsOpen(false);
              }}
              placeholder="Rechercher une adresse…"
              variant="unstyled"
              fontSize="sm"
              aria-label="Rechercher une adresse à Montpellier"
            />
          </Flex>
          {isSearching && <Spinner size="xs" color="fg.muted" flexShrink={0} />}
          {query && !isSearching && (
            <IconButton
              aria-label="Effacer la recherche"
              icon={<FaXmark />}
              size="sm"
              variant="ghost"
              color="fg.muted"
              borderRadius="10px"
              onClick={clear}
              flexShrink={0}
            />
          )}
          <IconButton
            aria-label="Ouvrir les réglages"
            icon={<FaGear />}
            size="md"
            variant="ghost"
            color="fg.muted"
            borderRadius="12px"
            onClick={() => setSettingsOpen(true)}
            flexShrink={0}
          />
        </Flex>

        {/* Résultats de recherche */}
        {showResults && (hits.length > 0 || !isSearching) && (
          <>
            <Divider borderColor="border.default" />
            <List py="1.5" role="listbox" aria-label="Résultats de recherche">
              {hits.map((hit) => (
                <ListItem key={hit.label} role="option" aria-selected={false}>
                  <Flex
                    as="button"
                    onClick={() => selectHit(hit)}
                    align="center"
                    gap="3"
                    w="100%"
                    px="4"
                    py="2"
                    textAlign="left"
                    _hover={{ bg: "bg.hover" }}
                    _focusVisible={{ bg: "bg.hover", outline: "none" }}
                    transition="background-color 0.15s ease-out"
                  >
                    <Icon
                      as={FaLocationDot}
                      color="fg.muted"
                      boxSize="3.5"
                      flexShrink={0}
                    />
                    <Text fontSize="sm" noOfLines={1}>
                      {hit.label}
                    </Text>
                  </Flex>
                </ListItem>
              ))}
              {hits.length === 0 && !isSearching && (
                <Text px="4" py="2" fontSize="sm" color="fg.muted">
                  Aucune adresse trouvée dans la métropole.
                </Text>
              )}
            </List>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;
