import { create } from "zustand";

type MenuOptionsState = {
  isAddModifierModalOpen: boolean;
  setIsAddModifierModalOpen: (open: boolean) => void;
  isAddModifierGroupModalOpen: boolean;
  setIsAddModifierGroupModalOpen: (open: boolean) => void;
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setIsAddCategoryModalOpen: (open: boolean) => void;
  isAddSubCategoryModalOpen: boolean;
  setisAddSubCategoryModalOpen: (open: boolean) => void;
  isAddMenuModalOpen: boolean;
  setIsAddMenuModalOpen: (open: boolean) => void;
  refreshMenuBuilderData: boolean;
  setRefreshMenuBuilderData: (open: boolean) => void;
  isFromUploadCSV: boolean;
  setIsFromUploadCSV: (open: boolean) => void;
};

const useMenuOptionsStore = create<MenuOptionsState>((set) => ({
  isAddModifierModalOpen: false,
  setIsAddModifierModalOpen: (open: boolean) =>
    set({ isAddModifierModalOpen: open }),
  isAddModifierGroupModalOpen: false,
  setIsAddModifierGroupModalOpen: (open: boolean) =>
    set({ isAddModifierGroupModalOpen: open }),
  isAddItemModalOpen: false,
  setIsAddItemModalOpen: (open: boolean) => set({ isAddItemModalOpen: open }),
  isAddCategoryModalOpen: false,
  setIsAddCategoryModalOpen: (open: boolean) =>
    set({ isAddCategoryModalOpen: open }),
  isAddSubCategoryModalOpen: false,
  setisAddSubCategoryModalOpen: (open: boolean) =>
    set({ isAddSubCategoryModalOpen: open }),
  isAddMenuModalOpen: false,
  setIsAddMenuModalOpen: (open: boolean) => set({ isAddMenuModalOpen: open }),
  refreshMenuBuilderData: false,
  setRefreshMenuBuilderData: (fetch: boolean) => set({ refreshMenuBuilderData: fetch }),
  isFromUploadCSV: false,
  setIsFromUploadCSV: (fetch: boolean) => set({ isFromUploadCSV: fetch }),
}));

export default useMenuOptionsStore;
