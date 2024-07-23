import { create } from "zustand";

type MenuItemsState = {
  editModGroupId: string | null;
  setEditModGroupId: (open: string | null) => void;
  isEditModGroup: boolean;
  setisEditModGroup: (open: boolean) => void;
  isDuplicateModifierGroup: boolean;
  setisDuplicateModifierGroup: (open: boolean) => void;
};

const useModGroupStore = create<MenuItemsState>((set) => ({
  editModGroupId: null,
  setEditModGroupId: (open: string | null) => set({ editModGroupId: open }),
  isEditModGroup: false,
  setisEditModGroup: (open: boolean) => set({ isEditModGroup: open }),
  isDuplicateModifierGroup: false,
  setisDuplicateModifierGroup: (open: boolean) => set({ isDuplicateModifierGroup: open }),
}));

export default useModGroupStore;
