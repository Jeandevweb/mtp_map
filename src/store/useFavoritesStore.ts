import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LayerId } from "../layers/types";

/**
 * Lieu épinglé par l'utilisateur. Dénormalisé (titre + position copiés)
 * pour pouvoir lister les favoris même quand la couche n'est pas chargée.
 */
export type Favorite = {
  layerId: LayerId;
  markerId: string;
  title: string;
  subtitle?: string;
  position: [number, number];
};

type FavoritesState = {
  favorites: Favorite[];
  isFavorite: (markerId: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
};

/** Favoris de l'utilisateur, mémorisés en localStorage. */
const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (markerId) =>
        get().favorites.some((f) => f.markerId === markerId),
      toggleFavorite: (favorite) =>
        set((state) => ({
          favorites: state.favorites.some(
            (f) => f.markerId === favorite.markerId
          )
            ? state.favorites.filter((f) => f.markerId !== favorite.markerId)
            : [...state.favorites, favorite],
        })),
    }),
    { name: "mtp-map-favorites" }
  )
);

export default useFavoritesStore;
