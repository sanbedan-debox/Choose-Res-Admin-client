import { create } from "zustand";

type RestaurantStates = {
  restaurants: any[];
  setRestaurants: (res: any) => void;
  selectedRestaurant: string;
  setSelectedRestaurant: (location: string) => void;
  selectedRestaurantTaxRate: string;
  setSelectedRestaurantTaxRate: (location: string) => void;
  refreshRestaurantChange: boolean;
  setRefreshRestaurantChange: (res: boolean) => void;

};

const useRestaurantsStore = create<RestaurantStates>((set) => ({
  selectedRestaurant: "",
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  selectedRestaurantTaxRate: "",
  setSelectedRestaurantTaxRate: (selectedRestaurantTaxRate) => set({ selectedRestaurantTaxRate }),
  selectedRestaurantId: "",
  restaurants: [],
  setRestaurants: (res) => set({ restaurants: res }),
  refreshRestaurantChange: false,
  setRefreshRestaurantChange: (res) => set({ refreshRestaurantChange: res }),

}));

export default useRestaurantsStore;
