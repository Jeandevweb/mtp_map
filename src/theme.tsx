import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/**
 * Design system de MTP Map — registre « produit » :
 * - une seule famille de police (Inter), échelle resserrée ;
 * - neutres froids (slate) + un seul accent bleu pour les actions/sélections ;
 * - les couleurs vert/orange/rouge sont réservées aux états de disponibilité ;
 * - tokens sémantiques pour que chaque surface suive le mode clair/sombre.
 */

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: "'Inter Variable', system-ui, -apple-system, sans-serif",
    body: "'Inter Variable', system-ui, -apple-system, sans-serif",
  },
  colors: {
    gray: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    accent: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },
  },
  semanticTokens: {
    colors: {
      "bg.surface": { default: "white", _dark: "gray.800" },
      "bg.subtle": { default: "gray.50", _dark: "gray.900" },
      "bg.hover": { default: "gray.100", _dark: "gray.700" },
      "fg.default": { default: "gray.800", _dark: "gray.100" },
      "fg.muted": { default: "gray.600", _dark: "gray.400" },
      "border.default": { default: "gray.200", _dark: "gray.700" },
      "accent.solid": { default: "accent.600", _dark: "accent.400" },
      "accent.subtle": { default: "accent.50", _dark: "accent.900" },
    },
  },
  shadows: {
    // Ombre douce des panneaux flottants au-dessus de la carte.
    floating: "0 2px 8px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(15, 23, 42, 0.12)",
    floatingDark: "0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)",
  },
  radii: {
    panel: "16px",
  },
  zIndices: {
    // Échelle propre à l'app : la carte Leaflet est confinée sous z=0,
    // l'UI flotte au-dessus, les Drawer/Modal/Toast Chakra (1400+) dominent.
    mapOverlay: 10,
    panel: 20,
  },
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
      },
      body: {
        bg: "bg.subtle",
        color: "fg.default",
        overscrollBehavior: "none",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focusVisible: {
          boxShadow: "0 0 0 3px var(--chakra-colors-accent-300)",
        },
      },
    },
    Switch: {
      defaultProps: { colorScheme: "accent" },
    },
  },
});
