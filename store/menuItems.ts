import { create } from "zustand";

type MenuItemsState = {
  editItemId: string | null;
  setEditItemId: (open: string | null) => void;
  isEditItem: boolean;
  setIsEditItem: (open: boolean) => void;
  isDuplicateItem: boolean;
  setIsDuplicateItem: (open: boolean) => void;
};

const useMenuItemsStore = create<MenuItemsState>((set) => ({
  editItemId: null,
  setEditItemId: (open: string | null) => set({ editItemId: open }),
  isEditItem: false,
  setIsEditItem: (open: boolean) => set({ isEditItem: open }),
  isDuplicateItem: false,
  setIsDuplicateItem: (open: boolean) => set({ isDuplicateItem: open }),
}));

export default useMenuItemsStore;
