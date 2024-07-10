import { BeverageCategory, FoodType, MeatType } from "@/generated/graphql";
import { create } from "zustand";

type RestaurantOnboardingStates = {
  id: string;
  setId: (name: string) => void;
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  restaurantWebsite: string;
  setRestaurantWebsite: (website: string) => void;
  restaurantType: string;
  setRestaurantType: (type: string) => void;
  restaurantCategory: string;
  setRestaurantCategory: (category: string) => void;
  dineInCapacity: string;
  setDineInCapacity: (capacity: string) => void;
  instagramLink: string;
  setInstagramLink: (link: string) => void;
  facebookLink: string;
  setFacebookLink: (link: string) => void;
  twitterLink: string;
  setTwitterLink: (link: string) => void;
  beverageCategory: BeverageCategory | null;
  setBeverageCategory: (category: BeverageCategory | null) => void;
  foodType: FoodType | null;
  setFoodType: (type: FoodType | null) => void;
  meatType: MeatType | null;
  setMeatType: (type: MeatType | null) => void;
};

const RestaurantOnboardingStore = create<RestaurantOnboardingStates>((set) => ({
  restaurantName: "",
  setRestaurantName: (name) => set({ restaurantName: name }),
  id: "",
  setId: (_id) => set({ id: _id }),
  restaurantWebsite: "",
  setRestaurantWebsite: (website) => set({ restaurantWebsite: website }),
  restaurantType: "",
  setRestaurantType: (type) => set({ restaurantType: type }),
  restaurantCategory: "",
  setRestaurantCategory: (category) => set({ restaurantCategory: category }),
  dineInCapacity: "",
  setDineInCapacity: (capacity) => set({ dineInCapacity: capacity }),
  instagramLink: "",
  setInstagramLink: (link) => set({ instagramLink: link }),
  facebookLink: "",
  setFacebookLink: (link) => set({ facebookLink: link }),
  twitterLink: "",
  setTwitterLink: (link) => set({ twitterLink: link }),
  beverageCategory: null,
  setBeverageCategory: (category) => set({ beverageCategory: category }),
  foodType: null,
  setFoodType: (type) => set({ foodType: type }),
  meatType: null,
  setMeatType: (type) => set({ meatType: type }),
}));

export default RestaurantOnboardingStore;
