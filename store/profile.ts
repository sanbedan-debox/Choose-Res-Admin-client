import { create } from "zustand";

type ProfileStates = {
    // STEP 1
    businessType: string;
    setbusinessType: (e: string) => void;
    businessName: string;
    setbusinessName: (e: string) => void;
    estimatedRevenue: string;
    setestimatedRevenue: (e: string) => void;
    employeeSize: string;
    setemployeeSize: (e: string) => void;
    establishedAt: Date | null;
    setestablishedAt: (e: Date | null) => void;
    dob: Date | null;
    setdob: (e: Date | null) => void;

    //STEP 2
    addressLine1: string;
    setAddressLine1: (address: string) => void;
    addressLine2: string;
    setAddressLine2: (address: string) => void;
    city: string;
    setCity: (city: string) => void;
    state: { id: string; value: string } | null;
    setState: (state: { id: string; value: string } | null) => void;
    zipcode: number;
    setZipcode: (zipcode: number) => void;
    place: { displayName: string; placeId: string };
    setPlace: (place: { displayName: string; placeId: string }) => void;
    cords: number[];
    setCords: (coords: number[]) => void;

    //STEP 3
    ein: string;
    setein: (location: string) => void;
};

const useProfileStore = create<ProfileStates>((set) => ({
    // STEP 1
    businessType: "",
    setbusinessType: (e: string) => set({ businessType: e }),
    businessName: "",
    setbusinessName: (e: string) => set({ businessName: e }),
    estimatedRevenue: "",
    setestimatedRevenue: (e: string) => set({ estimatedRevenue: e }),
    employeeSize: "",
    setemployeeSize: (e: string) => set({ employeeSize: e }),
    establishedAt: null,
    setestablishedAt: (e: Date | null) => set({ establishedAt: e }),
    dob: null,
    setdob: (e: Date | null) => set({ dob: e }),

    //STEP 2
    addressLine1: "",
    setAddressLine1: (address) => set({ addressLine1: address }),
    addressLine2: "",
    setAddressLine2: (address) => set({ addressLine2: address }),
    city: "",
    setCity: (city) => set({ city }),
    state: null,
    setState: (state) => set({ state }),
    zipcode: 0,
    setZipcode: (zipcode) => set({ zipcode }),
    place: { displayName: "", placeId: "" },
    setPlace: (place) => set({ place }),
    cords: [0, 0],
    setCords: (cords) => set({ cords }),

    //STEP 3
    ein: "",
    setein: (ein) => set({ ein }),
}));

export default useProfileStore;
