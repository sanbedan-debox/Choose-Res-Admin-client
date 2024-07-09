import { create } from "zustand";

type RestaurantStates = {
  restaurants: any[];
  setRestaurants: (res: any) => void;
  selectedRestaurant: string;
  setSelectedRestaurant: (location: string) => void;
  selectedRestaurantId: string;
  setSelectedRestaurantId: (location: string) => void;
};

const useRestaurantsStore = create<RestaurantStates>((set) => ({
  selectedRestaurant: "",
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  selectedRestaurantId: "",
  setSelectedRestaurantId: (selectedRestaurantId) =>
    set({ selectedRestaurantId }),
  restaurants: [],
  setRestaurants: (res) => set({ restaurants: res }),
}));

export default useRestaurantsStore;
