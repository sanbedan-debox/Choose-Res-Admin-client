import { create } from "zustand";

type MenuState = {
  isAddItemModalOpen: boolean;
  setisAddItemModalOpen: (open: boolean) => void;
};

const useMenuStore = create<MenuState>((set) => ({
  isAddItemModalOpen: true,
  setisAddItemModalOpen: (open: boolean) => set({ isAddItemModalOpen: open }),
}));

export default useMenuStore;
