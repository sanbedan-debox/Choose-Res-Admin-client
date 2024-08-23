import { create } from "zustand";

interface BasicProfileInformation {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    twoFactorAuth: boolean;
    setProfileData: (data: Partial<BasicProfileInformation>) => void;
}

export const useBasicProfileStore = create<BasicProfileInformation>((set) => ({
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    twoFactorAuth: false,
    setProfileData: (data) => set((state) => ({ ...state, ...data })),
}));
