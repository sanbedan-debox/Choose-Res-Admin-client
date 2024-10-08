import {
  BeverageCategory,
  FoodType,
  RestaurantCategory,
} from "@/generated/graphql";
import { create } from "zustand";

type AvailabilityHour = {
  day: string;
  hours: { start: string; end: string }[];
  active: boolean;
};

type RestaurantOnboardingStates = {
  id: string;
  setId: (name: string) => void;

  //STEP 1
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  brandingLogo: string;
  setBrandingLogo: (name: string) => void;
  restaurantWebsite: string;
  setRestaurantWebsite: (website: string) => void;
  restaurantType: string;
  setRestaurantType: (type: string) => void;
  restaurantCategory: RestaurantCategory[];
  setRestaurantCategory: (category: RestaurantCategory[]) => void;
  dineInCapacity: string;
  setDineInCapacity: (capacity: string) => void;

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
  cords: [number, number];
  setCords: (coords: [number, number]) => void;
  timeZone: { id: string; value: string } | null;
  setTimeZone: (timezone: { id: string; value: string } | null) => void;
  availabilityHours: AvailabilityHour[];
  setAvailabilityHours: (hours: AvailabilityHour[]) => void;

  //STEP 3
  instagramLink: string;
  setInstagramLink: (link: string) => void;
  facebookLink: string;
  setFacebookLink: (link: string) => void;
  twitterLink: string;
  setTwitterLink: (link: string) => void;
  beverageCategory: BeverageCategory[];
  setBeverageCategory: (category: BeverageCategory[]) => void;
  foodType: FoodType[];
  setFoodType: (type: FoodType[]) => void;
  meatType: string;
  setMeatType: (type: string) => void;
  reset: () => void;
};

const RestaurantOnboardingStore = create<RestaurantOnboardingStates>((set) => ({
  id: "",
  setId: (_id) => set({ id: _id }),

  //STEP 1
  restaurantName: "",
  setRestaurantName: (name) => set({ restaurantName: name }),
  brandingLogo: "",
  setBrandingLogo: (name) => set({ brandingLogo: name }),
  restaurantWebsite: "",
  setRestaurantWebsite: (website) => set({ restaurantWebsite: website }),
  restaurantType: "",
  setRestaurantType: (type) => set({ restaurantType: type }),
  restaurantCategory: [],
  setRestaurantCategory: (category) => set({ restaurantCategory: category }),
  dineInCapacity: "",
  setDineInCapacity: (capacity) => set({ dineInCapacity: capacity }),

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
  timeZone: null,
  setTimeZone: (timeZone) => set({ timeZone }),
  availabilityHours: [],
  setAvailabilityHours: (hours) => set({ availabilityHours: hours }),

  //STEP 3
  instagramLink: "",
  setInstagramLink: (link) => set({ instagramLink: link }),
  facebookLink: "",
  setFacebookLink: (link) => set({ facebookLink: link }),
  twitterLink: "",
  setTwitterLink: (link) => set({ twitterLink: link }),
  beverageCategory: [],
  setBeverageCategory: (category) => set({ beverageCategory: category }),
  foodType: [],
  setFoodType: (type) => set({ foodType: type }),
  meatType: "",
  setMeatType: (type) => set({ meatType: type }),
  reset: () => set(initialState),
}));

//INITIAL RESET VALUES
const initialState: RestaurantOnboardingStates = {
  id: "",
  setId: (_id) => { },

  //STEP 1
  restaurantName: "",
  setRestaurantName: (name) => { },
  brandingLogo: "",
  setBrandingLogo: (logo) => { },
  restaurantWebsite: "",
  setRestaurantWebsite: (website) => { },
  restaurantType: "",
  setRestaurantType: (type) => { },
  restaurantCategory: [],
  setRestaurantCategory: (category) => { },
  dineInCapacity: "",
  setDineInCapacity: (capacity) => { },

  //STEP 2
  addressLine1: "",
  setAddressLine1: (address) => { },
  addressLine2: "",
  setAddressLine2: (address) => { },
  city: "",
  setCity: (city) => { },
  state: null,
  setState: (state) => { },
  zipcode: 0,
  setZipcode: (zipcode) => { },
  place: { displayName: "", placeId: "" },
  setPlace: (place) => { },
  cords: [0, 0],
  setCords: (cords) => { },
  timeZone: null,
  setTimeZone: (timeZone) => { },
  availabilityHours: [],
  setAvailabilityHours: (hours) => { },

  //STEP 3
  instagramLink: "",
  setInstagramLink: (link) => { },
  facebookLink: "",
  setFacebookLink: (link) => { },
  twitterLink: "",
  setTwitterLink: (link) => { },
  beverageCategory: [],
  setBeverageCategory: (category) => { },
  foodType: [],
  setFoodType: (type) => { },
  meatType: "",
  setMeatType: (type) => { },

  reset: () => { },
};

export default RestaurantOnboardingStore;
