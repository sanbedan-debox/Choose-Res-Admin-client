import { create } from "zustand";

type MenuCatsState = {
  editCatsId: string | null;
  seteditCatsId: (open: string | null) => void;
  isEditCats: boolean;
  setisEditCats: (open: boolean) => void;
};

const useMenuCategoryStore = create<MenuCatsState>((set) => ({
  editCatsId: null,
  seteditCatsId: (open: string | null) => set({ editCatsId: open }),
  isEditCats: false,
  setisEditCats: (open: boolean) => set({ isEditCats: open }),
}));

export default useMenuCategoryStore;
