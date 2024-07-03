import { create } from "zustand";

type authStates = {
  userId: string;
  setUserId: (e: string) => void;
};

const useAuthStore = create<authStates>((set) => ({
  userId: "",
  setUserId: (e: string) => {
    set({ userId: e });
  },
}));

export default useAuthStore;
