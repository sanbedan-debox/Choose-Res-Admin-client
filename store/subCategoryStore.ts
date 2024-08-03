import { create } from "zustand";

type menuSubCategoryStore = {
    editSubCategoryId: string | null;
    seteditSubCategoryId: (open: string | null) => void;
    isEditSubCategory: boolean;
    setisEditSubCategory: (open: boolean) => void;
    isDuplicateSubCategory: boolean;
    setisDuplicateSubCategory: (open: boolean) => void;
};

const useSubCategoryStore = create<menuSubCategoryStore>((set) => ({
    editSubCategoryId: null,
    seteditSubCategoryId: (open: string | null) => set({ editSubCategoryId: open }),
    isEditSubCategory: false,
    setisEditSubCategory: (open: boolean) => set({ isEditSubCategory: open }),
    isDuplicateSubCategory: false,
    setisDuplicateSubCategory: (open: boolean) => set({ isDuplicateSubCategory: open }),
}));

export default useSubCategoryStore;
