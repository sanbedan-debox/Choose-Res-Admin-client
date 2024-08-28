import { create } from "zustand";

type MenuCatsState = {
  editCatsId: string | null;
  setEditCatsId: (open: string | null) => void;
  isEditCats: boolean;
  setIsEditCats: (open: boolean) => void;
  isDuplicateCats: boolean;
  setIsDuplicateCats: (open: boolean) => void;
};

const useMenuCategoryStore = create<MenuCatsState>((set) => ({
  editCatsId: null,
  setEditCatsId: (open: string | null) => set({ editCatsId: open }),
  isEditCats: false,
  setIsEditCats: (open: boolean) => set({ isEditCats: open }),
  isDuplicateCats: false,
  setIsDuplicateCats: (open: boolean) => set({ isDuplicateCats: open }),
}));

export default useMenuCategoryStore;
