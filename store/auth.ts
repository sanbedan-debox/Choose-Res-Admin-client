import { create } from "zustand";

type authStates = {
  userId: string;
  setUserId: (e: string) => void;
};

const useAuthStore = create<authStates>((set) => ({
  userId: "",
  setUserId: (e: string) => {
    console.log("USerId Saved", e);
    set({ userId: e });
  },
}));

export default useAuthStore;
