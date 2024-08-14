import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantsStore from "@/store/restaurant";
import { useForm, Controller } from "react-hook-form";
import ReusableModal from "../common/modal/modal";
import useGlobalStore from "@/store/global";
import CButton from "../common/button/button";
import { ButtonType } from "../common/button/interface";
import useAuthStore from "@/store/auth";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useUserStore from "@/store/user";

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

  useEffect(() => {
    fetchUserDetails();
    fetchUserRestaurants();
  }, []);

  const { isShowTaxSettings, setisShowTaxSettings } = useGlobalStore();

  const {
    setRestaurants,
    setSelectedRestaurant,
    setSelectedRestaurantTaxRateId,
    selectedRestaurantId,
    setSelectedRestaurantId,
  } = useRestaurantsStore();

  const handleCloseTaxSettings = () => {
    setisShowTaxSettings(false);
  };

  const { setTaxRate, taxRate } = useAuthStore();

  const [existingTaxRateId, setExistingTaxRateId] = useState<string | null>(
    null
  );

  const onSubmit = async (data: {
    name: string;
    salesTax: string;
    default: boolean;
  }) => {
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
      fetchUserRestaurants();
      setisShowTaxSettings(false);
    } catch (error) {
      console.error("Error submitting tax rate:", error);
      setToastData({ message: extractErrorMessage(error), type: "error" });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await sdk.MeUser();
      if (response?.meUser) {
        const {
          _id,
          firstName,
          lastName,
          status,
          email,
          phone,
          ownerUserId,
          permissions,
          role,
          businessInfo,
          restaurants,
        } = response.meUser;
        useUserStore.getState().setMeUser({
          _id,
          firstName,
          lastName,
          status,
          email,
          phone,
          ownerUserId,
          permissions,
          role,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setToastData({ message: extractErrorMessage(error), type: "error" });
    }
  };

  const fetchUserRestaurants = async () => {
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
            const { name, _id, taxRates } = res.getRestaurantDetails;

            setSelectedRestaurant(name || "");
            setSelectedRestaurantId(_id || "");

            if (taxRates && taxRates.length > 0) {
              const existingTaxRate: {
                _id: string;
                name: string;
                salesTax: number;
              } = taxRates[0];

              setValue("name", existingTaxRate.name ?? "");
              setValue("salesTax", existingTaxRate.salesTax.toString() ?? "");

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
              const formattedTaxRate = taxRates.map(
                (rate: { _id: string; name: string; salesTax: number }) => ({
                  id: rate._id,
                  name: rate.name,
                  salesTax: rate.salesTax,
                })
              );
              setTaxRate(formattedTaxRate[0]);
            }
          } else {
            try {
              const res = await sdk.setRestaurantIdAsCookie({
                id: formattedRestaurant[0]?.id,
              });
              if (res) {
                setSelectedRestaurant(formattedRestaurant[0]?.name || "");
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
          setSelectedRestaurant(formattedRestaurant[0]?.name || "");
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

      setButtonTitle("Update");

      setIsButtonVisible(true);
    }
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
