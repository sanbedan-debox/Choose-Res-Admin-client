import { create } from "zustand";

type MenuItemsState = {
    editModId: string | null;
    setEditModId: (open: string | null) => void;
    isEditMod: boolean;
    setIsEditMod: (open: boolean) => void;
    isDuplicateMods: boolean;
    setisDuplicateMods: (open: boolean) => void;
};

const useModStore = create<MenuItemsState>((set) => ({
    editModId: null,
    setEditModId: (open: string | null) => set({ editModId: open }),
    isEditMod: false,
    setIsEditMod: (open: boolean) => set({ isEditMod: open }),
    isDuplicateMods: false,
    setisDuplicateMods: (open: boolean) => set({ isDuplicateMods: open }),
}));

export default useModStore;
