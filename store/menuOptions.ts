import { create } from "zustand";

type MenuOptionsState = {
  isAddItemModalOpen: boolean;
  setisAddItemModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setisAddCategoryModalOpen: (open: boolean) => void;
  isAddMenuModalOpen: boolean;
  setisAddMenuModalOpen: (open: boolean) => void;
  fetchMenuDatas: boolean;
  setfetchMenuDatas: (open: boolean) => void;
};

const useMenuOptionsStore = create<MenuOptionsState>((set) => ({
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

export default useMenuOptionsStore;
