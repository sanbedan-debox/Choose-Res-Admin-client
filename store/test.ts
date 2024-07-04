import { create } from "zustand";

type OneStates = {
  userId: string;

  setUserId: (e: string) => void;
};

const oneStore = create<OneStates>((set) => ({
  userId: "",

  setUserId: (e: string) => set({ userId: e }),
}));

export default oneStore;
