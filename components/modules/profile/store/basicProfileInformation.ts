import { create } from "zustand";

interface BasicProfileInformation {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    setProfileData: (data: Partial<BasicProfileInformation>) => void;
}

export const useBasicProfileStore = create<BasicProfileInformation>((set) => ({
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    setProfileData: (data) => set((state) => ({ ...state, ...data })),
}));
