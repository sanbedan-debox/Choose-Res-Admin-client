import { create } from "zustand";

type menuSubCategoryStore = {
    editSubCategoryId: string | null;
    setEditSubCategoryId: (open: string | null) => void;
    isEditSubCategory: boolean;
    setIsEditSubCategory: (open: boolean) => void;
    isDuplicateSubCategory: boolean;
    setIsDuplicateSubCategory: (open: boolean) => void;
};

const useSubCategoryStore = create<menuSubCategoryStore>((set) => ({
    editSubCategoryId: null,
    setEditSubCategoryId: (open: string | null) => set({ editSubCategoryId: open }),
    isEditSubCategory: false,
    setIsEditSubCategory: (open: boolean) => set({ isEditSubCategory: open }),
    isDuplicateSubCategory: false,
    setIsDuplicateSubCategory: (open: boolean) => set({ isDuplicateSubCategory: open }),
}));

export default useSubCategoryStore;
