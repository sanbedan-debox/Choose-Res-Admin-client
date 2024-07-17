import { create } from "zustand";

type MenuMenuState = {
  editMenuId: string | null;
  seteditMenuId: (open: string | null) => void;
  isEditMenu: boolean;
  setisEditMenu: (open: boolean) => void;
};

const useMenuMenuStore = create<MenuMenuState>((set) => ({
  editMenuId: null,
  seteditMenuId: (open: string | null) => set({ editMenuId: open }),
  isEditMenu: false,
  setisEditMenu: (open: boolean) => set({ isEditMenu: open }),
}));

export default useMenuMenuStore;
