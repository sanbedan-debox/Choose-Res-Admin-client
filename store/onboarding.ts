import { create } from "zustand";

type OnboardingStates = {
  // STEP 1
  businessType: string;
  setbusinessType: (e: string) => void;
  businessName: string;
  setbusinessName: (e: string) => void;
  dob: string;
  setdob: (e: string) => void;
  estimatedRevenue: string;
  setestimatedRevenue: (e: string) => void;
  employeeSize: string;
  setemployeeSize: (e: string) => void;
  establishedAt: string;
  setestablishedAt: (e: string) => void;

  //STEP 2
  addressLine1: string;
  setAddressLine1: (address: string) => void;
  addressLine2: string;
  setAddressLine2: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  postcode: string;
  setPostcode: (postcode: string) => void;
  location: string;
  setLocation: (location: string) => void;

  //STEP 3
  ein: string;
  setein: (location: string) => void;
  ssn: string;
  setssn: (location: string) => void;
};

const useOnboardingStore = create<OnboardingStates>((set) => ({
  // STEP 1
  businessType: "",
  setbusinessType: (e: string) => set({ businessType: e }),
  businessName: "",
  setbusinessName: (e: string) => set({ businessName: e }),
  dob: "",
  setdob: (e: string) => set({ dob: e }),
  estimatedRevenue: "",
  setestimatedRevenue: (e: string) => set({ estimatedRevenue: e }),
  employeeSize: "",
  setemployeeSize: (e: string) => set({ employeeSize: e }),
  establishedAt: "",
  setestablishedAt: (e: string) => set({ establishedAt: e }),

  //STEP 2
  addressLine1: "",
  setAddressLine1: (address) => set({ addressLine1: address }),
  addressLine2: "",
  setAddressLine2: (address) => set({ addressLine2: address }),
  city: "",
  setCity: (city) => set({ city }),
  state: "",
  setState: (state) => set({ state }),
  postcode: "",
  setPostcode: (postcode) => set({ postcode }),
  location: "",
  setLocation: (location) => set({ location }),

  ein: "",
  setein: (ein) => set({ ein }),
  ssn: "",
  setssn: (ein) => set({ ein }),
}));

export default useOnboardingStore;
