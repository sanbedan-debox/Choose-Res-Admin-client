import { create } from "zustand";

type AuthStates = {
  userId: string;
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  phone: string;
  businessName: string;
  establishedAt: string;
  setUserId: (e: string) => void;
  setUser_Id: (e: string) => void;
  setFirstName: (e: string) => void;
  setLastName: (e: string) => void;
  setStatus: (e: string) => void;
  setEmail: (e: string) => void;
  setPhone: (e: string) => void;
  setBusinessName: (e: string) => void;
  setEstablishedAt: (e: string) => void;
};

const useAuthStore = create<AuthStates>((set) => ({
  userId: "",
  _id: "",
  firstName: "",
  lastName: "",
  status: "",
  email: "",
  phone: "",
  businessName: "",
  establishedAt: "",
  setUserId: (e: string) => set({ userId: e }),
  setUser_Id: (e: string) => set({ _id: e }),
  setFirstName: (e: string) => set({ firstName: e }),
  setLastName: (e: string) => set({ lastName: e }),
  setStatus: (e: string) => set({ status: e }),
  setEmail: (e: string) => set({ email: e }),
  setPhone: (e: string) => set({ phone: e }),
  setBusinessName: (e: string) => set({ businessName: e }),
  setEstablishedAt: (e: string) => set({ establishedAt: e }),
}));

export default useAuthStore;
