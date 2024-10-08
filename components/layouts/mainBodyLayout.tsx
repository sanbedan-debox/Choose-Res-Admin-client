import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";
import useRestaurantsStore from "@/store/restaurant";
import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CButton from "../common/button/button";
import { ButtonType } from "../common/button/interface";
import ReusableModal from "../common/modal/modal";
import Loader from "../loader";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configs
  const [initialTaxRateNotAddedFormStates] = useState({
    name: "",
    salesTax: "",
    default: false,
  });
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Add");
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [existingTaxRateId, setExistingTaxRateId] = useState<string | null>(
    null
  );

  // Global and Local States
  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      name: "",
      salesTax: "",
      default: false,
    },
  });

  const { isShowTaxSettings, setIsShowTaxSettings } = useGlobalStore();
  const {
    setRestaurants,
    setSelectedRestaurant,
    setSelectedRestaurantTaxRateId,
    setSelectedRestaurantId,
  } = useRestaurantsStore();
  const { setTaxRate, taxRate } = useAuthStore();
  const { setMasterStates, setMasterTimezones } = useMasterStore();
  const {
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
  } = useAuthStore();
  const { setToastData } = useGlobalStore();

  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserDetails();
      await fetchUserRestaurants();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resstates = await sdk.getActiveStates();
        if (resstates && resstates.getActiveStates) {
          const formattedStates = resstates.getActiveStates.map(
            (state: { value: string; _id: string }) => ({
              value: state._id,
              label: state.value,
            })
          );
          setMasterStates(formattedStates);
        }
        const resTimeZones = await sdk.getActiveTimezones();
        if (resTimeZones && resTimeZones.getActiveTimezones) {
          const formattedTimeZones = resTimeZones.getActiveTimezones.map(
            (timeZone: { gmtOffset: number; value: string; _id: string }) => {
              const gmtOffsetHours = timeZone.gmtOffset / 3600;
              const sign = gmtOffsetHours >= 0 ? "+" : "-";
              const formattedLabel = `${timeZone.value} (GMT ${sign} ${Math.abs(
                gmtOffsetHours
              )})`;
              return {
                value: timeZone._id,
                label: formattedLabel,
              };
            }
          );
          setMasterTimezones(formattedTimeZones);
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetch();
  }, [setMasterStates, setMasterTimezones]);

  // Handler Functions
  const handleCloseTaxSettings = () => {
    setIsShowTaxSettings(false);
  };

  const onSubmit = async (data: {
    name: string;
    salesTax: string;
    default: boolean;
  }) => {
    try {
      const currentFormValues = getValues();
      const changedData: {
        _id: string;
        name?: string;
        salesTax?: number;
      } = {
        _id: existingTaxRateId ?? "",
        name: currentFormValues.name,
        salesTax: parseFloat(currentFormValues.salesTax),
      };
      const hasChanges = Object.keys(changedData).length > 1;

      if (existingTaxRateId && hasChanges) {
        await sdk.updateTaxRate({ input: changedData });
        setToastData({
          message: "Tax rate updated successfully",
          type: "success",
        });
      } else if (!existingTaxRateId) {
        setButtonTitle("Add");
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
      setIsShowTaxSettings(false);
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
          permissions,
          role,
        } = response.meUser;
        useUserStore.getState().setMeUser({
          _id,
          firstName,
          lastName,
          status,
          email,
          phone,
          permissions,
          role,
        });
        setUserId(_id ?? "");
        setEmail(email ?? "");
        setPhone(phone ?? "");
        setFirstName(firstName ?? "");
        setLastName(lastName ?? "");
        setStatus(status ?? "");
      }
    } catch (error) {
      setToastData({ message: extractErrorMessage(error), type: "error" });
    }
  };

  const fetchUserRestaurants = async () => {
    try {
      const response = await sdk.userRestaurants();
      if (response?.userRestaurants) {
        const formattedRestaurant = response.userRestaurants.map((res) => ({
          ...res,
        }));
        setRestaurants(formattedRestaurant);

        try {
          const res = await sdk.restaurantDetails();
          if (res?.restaurantDetails) {
            const { name, _id, taxRates } = res.restaurantDetails;

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
              setIsButtonVisible(false);
              setExistingTaxRateId(existingTaxRate._id);
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
          await sdk.setRestaurantIdAsCookie({ id: formattedRestaurant[0]?.id });
          setSelectedRestaurant(formattedRestaurant[0]?.name || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch restaurant users:", error);
    }
  };

  const handleInputChange = () => {
    const currentFormValues = getValues();
    const hasChanges =
      currentFormValues.name !== initialTaxRateNotAddedFormStates.name ||
      currentFormValues.salesTax !==
        initialTaxRateNotAddedFormStates.salesTax ||
      currentFormValues.default !== initialTaxRateNotAddedFormStates.default;
    if (taxRate) {
      setIsSaveButtonEnabled(hasChanges);
      setButtonTitle("Update");
      setIsButtonVisible(true);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
      )}
    </>
  );
};

export default MainLayout;
