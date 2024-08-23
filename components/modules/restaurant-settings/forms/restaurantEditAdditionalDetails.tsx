import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import { BeverageCategory, FoodType, MeatType } from "@/generated/graphql";
import useRestaurantEditStore from "@/store/useRestaurantEditStore";
import { sdk } from "@/utils/graphqlClient";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
import Select from "react-select";

interface IFormInput {
  instagramLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  beverageCategory?: BeverageCategory[];
  foodType?: FoodType[];
  meatType?: MeatType;
}

const formatMeatType = (value: MeatType | undefined) => {
  switch (value) {
    case MeatType.Halal:
      return "Halal";
    case MeatType.NonHalal:
      return "Non-Halal";
    default:
      return "Not specified";
  }
};

const formatFoodType = (value: FoodType | undefined) => {
  switch (value) {
    case FoodType.NonVegetarian:
      return "Non-Vegetarian";
    case FoodType.Vegan:
      return "Vegan";
    case FoodType.Vegetarian:
      return "Vegetarian";
    default:
      return "Not specified";
  }
};

const formatBeverageCategory = (value: BeverageCategory | undefined) => {
  switch (value) {
    case BeverageCategory.Alcohol:
      return "Alcohol";
    case BeverageCategory.NonAlcohol:
      return "Non-Alcohol";
    default:
      return "Not specified";
  }
};

const RestaurantEditAdditionalDetails: React.FC = () => {
  const {
    instagramLink,
    facebookLink,
    twitterLink,
    beverageCategory,
    foodType,
    meatType,
    setInstagramLink,
    setFacebookLink,
    setTwitterLink,
    setBeverageCategory,
    setFoodType,
    setMeatType,
  } = useRestaurantEditStore();

  const [isEditing, setIsEditing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const beverageCategoryOptions: { value: BeverageCategory; label: string }[] =
    Object.values(BeverageCategory).map((val) => ({
      value: val,
      label: formatBeverageCategory(val),
    }));

  const foodTypeOptions: { value: FoodType; label: string }[] = Object.values(
    FoodType
  ).map((val) => ({
    value: val,
    label: formatFoodType(val),
  }));

  const meatTypeOptions: { value: MeatType; label: string }[] = Object.values(
    MeatType
  ).map((val) => ({
    value: val,
    label: formatMeatType(val),
  }));

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      instagramLink,
      facebookLink,
      twitterLink,
      beverageCategory,
      foodType,
      meatType,
    },
  });

  useEffect(() => {
    setValue("instagramLink", instagramLink);
    setValue("facebookLink", facebookLink);
    setValue("twitterLink", twitterLink);
    setValue("beverageCategory", beverageCategory);
    setValue("foodType", foodType);
    setValue("meatType", meatType as MeatType);
  }, [
    instagramLink,
    facebookLink,
    twitterLink,
    beverageCategory,
    foodType,
    meatType,
    setValue,
  ]);

  const onSubmit = async (data: IFormInput) => {
    setBtnLoading(true);
    try {
      await sdk.updateRestaurantDetails({
        input: {
          socialInfo: {
            instagram: data.instagramLink,
            facebook: data.facebookLink,
            twitter: data.twitterLink,
          },
          beverageCategory: data.beverageCategory,
          foodType: data.foodType,
          meatType: data.meatType,
        },
      });

      setInstagramLink(data.instagramLink || "");
      setFacebookLink(data.facebookLink || "");
      setTwitterLink(data.twitterLink || "");
      setBeverageCategory(data.beverageCategory || []);
      setFoodType(data.foodType || []);
      setMeatType(data.meatType || MeatType.Halal);

      // Handle success logic here (e.g., show a success message)
    } catch (error) {
      // Handle error logic here (e.g., show an error message)
      console.error("Error updating restaurant details:", error);
    } finally {
      setBtnLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg space-y-6 w-full border border-gray-300">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Additional Restaurant Details
        </h2>
        <MdOutlineEdit
          className="text-primary text-2xl cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      </div>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-700">Instagram Link</h3>
          <p className="text-sm text-gray-600">
            {instagramLink || "No Instagram link specified"}
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-700">Facebook Link</h3>
          <p className="text-sm text-gray-600">
            {facebookLink || "No Facebook link specified"}
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-700">Twitter Link</h3>
          <p className="text-sm text-gray-600">
            {twitterLink || "No Twitter link specified"}
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Beverage Category
          </h3>
          <p className="text-sm text-gray-600">
            {beverageCategory && beverageCategory.length > 0
              ? beverageCategory.map(formatBeverageCategory).join(", ")
              : "No beverage category specified"}
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-700">Food Type</h3>
          <p className="text-sm text-gray-600">
            {foodType && foodType.length > 0
              ? foodType.map(formatFoodType).join(", ")
              : "No food type specified"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Meat Type</h3>
          <p className="text-sm text-gray-600">{formatMeatType(meatType)}</p>
        </div>
      </div>

      <FullPageModal
        actionButtonLabel=""
        onActionButtonClick={() => {}}
        title="Edit Restaurant Details"
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      >
        <form
          className="space-y-4 md:space-y-3 w-full max-w-2xl mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="instagramLink"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Instagram Link
            </label>
            <input
              type="text"
              {...register("instagramLink")}
              id="instagramLink"
              className="input input-primary"
              placeholder="Enter Instagram link"
            />
            {errors.instagramLink && (
              <p className="text-red-500 text-sm">
                {errors.instagramLink.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="facebookLink"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Facebook Link
            </label>
            <input
              type="text"
              {...register("facebookLink")}
              id="facebookLink"
              className="input input-primary"
              placeholder="Enter Facebook link"
            />
            {errors.facebookLink && (
              <p className="text-red-500 text-sm">
                {errors.facebookLink.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="twitterLink"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Twitter Link
            </label>
            <input
              type="text"
              {...register("twitterLink")}
              id="twitterLink"
              className="input input-primary"
              placeholder="Enter Twitter link"
            />
            {errors.twitterLink && (
              <p className="text-red-500 text-sm">
                {errors.twitterLink.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="beverageCategory"
              className="block mb-2 text-sm font-medium text-gray-700"
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
                  options={beverageCategoryOptions as any}
                  placeholder="Select Beverage Category"
                  className="input-primary"
                />
              )}
            />
            {errors.beverageCategory && (
              <p className="text-red-500 text-sm">
                {errors.beverageCategory.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="foodType"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Food Type
            </label>
            <Controller
              name="foodType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={foodTypeOptions as any}
                  placeholder="Select Food Type"
                  className="input-primary"
                />
              )}
            />
            {errors.foodType && (
              <p className="text-red-500 text-sm">{errors.foodType.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="meatType"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Meat Type
            </label>
            <Controller
              name="meatType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={meatTypeOptions as any}
                  placeholder="Select Meat Type"
                  className="input-primary"
                />
              )}
            />
            {errors.meatType && (
              <p className="text-red-500 text-sm">{errors.meatType.message}</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <CButton
              variant={ButtonType.Primary}
              type="submit"
              className="w-full"
              disabled={btnLoading}
            >
              {btnLoading ? "Updating..." : "Update Details"}
            </CButton>
          </div>
        </form>
      </FullPageModal>
    </div>
  );
};

export default RestaurantEditAdditionalDetails;
