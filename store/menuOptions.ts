import { create } from "zustand";

type MenuOptionsState = {
  isAddModifierModalOpen: boolean;
  setisAddModifierModalOpen: (open: boolean) => void;
  isAddModifierGroupModalOpen: boolean;
  setisAddModifierGroupModalOpen: (open: boolean) => void;
  isAddItemModalOpen: boolean;
  setisAddItemModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setisAddCategoryModalOpen: (open: boolean) => void;
  isAddSubCategoryModalOpen: boolean;
  setisAddSubCategoryModalOpen: (open: boolean) => void;
  isAddMenuModalOpen: boolean;
  setisAddMenuModalOpen: (open: boolean) => void;
  fetchMenuDatas: boolean;
  setfetchMenuDatas: (open: boolean) => void;
};

const useMenuOptionsStore = create<MenuOptionsState>((set) => ({
  isAddModifierModalOpen: false,
  setisAddModifierModalOpen: (open: boolean) =>
    set({ isAddModifierModalOpen: open }),
  isAddModifierGroupModalOpen: false,
  setisAddModifierGroupModalOpen: (open: boolean) =>
    set({ isAddModifierGroupModalOpen: open }),
  isAddItemModalOpen: false,
  setisAddItemModalOpen: (open: boolean) => set({ isAddItemModalOpen: open }),
  isAddCategoryModalOpen: false,
  setisAddCategoryModalOpen: (open: boolean) =>
    set({ isAddCategoryModalOpen: open }),
  isAddSubCategoryModalOpen: false,
  setisAddSubCategoryModalOpen: (open: boolean) =>
    set({ isAddSubCategoryModalOpen: open }),
  isAddMenuModalOpen: false,
  setisAddMenuModalOpen: (open: boolean) => set({ isAddMenuModalOpen: open }),
  fetchMenuDatas: false,
  setfetchMenuDatas: (fetch: boolean) => set({ fetchMenuDatas: fetch }),
}));

export default useMenuOptionsStore;
