import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setRestaurants,
    setSelectedRestaurant,
    selectedRestaurant,
    refreshRestaurantChange,
  } = useRestaurantsStore();
  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      try {
        const response = await sdk.getUserRestaurants();
        if (response && response.getUserRestaurants) {
          const formattedRestaurant = response.getUserRestaurants.map(
            (res) => ({
              ...res,
            })
          );
          setRestaurants(formattedRestaurant);
          if (!selectedRestaurant) {
            setSelectedRestaurant(formattedRestaurant[0]?.name?.value);
            try {
              const res = await sdk.setRestaurantIdAsCookie({
                id: formattedRestaurant[0]?._id,
              });
            } catch (error) {
              console.error("Failed to fetch restaurant users:", error);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch restaurant users:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchRestaurantUsers();
  }, [refreshRestaurantChange]);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 h-auto overflow-y-auto p-6 mt-16 children scrollbar-hide ">
          {children}
          <div />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
