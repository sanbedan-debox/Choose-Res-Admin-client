import { create } from "zustand";

type RestaurantStates = {
  restaurants: any[];
  setRestaurants: (res: any) => void;
  selectedRestaurant: string;
  setSelectedRestaurant: (location: string) => void;
  selectedRestaurantTaxRateId: string;
  setSelectedRestaurantTaxRateId: (tax: string) => void;
  refreshRestaurantChange: boolean;
  setRefreshRestaurantChange: (res: boolean) => void;

};

const useRestaurantsStore = create<RestaurantStates>((set) => ({
  selectedRestaurant: "",
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  selectedRestaurantTaxRateId: "",
  setSelectedRestaurantTaxRateId: (selectedRestaurantTaxRateId) => set({ selectedRestaurantTaxRateId }),
  selectedRestaurantId: "",
  restaurants: [],
  setRestaurants: (res) => set({ restaurants: res }),
  refreshRestaurantChange: false,
  setRefreshRestaurantChange: (res) => set({ refreshRestaurantChange: res }),

}));

export default useRestaurantsStore;
