import { create } from "zustand";

// Store for Categories
export const useCloverCategoryStore = create<{
    categories: Category[] | null;
    setCategories: (categories: Category[] | null) => void;
}>((set) => ({
    categories: null,
    setCategories: (categories) => set({ categories }),
}));

// Store for Items
export const useCloverItemStore = create<{
    items: Item[] | null;
    setItems: (items: Item[] | null) => void;
}>((set) => ({
    items: null,
    setItems: (items) => set({ items }),
}));

// Store for Modifier Groups
export const useCloverModifierGroupStore = create<{
    modifierGroups: ModifierGroup[] | null;
    setModifierGroups: (modifierGroups: ModifierGroup[] | null) => void;
}>((set) => ({
    modifierGroups: null,
    setModifierGroups: (modifierGroups) => set({ modifierGroups }),
}));

// Store for Modifiers
export const useCloverModifierStore = create<{
    modifiers: Modifier[] | null;
    setModifiers: (modifiers: Modifier[] | null) => void;
}>((set) => ({
    modifiers: null,
    setModifiers: (modifiers) => set({ modifiers }),
}));
