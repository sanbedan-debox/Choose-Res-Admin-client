import { create } from "zustand";

type ModifierGroupState = {
  editModGroupId: string | null;
  setEditModGroupId: (open: string | null) => void;
  isEditModGroup: boolean;
  setisEditModGroup: (open: boolean) => void;
  isDuplicateModifierGroup: boolean;
  setisDuplicateModifierGroup: (open: boolean) => void;
  modifiersLength: number
  setModifiersLength: (open: number) => void;
  minSelectionsCount: number
  setMinSelectionsCount: (open: number) => void;
  maxSelectionsCount: number
  setMaxSelectionsCount: (open: number) => void;
};

const useModGroupStore = create<ModifierGroupState>((set) => ({
  editModGroupId: null,
  setEditModGroupId: (open: string | null) => set({ editModGroupId: open }),
  isEditModGroup: false,
  setisEditModGroup: (open: boolean) => set({ isEditModGroup: open }),
  isDuplicateModifierGroup: false,
  setisDuplicateModifierGroup: (open: boolean) => set({ isDuplicateModifierGroup: open }),
  modifiersLength: 0,
  setModifiersLength: (open: number) => set({ modifiersLength: open }),
  minSelectionsCount: 0,
  setMinSelectionsCount: (open: number) => set({ minSelectionsCount: open }),
  maxSelectionsCount: 0,
  setMaxSelectionsCount: (open: number) => set({ maxSelectionsCount: open }),
}));

export default useModGroupStore;
