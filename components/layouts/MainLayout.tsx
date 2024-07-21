import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";
import { useForm, Controller } from "react-hook-form";
import { parseCookies } from "nookies";
import ReusableModal from "../common/modal/modal";
import useGlobalStore from "@/store/global";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      salesTax: "",
      default: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

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
        if (response?.getUserRestaurants) {
          const formattedRestaurant = response.getUserRestaurants.map(
            (res) => ({
              ...res,
            })
          );
          setRestaurants(formattedRestaurant);

          try {
            const res = await sdk.getRestaurantDetails();
            setSelectedRestaurant(res?.getRestaurantDetails?.name?.value);
          } catch (error) {
            await sdk.setRestaurantIdAsCookie({
              id: formattedRestaurant[0]?._id,
            });
          }

          // if (!res) {
          //   try {
          //     const res = await sdk.setRestaurantIdAsCookie({
          //       id: formattedRestaurant[0]?._id,
          //     });
          //     if (res) {
          //       setSelectedRestaurant(formattedRestaurant[0]?.name?.value);
          //     }
          //   } catch (error) {
          //     console.error("Failed to fetch restaurant users:", error);
          //   }
          // } else {
          //   setSelectedRestaurant(res?.getRestaurantDetails?.name?.value);
          // }
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="salesTax"
                >
                  Sales Tax
                </label>
                <Controller
                  name="salesTax"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="salesTax"
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="default"
                >
                  Default
                </label>
                <Controller
                  name="default"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="default"
                      type="checkbox"
                      value={field.name}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      // checked={field.value}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </form>
          </ReusableModal>

          <div />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
