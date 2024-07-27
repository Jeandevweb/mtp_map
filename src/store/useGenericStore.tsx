import { create } from "zustand";

export type GenericState = {
  isOpenGeneric: boolean;
  setIsOpenGeneric: () => void;
  openInfo: boolean;
  setOpenInfo: (value: boolean) => void;

  id: string;
  setId: (value: string) => void;
};

const useGenericStore = create<GenericState>((set) => ({
  isOpenGeneric: false,
  setIsOpenGeneric: () =>
    set((state) => ({ isOpenGeneric: !state.isOpenGeneric })),

  id: "",
  setId: (value) => set(() => ({ id: value })),

  openInfo: false,
  setOpenInfo: (value) => set(() => ({ openInfo: value })),
}));

export default useGenericStore;
