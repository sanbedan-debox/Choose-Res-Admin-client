import { useEffect } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import { MeatType, FoodType, BeverageCategory } from "@/generated/graphql";
import useRestaurantInfoStore from "@/store/restaurantOnboarding";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { extractErrorMessage } from "@/utils/utilFUncs";

interface IFormInput {
  instagramLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  beverageCategory?: BeverageCategory[];
  foodType?: FoodType[];
  meatType?: string;
}

const formatMeatType = (value: MeatType) => {
  switch (value) {
    case MeatType.Halal:
      return "Halal";
    case MeatType.NonHalal:
      return "Non-Halal";
    default:
      return "";
  }
};

const formatFoodType = (value: FoodType) => {
  switch (value) {
    case FoodType.NonVegetarian:
      return "Non-Vegetarian";
    case FoodType.Vegan:
      return "Vegan";
    case FoodType.Vegetarian:
      return "Vegetarian";
    default:
      return "";
  }
};

const formatBeverageCategory = (value: BeverageCategory) => {
  switch (value) {
    case BeverageCategory.Alcohol:
      return "Alcohol";
    case BeverageCategory.NonAlcohol:
      return "Non-Alcohol";
    default:
      return "";
  }
};

const RestaurantAdditionalInformation = () => {
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
    instagramLink,
    setInstagramLink,
    facebookLink,
    setFacebookLink,
    twitterLink,
    setTwitterLink,
    beverageCategory,
    setBeverageCategory,
    foodType,
    setFoodType,
    meatType,
    setMeatType,
  } = useRestaurantInfoStore();

  useEffect(() => {
    setValue("instagramLink", instagramLink);
    setValue("facebookLink", facebookLink);
    setValue("twitterLink", twitterLink);
    setValue("beverageCategory", beverageCategory);
    setValue("foodType", foodType);
    setValue("meatType", meatType);
  }, [
    instagramLink,
    facebookLink,
    twitterLink,
    beverageCategory,
    foodType,
    meatType,
    setValue,
  ]);

  const beverageCategoryOptions = Object.values(BeverageCategory).map(
    (val) => ({
      value: val,
      label: formatBeverageCategory(val),
    })
  );

  const foodTypeOptions = Object.values(FoodType).map((val) => ({
    value: val,
    label: formatFoodType(val),
  }));

  const meatTypeOptions = Object.values(MeatType).map((val) => ({
    value: val,
    label: formatMeatType(val),
  }));

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await sdk.restaurantOnboarding({
        input: {
          socialInfo: {
            facebook: data.facebookLink,
            instagram: data.instagramLink,
            twitter: data.twitterLink,
          },
          beverageCategory: data.beverageCategory || [],
          foodType: data.foodType || [],
          meatType: data.meatType as MeatType,
        },
      });
      if (response.restaurantOnboarding) {
        const res = await sdk.CompleteRestaurantOnboarding();
        if (res.completeRestaurantOnboarding) {
          setToastData({
            message: "Restaurant Added successfully!",
            type: "success",
          });
          router.replace("/dashboard");
        }
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
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
          Restaurant Basic Details
        </h1>
        <p className="max-w-md text-accent-foreground/80 transition-colors text-sm">
          All these fields are optional. If you want you can fill it later.
        </p>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="instagramLink"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Instagram Link
          </label>
          <input
            type="text"
            {...register("instagramLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_-]{1,}$/i,
                message: "Invalid Instagram link format",
              },
            })}
            id="instagramLink"
            className="input input-primary"
            placeholder="Enter Instagram link"
            onChange={(e) => setInstagramLink(e.target.value)}
          />
          {errors.instagramLink && (
            <p className="text-red-500 text-sm text-start">
              {errors.instagramLink.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="facebookLink"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Facebook Link
          </label>
          <input
            type="text"
            {...register("facebookLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_-]{1,}$/i,
                message: "Invalid Facebook link format",
              },
            })}
            id="facebookLink"
            className="input input-primary"
            placeholder="Enter Facebook link"
            onChange={(e) => setFacebookLink(e.target.value)}
          />
          {errors.facebookLink && (
            <p className="text-red-500 text-sm text-start">
              {errors.facebookLink.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="twitterLink"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Twitter Link
          </label>
          <input
            type="text"
            {...register("twitterLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/i,
                message: "Invalid Twitter link format",
              },
            })}
            id="twitterLink"
            className="input input-primary"
            placeholder="Enter Twitter link"
            onChange={(e) => setTwitterLink(e.target.value)}
          />
          {errors.twitterLink && (
            <p className="text-red-500 text-sm text-start">
              {errors.twitterLink.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="beverageCategory"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Beverage Category
          </label>

          <Controller
            name="beverageCategory"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                id="beverageCategory"
                options={beverageCategoryOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select beverage categories"
                value={beverageCategoryOptions.filter((option) =>
                  (beverageCategory ?? []).includes(
                    option.value as BeverageCategory
                  )
                )}
                onChange={(options) => {
                  const selectedCategories =
                    options?.map(
                      (option) => option.value as BeverageCategory
                    ) || [];
                  setValue("beverageCategory", selectedCategories);
                  setBeverageCategory(selectedCategories);
                }}
              />
            )}
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="foodType"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Food Type
          </label>

          <Controller
            name="foodType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="foodType"
                options={foodTypeOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select beverage categories"
                isMulti
                value={foodTypeOptions.filter((option) =>
                  (foodType || []).includes(option.value as FoodType)
                )}
                onChange={(options) => {
                  const selectedTypes =
                    options?.map((option) => option.value as FoodType) || [];
                  setValue("foodType", selectedTypes);
                  setFoodType(selectedTypes);
                }}
              />
            )}
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="meatType"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Meat Type
          </label>

          <Controller
            name="meatType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="state"
                options={meatTypeOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select meat type"
                value={meatTypeOptions.find(
                  (option) => option.value === meatType
                )}
                onChange={(option) => {
                  setValue("meatType", option?.value || "");
                  setMeatType(option?.value as MeatType);
                }}
              />
            )}
          />
        </div>

        <CButton className="w-full" type="submit" variant={ButtonType.Primary}>
          Submit
        </CButton>
      </form>
    </motion.div>
  );
};

export default RestaurantAdditionalInformation;
