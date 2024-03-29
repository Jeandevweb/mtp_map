import { create } from "zustand";

type GenericState = {
  isOpenGeneric: boolean;
  setIsOpenGeneric: () => void;
};

const useGenericStore = create<GenericState>((set) => ({
  isOpenGeneric: true,
  setIsOpenGeneric: () =>
    set((state) => ({ isOpenGeneric: !state.isOpenGeneric })),
}));

export default useGenericStore;
