import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import { RestaurantType, RestaurantCategory } from "@/generated/graphql";
import {
  extractErrorMessage,
  formatWebsiteUrlClickable,
} from "@/utils/utilFUncs";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import RestaurantOnboardingStore from "@/store/restaurantOnboarding";

interface IFormInput {
  restaurantName: string;
  restaurantWebsite: string;
  restaurantType: string;
  // restaurantCategory?: RestaurantCategory[];
  restaurantCategory?: string[];
  dineInCapacity?: string;
  logo?: string;
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

const RestaurantBasicInformation = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    brandingLogo,
  } = RestaurantOnboardingStore();

  useEffect(() => {
    setValue("restaurantName", restaurantName);
    setValue("restaurantWebsite", restaurantWebsite);
    setValue("restaurantType", restaurantType);
    setValue("restaurantCategory", restaurantCategory);
    setValue("dineInCapacity", dineInCapacity);
    setPreviewUrl(brandingLogo || "");
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
  const handleLogoUpload = async () => {
    if (logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);
      formData.append("upload_preset", "restaurants-branding-logo");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
        { method: "POST", body: formData }
      ).then((r) => r.json());

      const cloudinaryUrl = response?.secure_url;
      setPreviewUrl(cloudinaryUrl);

      return cloudinaryUrl;
    }
  };
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Update state to store the selected file
      setLogoFile(file);

      // Set the preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      const formattedWebsite = formatWebsiteUrlClickable(
        data.restaurantWebsite
      );
      const imgUrl = await handleLogoUpload();

      const input: any = {
        name: {
          value: data.restaurantName,
        },
        website: formattedWebsite,
        type: data.restaurantType as RestaurantType,
        category: data.restaurantCategory || [],
        brandingLogo: imgUrl,
      };
      if (
        data.restaurantCategory?.includes(RestaurantCategory.DineIn) ||
        data.restaurantCategory?.includes(RestaurantCategory.PremiumDineIn)
      ) {
        input.dineInCapacity = {
          value: data.dineInCapacity ? parseInt(data.dineInCapacity) : 0,
        };
      }
      const response = await sdk.restaurantOnboarding({
        input: input,
      });

      setToastData({
        message: "Restaurant details updated successfully!",
        type: "success",
      });
      router.push("/onboarding-restaurant/restaurant-availibility");
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-lg flex flex-col items-center space-y-5 text-center"
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

        <div className="col-span-2">
          <label className="block mb-2 text-lg font-medium text-left text-gray-700">
            Branding
          </label>
          <div className="mb-4">
            {previewUrl ? (
              <div className="flex items-center justify-between hover:bg-primary hover:bg-opacity-5 px-4 rounded-md">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                Logo (Optional)
                <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
                  <input
                    type="file"
                    {...register("logo")}
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                      <p className="mt-1 text-sm text-gray-500">
                        Drag and drop a logo or{" "}
                        <span className="text-blue-600">browse file</span>
                      </p>
                    </div>
                  </label>
                </div>
              </label>
            )}
          </div>
        </div>

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
          <Controller
            name="restaurantType"
            control={control}
            rules={{ required: "Restaurant type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="state"
                options={restaurantTypeOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select Restaurant Type"
                value={restaurantTypeOptions.find(
                  (option) => option.value === restaurantType
                )}
                onChange={(option) => {
                  setValue("restaurantType", option?.value || "");
                  setRestaurantType(option?.value || "");
                }}
              />
            )}
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

          <Controller
            name="restaurantCategory"
            control={control}
            rules={{ required: "Restaurant category is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                id="restaurantCategory"
                options={restaurantCategoryOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select restaurant category"
                value={restaurantCategoryOptions.filter((option) =>
                  (restaurantCategory ?? []).includes(
                    option.value as RestaurantCategory
                  )
                )}
                onChange={(options) => {
                  const selectedOptions = options
                    ? options.map(
                        (option) => option.value as RestaurantCategory
                      )
                    : [];
                  setValue("restaurantCategory", selectedOptions);
                  setRestaurantCategory(selectedOptions);
                }}
              />
            )}
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            You can select multiple categories for your restaurant
          </p>
          {errors.restaurantCategory && (
            <p className="text-red-500 text-sm text-start">
              {errors.restaurantCategory.message}
            </p>
          )}
        </div>

        {restaurantCategory &&
          (restaurantCategory.includes(RestaurantCategory.DineIn) ||
            restaurantCategory.includes(RestaurantCategory.PremiumDineIn)) && (
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
            loading={btnLoading}
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

export default RestaurantBasicInformation;
