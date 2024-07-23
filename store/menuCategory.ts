import { create } from "zustand";

type MenuCatsState = {
  editCatsId: string | null;
  seteditCatsId: (open: string | null) => void;
  isEditCats: boolean;
  setisEditCats: (open: boolean) => void;
  isDuplicateCats: boolean;
  setisDuplicateCats: (open: boolean) => void;
};

const useMenuCategoryStore = create<MenuCatsState>((set) => ({
  editCatsId: null,
  seteditCatsId: (open: string | null) => set({ editCatsId: open }),
  isEditCats: false,
  setisEditCats: (open: boolean) => set({ isEditCats: open }),
  isDuplicateCats: false,
  setisDuplicateCats: (open: boolean) => set({ isDuplicateCats: open }),
}));

export default useMenuCategoryStore;
