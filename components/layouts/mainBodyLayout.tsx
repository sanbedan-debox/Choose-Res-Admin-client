import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";
import { useForm, Controller } from "react-hook-form";
import ReusableModal from "../common/modal/modal";
import useGlobalStore from "@/store/global";
import CustomSwitch from "../common/customSwitch/customSwitch";
import CButton from "../common/button/button";
import { ButtonType } from "../common/button/interface";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/utilFUncs";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialFormValues, setInitialFormValues] = useState({
    name: "",
    salesTax: "",
    default: false,
  });
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Add");
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      name: "",
      salesTax: "",
      default: false,
    },
  });

  const [isSwitchChecked, setIsSwitchChecked] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const currentFormValues = getValues();
      const changedData: any = { _id: existingTaxRateId };

      if (currentFormValues.name !== initialFormValues.name)
        changedData.name = currentFormValues.name;

      if (currentFormValues.salesTax !== initialFormValues.salesTax) {
        changedData.salesTax = parseFloat(currentFormValues.salesTax);
      }
      const hasChanges = Object.keys(changedData).length > 1;

      if (existingTaxRateId && hasChanges) {
        await sdk.updateTaxRate({
          input: changedData,
        });
        setToastData({
          message: "Tax rate updated successfully",
          type: "success",
        });
      } else if (!existingTaxRateId) {
        setButtonTitle("add");
        const taxRateInput = {
          name: data.name,
          salesTax: parseFloat(data.salesTax),
        };

        const taxRateResponse = await sdk.addTaxRate({ input: taxRateInput });
        setSelectedRestaurantTaxRateId(taxRateResponse?.addTaxRate);

        setToastData({
          message: "Tax rate added successfully",
          type: "success",
        });
      }
      // router.reload();
      fetchRestaurantUsers();
      setisShowTaxSettings(false);
    } catch (error) {
      console.error("Error submitting tax rate:", error);
      setToastData({ message: extractErrorMessage(error), type: "error" });
    }
  };

  const {
    setRestaurants,
    setSelectedRestaurant,
    setSelectedRestaurantTaxRateId,
    selectedRestaurantId,
    setSelectedRestaurantId,
  } = useRestaurantsStore();

  const { setTaxRate, taxRate } = useAuthStore();

  const router = useRouter();
  const [existingTaxRateId, setExistingTaxRateId] = useState<string | null>(
    null
  );
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
          if (res?.getRestaurantDetails) {
            const restaurantDetails = res.getRestaurantDetails;

            setSelectedRestaurant(restaurantDetails.name?.value || "");
            setSelectedRestaurantId(restaurantDetails._id || "");

            const taxRates = restaurantDetails.taxRates ?? null;
            if (taxRates && taxRates.length > 0) {
              const existingTaxRate = taxRates[0];

              setValue("name", existingTaxRate.name || "");
              setValue("salesTax", existingTaxRate.salesTax.toString() || "");

              setSelectedRestaurantTaxRateId(existingTaxRate._id);
              setIsSaveButtonEnabled(false);
              setExistingTaxRateId(existingTaxRate._id);
              setIsButtonVisible(false);
            } else {
              setIsSaveButtonEnabled(true);
              setExistingTaxRateId(null);
              setButtonTitle("Add");
              setIsButtonVisible(true);
            }
            if (taxRates) {
              const formattedTaxRate = taxRates.map((rate) => ({
                id: rate._id,
                name: rate.name,
                salesTax: rate.salesTax,
              }));
              setTaxRate(formattedTaxRate[0]);
            }
          } else {
            try {
              const res = await sdk.setRestaurantIdAsCookie({
                id: formattedRestaurant[0]?.id,
              });
              if (res) {
                setSelectedRestaurant(
                  formattedRestaurant[0]?.name?.value || ""
                );
              }
            } catch (error) {
              setToastData({
                message: extractErrorMessage(error),
                type: "error",
              });
            }
          }
        } catch (error) {
          await sdk.setRestaurantIdAsCookie({
            id: formattedRestaurant[0]?.id,
          });
          setSelectedRestaurant(formattedRestaurant[0]?.name?.value || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch restaurant users:", error);
    } finally {
    }
  };

  const { setToastData } = useGlobalStore();

  const handleInputChange = () => {
    const currentFormValues = getValues();
    const hasChanges =
      currentFormValues.name !== initialFormValues.name ||
      currentFormValues.salesTax !== initialFormValues.salesTax ||
      currentFormValues.default !== initialFormValues.default;
    if (taxRate) {
      setIsSaveButtonEnabled(hasChanges);

      console.log(currentFormValues);
      setButtonTitle("Update");

      setIsButtonVisible(true);
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
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
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
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-end">
                {isButtonVisible && (
                  <CButton
                    variant={ButtonType.Primary}
                    type="submit"
                    disabled={!isSaveButtonEnabled}
                  >
                    {buttonTitle}
                  </CButton>
                )}
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
