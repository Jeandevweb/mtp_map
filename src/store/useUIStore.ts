import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LayerId } from "../layers/types";

export type Selection = { layerId: LayerId; markerId: string } | null;

type UIState = {
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  /** Marqueur dont le détail est ouvert dans le panneau latéral. */
  selection: Selection;
  setSelection: (selection: Selection) => void;

  /** Fond de carte choisi ; "auto" suit le thème clair/sombre. */
  basemapId: string;
  setBasemapId: (id: string) => void;

  /** Adresse trouvée via la recherche, épinglée sur la carte. */
  searchResult: { position: [number, number]; label: string } | null;
  setSearchResult: (
    result: { position: [number, number]; label: string } | null
  ) => void;

  /** Position géolocalisée de l'utilisateur ([lat, lng]), si accordée. */
  userPosition: [number, number] | null;
  setUserPosition: (position: [number, number] | null) => void;
};

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),

      selection: null,
      setSelection: (selection) => set({ selection }),

      basemapId: "auto",
      setBasemapId: (id) => set({ basemapId: id }),

      searchResult: null,
      setSearchResult: (result) => set({ searchResult: result }),

      userPosition: null,
      setUserPosition: (position) => set({ userPosition: position }),
    }),
    {
      name: "mtp-map-ui",
      partialize: (state) => ({ basemapId: state.basemapId }),
    }
  )
);

export default useUIStore;
