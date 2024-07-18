import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";
import { RestaurantStatus, StatusEnum } from "@/generated/graphql";
import { parseCookies } from "nookies";
import ReusableModal from "../common/modal/modal";
import useGlobalStore from "@/store/global";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setRestaurants,
    setSelectedRestaurant,
    selectedRestaurant,
    refreshRestaurantChange,
  } = useRestaurantsStore();
  const cookies = parseCookies();
  const selectedRestaurantId = cookies.restaurantId;
  const { isRestaurantCompleted } = useRestaurantsStore();
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

          const res = await sdk.getRestaurantDetails();
          console.log("TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
          console.log(res);
          if (!res) {
            try {
              const res = await sdk.setRestaurantIdAsCookie({
                id: formattedRestaurant[0]?._id,
              });
              if (res) {
                setSelectedRestaurant(formattedRestaurant[0]?.name?.value);
              }
            } catch (error) {
              console.error("Failed to fetch restaurant users:", error);
            }
          } else {
            setSelectedRestaurant(res?.getRestaurantDetails?.name?.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch restaurant users:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchRestaurantUsers();
  }, []);
  const { isShowTaxSettings, setisShowTaxSettings } = useGlobalStore();
  const handleCloseTaxSettings = () => {
    setisShowTaxSettings(false);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 h-auto overflow-y-auto p-6 mt-16 children scrollbar-hide ">
          {children}
          <ReusableModal
            title="Tax Rate"
            isOpen={isShowTaxSettings}
            onClose={handleCloseTaxSettings}
          >
            TaxSettings
          </ReusableModal>
          <div />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
