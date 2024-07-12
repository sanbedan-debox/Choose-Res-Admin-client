import { create } from "zustand";

type MenuState = {
  isAddItemModalOpen: boolean;
  setisAddItemModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setisAddCategoryModalOpen: (open: boolean) => void;
  isAddMenuModalOpen: boolean;
  setisAddMenuModalOpen: (open: boolean) => void;
  fetchMenuDatas: boolean;
  setfetchMenuDatas: (open: boolean) => void;
};

const useMenuStore = create<MenuState>((set) => ({
  isAddItemModalOpen: false,
  setisAddItemModalOpen: (open: boolean) => set({ isAddItemModalOpen: open }),
  isAddCategoryModalOpen: false,
  setisAddCategoryModalOpen: (open: boolean) =>
    set({ isAddCategoryModalOpen: open }),
  isAddMenuModalOpen: false,
  setisAddMenuModalOpen: (open: boolean) => set({ isAddMenuModalOpen: open }),
  fetchMenuDatas: false,
  setfetchMenuDatas: (fetch: boolean) => set({ fetchMenuDatas: fetch }),
}));

export default useMenuStore;
