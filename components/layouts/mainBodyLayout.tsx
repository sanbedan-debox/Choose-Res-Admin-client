import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";
import { useForm, Controller } from "react-hook-form";
import { parseCookies } from "nookies";
import ReusableModal from "../common/modal/modal";
import useGlobalStore from "@/store/global";
import CustomSwitch from "../common/customSwitch/customSwitch";
import CButton from "../common/button/button";
import { ButtonType } from "../common/button/interface";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      salesTax: "",
      default: false,
    },
  });

  const [isSwitchChecked, setIsSwitchChecked] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const taxRateInput = {
        name: { value: data.name },
        salesTax: { value: parseFloat(data.salesTax) },
        default: isSwitchChecked,
      };

      const taxRateResponse = await sdk.addTaxRate({
        input: taxRateInput,
      });

      if (taxRateResponse?.addTaxRate) {
        await sdk.addTaxRateInRestaurant({
          taxRateId: taxRateResponse.addTaxRate,
        });
        setSelectedRestaurantTaxRate(taxRateResponse?.addTaxRate);
      }

      fetchRestaurantUsers();
      setisShowTaxSettings(false);
    } catch (error) {
      console.error("Error submitting tax rate:", error);
    }
  };

  const {
    setRestaurants,
    setSelectedRestaurant,
    selectedRestaurant,
    refreshRestaurantChange,
  } = useRestaurantsStore();
  const cookies = parseCookies();
  const selectedRestaurantId = cookies.restaurantId;
  const { isRestaurantCompleted, setSelectedRestaurantTaxRate } =
    useRestaurantsStore();

  const fetchRestaurantUsers = async () => {
    try {
      const response = await sdk.getUserRestaurants();
      if (response?.getUserRestaurants) {
        const formattedRestaurant = response.getUserRestaurants.map((res) => ({
          ...res,
        }));
        setRestaurants(formattedRestaurant);

        try {
          const res = await sdk.getRestaurantDetails();
          setSelectedRestaurant(res?.getRestaurantDetails?.name?.value);

          if (res?.getRestaurantDetails?.taxRates?.length === 0) {
            setisShowTaxSettings(true);
          }
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
        } catch (error) {
          await sdk.setRestaurantIdAsCookie({
            id: formattedRestaurant[0]?._id,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch restaurant users:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
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
                  className="block mb-2 text-sm font-medium text-left text-gray-700"
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
                      placeholder="Enter name"
                      id="name"
                      className="input input-primary"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-left text-gray-700"
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
                      placeholder="Enter Sales Tax"
                      className="input input-primary"
                    />
                  )}
                />
              </div>

              <div className="mb-4 flex justify-between items-center ">
                <label
                  className="block mb-2 text-sm font-medium text-left text-gray-700"
                  htmlFor="default"
                >
                  Default
                </label>
                <CustomSwitch
                  checked={isSwitchChecked}
                  onChange={() => setIsSwitchChecked(!isSwitchChecked)}
                  label="Default"
                  className="ml-2"
                />
              </div>

              <div className="flex items-center justify-end">
                <CButton variant={ButtonType.Primary} type="submit">
                  Save
                </CButton>
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
