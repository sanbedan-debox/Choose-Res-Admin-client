import { create } from "zustand";

type MenuItemsState = {
    editModId: string | null;
    setEditModId: (open: string | null) => void;
    isEditMod: boolean;
    setisEditMod: (open: boolean) => void;
};

const useModStore = create<MenuItemsState>((set) => ({
    editModId: null,
    setEditModId: (open: string | null) => set({ editModId: open }),
    isEditMod: false,
    setisEditMod: (open: boolean) => set({ isEditMod: open }),
}));

export default useModStore;
