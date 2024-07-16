import { create } from "zustand";

type RestaurantStates = {
  restaurants: any[];
  setRestaurants: (res: any) => void;
  selectedRestaurant: string;
  setSelectedRestaurant: (location: string) => void;
  refreshRestaurantChange: boolean;
  setRefreshRestaurantChange: (res: boolean) => void;
  isRestaurantCompleted: boolean;
  setIsRestaurantCompleted: (res: boolean) => void;
};

const useRestaurantsStore = create<RestaurantStates>((set) => ({
  selectedRestaurant: "",
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  selectedRestaurantId: "",
  restaurants: [],
  setRestaurants: (res) => set({ restaurants: res }),
  refreshRestaurantChange: false,
  setRefreshRestaurantChange: (res) => set({ refreshRestaurantChange: res }),
  isRestaurantCompleted: false,
  setIsRestaurantCompleted: (res) => set({ isRestaurantCompleted: res }),
}));

export default useRestaurantsStore;
