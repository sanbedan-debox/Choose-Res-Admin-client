import { create } from "zustand";

type MenuItemsState = {
  editItemId: string | null;
  setEditItemId: (open: string | null) => void;
  isEditItem: boolean;
  setisEditItem: (open: boolean) => void;
};

const useMenuItemsStore = create<MenuItemsState>((set) => ({
  editItemId: null,
  setEditItemId: (open: string | null) => set({ editItemId: open }),
  isEditItem: false,
  setisEditItem: (open: boolean) => set({ isEditItem: open }),
}));

export default useMenuItemsStore;
