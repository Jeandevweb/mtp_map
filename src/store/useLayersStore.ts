import { create } from "zustand";
import { persist } from "zustand/middleware";
import { layers } from "../layers/registry";
import type { LayerId } from "../layers/types";

type LayersState = {
  visibility: Record<LayerId, boolean>;
  toggle: (id: LayerId) => void;
  setVisible: (id: LayerId, visible: boolean) => void;
};

const defaultVisibility = Object.fromEntries(
  layers.map((l) => [l.id, l.defaultVisible])
) as Record<LayerId, boolean>;

/** Couches affichées sur la carte ; le choix de l'utilisateur est mémorisé. */
const useLayersStore = create<LayersState>()(
  persist(
    (set) => ({
      visibility: defaultVisibility,
      toggle: (id) =>
        set((state) => ({
          visibility: { ...state.visibility, [id]: !state.visibility[id] },
        })),
      setVisible: (id, visible) =>
        set((state) => ({
          visibility: { ...state.visibility, [id]: visible },
        })),
    }),
    {
      name: "mtp-map-layers",
      merge: (persisted, current) => ({
        ...current,
        visibility: {
          ...current.visibility,
          ...(persisted as Partial<LayersState> | undefined)?.visibility,
        },
      }),
    }
  )
);

export default useLayersStore;
