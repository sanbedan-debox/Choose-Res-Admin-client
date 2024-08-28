import { create } from "zustand";

type MenuItemsState = {
  editMenuId: string | null;
  setEditMenuId: (open: string | null) => void;
  isEditMenu: boolean;
  setisEditMenu: (open: boolean) => void;
  isDuplicateMenu: boolean;
  setIsDuplicateMenu: (open: boolean) => void;
};

const useMenuMenuStore = create<MenuItemsState>((set) => ({
  editMenuId: null,
  setEditMenuId: (open: string | null) => set({ editMenuId: open }),
  isEditMenu: false,
  setisEditMenu: (open: boolean) => set({ isEditMenu: open }),
  isDuplicateMenu: false,
  setIsDuplicateMenu: (open: boolean) => set({ isDuplicateMenu: open }),
}));

export default useMenuMenuStore;
