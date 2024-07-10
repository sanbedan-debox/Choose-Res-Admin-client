import { useEffect } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import { RestaurantType, RestaurantCategory } from "@/generated/graphql";
import useRestaurantLocationStore from "@/store/restaurantOnboarding";
import { formatWebsiteUrlClickable } from "@/store/utilFUncs";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

interface IFormInput {
  restaurantName: string;
  restaurantWebsite: string;
  restaurantType: string;
  restaurantCategory: string;
  dineInCapacity?: string;
}

const formatRestaurantType = (value: RestaurantType) => {
  switch (value) {
    case RestaurantType.Independent:
      return "Independent";
    case RestaurantType.PartOfChain:
      return "Part of Chain";
    default:
      return "";
  }
};

const formatRestaurantCategory = (value: RestaurantCategory) => {
  switch (value) {
    case RestaurantCategory.CloudKitchen:
      return "Cloud Kitchen";
    case RestaurantCategory.DineIn:
      return "Dine-In";
    case RestaurantCategory.PremiumDineIn:
      return "Premium Dine-In";
    case RestaurantCategory.Qsr:
      return "QSR";
    case RestaurantCategory.Takeout:
      return "Takeout";
    default:
      return "";
  }
};

const RestaurantLocation = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();

  const {
    restaurantName,
    setRestaurantName,
    restaurantWebsite,
    setRestaurantWebsite,
    restaurantType,
    setRestaurantType,
    restaurantCategory,
    setRestaurantCategory,
    dineInCapacity,
    setDineInCapacity,
    setId,
  } = useRestaurantLocationStore();

  useEffect(() => {
    setValue("restaurantName", restaurantName);
    setValue("restaurantWebsite", restaurantWebsite);
    setValue("restaurantType", restaurantType);
    setValue("restaurantCategory", restaurantCategory);
    setValue("dineInCapacity", dineInCapacity);
  }, [
    restaurantName,
    restaurantWebsite,
    restaurantType,
    restaurantCategory,
    dineInCapacity,
    setValue,
  ]);

  const restaurantTypeOptions = Object.values(RestaurantType).map((val) => ({
    value: val.toString(),
    label: formatRestaurantType(val),
  }));

  const restaurantCategoryOptions = Object.values(RestaurantCategory).map(
    (val) => ({
      value: val.toString(),
      label: formatRestaurantCategory(val),
    })
  );

  const onSubmit = async (data: IFormInput) => {
    try {
      const formattedWebsite = formatWebsiteUrlClickable(
        data.restaurantWebsite
      );

      const response = await sdk.restaurantOnboarding({
        input: {
          name: {
            value: data.restaurantName,
          },
          website: formattedWebsite,
          type: data.restaurantType as RestaurantType,
          category: [data.restaurantCategory as RestaurantCategory],
          dineInCapacity: {
            value: data.dineInCapacity ? parseInt(data.dineInCapacity) : 0,
          },
        },
      });

      setToastData({
        message: "Restaurant details updated successfully!",
        type: "success",
      });
      router.push("/onboarding-restaurant/restaurant-availibility");
    } catch (error: any) {
      setToastData({
        message: `Failed to update restaurant details: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-md flex flex-col items-center space-y-5 text-center"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-5 text-center"
      >
        <h1 className="font-display max-w-2xl font-semibold transition-colors text-2xl">
          Tell us about your restaurant
        </h1>
        <p className="max-w-md text-accent-foreground/80 transition-colors text-sm">
          Every restaurant is unique. Provide accurate information for best
          results.
        </p>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="restaurantName"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            {...register("restaurantName", {
              required: "Restaurant name is required",
            })}
            id="restaurantName"
            className="input input-primary"
            placeholder="Enter restaurant name"
            onChange={(e) => setRestaurantName(e.target.value)}
          />
          {errors.restaurantName && (
            <p className="text-red-500 text-sm text-start">
              {errors.restaurantName.message}
            </p>
          )}
        </div>
        {/* <div className="col-span-2">
          <label className="block mb-2 text-lg font-medium text-left text-gray-700">
            Branding
          </label>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Logo(Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                {...register("logo")}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <svg
                    xmlns="http:www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop a logo or{" "}
                  <span className="text-blue-600">browse file</span>
                </p>
              </label>
            </div>
          </div>
        </div> */}
        <div className="col-span-2">
          <label
            htmlFor="restaurantWebsite"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Restaurant Website
          </label>
          <input
            type="text"
            {...register("restaurantWebsite", {
              required: "Restaurant website is required",
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: "Please enter a valid website URL",
              },
            })}
            id="restaurantWebsite"
            className="input input-primary"
            placeholder="Enter restaurant website"
            onChange={(e) => setRestaurantWebsite(e.target.value)}
          />
          {errors.restaurantWebsite && (
            <p className="text-red-500 text-sm text-start">
              {errors.restaurantWebsite.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="restaurantType"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Restaurant Type
          </label>
          <Select
            {...register("restaurantType", {
              required: "Restaurant type is required",
            })}
            options={restaurantTypeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select restaurant type"
            value={restaurantTypeOptions.find(
              (option) => option.value === restaurantType
            )}
            onChange={(option) => {
              setValue("restaurantType", option?.value || "");
              setRestaurantType(option?.value || "");
            }}
          />
          {errors.restaurantType && (
            <p className="text-red-500 text-sm text-start">
              {errors.restaurantType.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="restaurantCategory"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Restaurant Category
          </label>
          <Select
            {...register("restaurantCategory", {
              required: "Restaurant category is required",
            })}
            options={restaurantCategoryOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select restaurant category"
            value={restaurantCategoryOptions.find(
              (option) => option.value === restaurantCategory
            )}
            onChange={(option) => {
              setValue("restaurantCategory", option?.value || "");
              setRestaurantCategory(option?.value || "");

              // Show dine-in capacity field if Dine-In or Premium Dine-In is selected
              if (
                option?.value === RestaurantCategory.DineIn ||
                option?.value === RestaurantCategory.PremiumDineIn
              ) {
                setDineInCapacity("");
              }
            }}
          />
          {errors.restaurantCategory && (
            <p className="text-red-500 text-sm text-start">
              {errors.restaurantCategory.message}
            </p>
          )}
        </div>

        {/* Dine-in capacity field */}
        {(restaurantCategory === RestaurantCategory.DineIn ||
          restaurantCategory === RestaurantCategory.PremiumDineIn) && (
          <div className="col-span-2">
            <label
              htmlFor="dineInCapacity"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Dine-In Capacity
            </label>
            <input
              type="text"
              {...register("dineInCapacity")}
              id="dineInCapacity"
              className="input input-primary"
              placeholder="Enter dine-in capacity"
              value={dineInCapacity}
              onChange={(e) => setDineInCapacity(e.target.value)}
            />
          </div>
        )}

        <div className="col-span-2">
          <CButton
            variant={ButtonType.Primary}
            type="submit"
            className="mt-8 w-full btn btn-primary"
          >
            Continue
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantLocation;
