import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import { RestaurantCategory, RestaurantType } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useRestaurantsStore from "@/store/restaurant";
import useRestaurantEditStore from "@/store/useRestaurantEditStore";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  formatWebsiteUrlClickable,
} from "@/utils/utilFUncs";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
import Select from "react-select";

const RestaurantBasicInformationEditForm: React.FC = () => {
  const {
    restaurantName,
    brandingLogo,
    restaurantWebsite,
    restaurantType,
    restaurantCategory,
    dineInCapacity,
    setRestaurantName,
    setRestaurantWebsite,
    setRestaurantType,
    setRestaurantCategory,
    setDineInCapacity,
  } = useRestaurantEditStore();

  const { setToastData } = useGlobalStore();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showDineInCapacity, setShowDineInCapacity] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      restaurantName: restaurantName || "",
      restaurantWebsite: restaurantWebsite || "",
      restaurantType: restaurantType || "",
      restaurantCategory: restaurantCategory || [],
      dineInCapacity: dineInCapacity || 0,
    },
  });

  useEffect(() => {
    setPreviewUrl(brandingLogo);
    if (
      restaurantCategory.includes(RestaurantCategory.DineIn) ||
      restaurantCategory.includes(RestaurantCategory.PremiumDineIn)
    ) {
      setShowDineInCapacity(true);
    }
  }, []);

  const { setSelectedRestaurant } = useRestaurantsStore();

  const onSubmit = async (data: any) => {
    try {
      setBtnLoading(true);
      const formattedWebsite = formatWebsiteUrlClickable(
        data.restaurantWebsite
      );

      const imgUrl = logoFile || previewUrl ? await handleLogoUpload() : null;
      const updateInput: any = {};
      let HasChanges = false;
      if (restaurantName !== data.restaurantName) {
        updateInput.name = data.restaurantName;
        HasChanges = true;
      }
      if (restaurantWebsite !== formattedWebsite) {
        updateInput.website = formattedWebsite;
        HasChanges = true;
      }
      if (restaurantType !== data.restaurantType) {
        updateInput.type = data.restaurantType as RestaurantType;
        HasChanges = true;
      }
      if (
        JSON.stringify(restaurantCategory) !==
        JSON.stringify(data.restaurantCategory)
      ) {
        (updateInput.category = data.restaurantCategory.map(
          (cat: any) => cat.value as RestaurantCategory
        )),
          (HasChanges = true);
      }
      console.log(brandingLogo, imgUrl);
      if (brandingLogo !== imgUrl) {
        updateInput.brandingLogo = imgUrl;
        HasChanges = true;
      }
      if (showDineInCapacity && dineInCapacity !== data.dineInCapacity) {
        updateInput.dineInCapacity =
          parseInt(data.dineInCapacity.toString()) || 0;
        HasChanges = true;
      }

      if (HasChanges) {
        const response = await sdk.updateRestaurantDetails({
          input: updateInput,
        });
        if (response && response.updateRestaurantDetails) {
          setRestaurantName(data.restaurantName);
          setRestaurantWebsite(formattedWebsite);
          setRestaurantType(data.restaurantType);

          setRestaurantCategory(
            data.restaurantCategory.map(
              (cat: any) => cat.value as RestaurantCategory
            )
          );
          setDineInCapacity(
            showDineInCapacity ? data.dineInCapacity || 0 : undefined
          );
          setPreviewUrl(imgUrl);

          setSelectedRestaurant(data.restaurantName);
          setToastData({
            message: "Basic Restaurant Details Updated successfully",
            type: "success",
          });
          setEditModalOpen(false);
        }
      } else {
        setEditModalOpen(false);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

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
      setLogoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const restaurantTypeOptions = Object.values(RestaurantType).map((val) => ({
    value: val.toString(),
    label: formatRestaurantType(val),
  }));

  const restaurantCategoryOptions = Object.values(RestaurantCategory).map(
    (val) => ({
      value: val.toString(),
      label: formatRestaurantCategory(val),
    })
  ) as { value: string; label: string }[];

  return (
    <div className="bg-white p-5 rounded-lg  w-full ">
      <div className="flex justify-between items-center ">
        <h2 className="text-lg font-semibold text-gray-900">
          Restaurant Basic Information
        </h2>
        <MdOutlineEdit
          className="text-primary text-2xl cursor-pointer"
          onClick={() => setEditModalOpen(true)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center pt-3">
          <div>
            <h3 className="text font-medium text-gray-700">Restaurant Name</h3>
            <p className="text-xs text-neutral-500">
              {restaurantName ? restaurantName : "No restaurant name"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t  pt-3">
          <div>
            <h3 className="text font-medium text-gray-700">Restaurant Logo</h3>
            <p className="text-xs text-neutral-500">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Restaurant Logo"
                  className="w-20 h-20 object-cover"
                />
              ) : brandingLogo ? (
                <img
                  src={brandingLogo}
                  alt="Restaurant Logo"
                  className="w-20 h-20 object-cover"
                />
              ) : (
                "No logo"
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t  pt-3">
          <div>
            <h3 className="text font-medium text-gray-700">Website</h3>
            <p className="text-xs text-neutral-500">
              {restaurantWebsite ? restaurantWebsite : "No website"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t  pt-3">
          <div>
            <h3 className="text font-medium text-gray-700">Type</h3>
            <p className="text-xs text-neutral-500">
              {restaurantType
                ? formatRestaurantType(restaurantType as RestaurantType)
                : "No type specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t  pt-3">
          <div>
            <h3 className="text font-medium text-gray-700">Category</h3>
            <p className="text-xs text-neutral-500">
              {restaurantCategory && restaurantCategory.length > 0
                ? restaurantCategory
                    .map((category) => formatRestaurantCategory(category))
                    .join(", ")
                : "No category specified"}
            </p>
          </div>
        </div>

        {restaurantCategory.includes(RestaurantCategory.DineIn) ||
        restaurantCategory.includes(RestaurantCategory.PremiumDineIn) ? (
          <div className="flex justify-between items-center border-t  pt-3">
            <div>
              <h3 className="text font-medium text-gray-700">
                Dine-in Capacity
              </h3>
              <p className="text-xs text-neutral-500">
                {dineInCapacity ? dineInCapacity : "No capacity specified"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {editModalOpen && (
        <FullPageModal
          actionButtonLabel=""
          onActionButtonClick={() => {}}
          title="Edit Restaurant"
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <form
            className="space-y-4 md:space-y-3 mx-auto w-full max-w-4xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="restaurantName"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurantName"
                {...register("restaurantName", {
                  required: "Restaurant name is required",
                })}
                className="input"
                placeholder="Restaurant Name"
                defaultValue={restaurantName}
              />
              {errors.restaurantName && (
                <p className="text-red-500 text-sm mt-1">
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
                        // {...register("logo")}
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
                            <span className="text-primary">browse file</span>
                          </p>
                        </div>
                      </label>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="restaurantWebsite"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Website
              </label>
              <input
                type="text"
                id="restaurantWebsite"
                {...register("restaurantWebsite", {
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/,
                    message: "Invalid website URL",
                  },
                })}
                className="input"
                placeholder="Restaurant Website"
                defaultValue={restaurantWebsite}
              />
              {errors.restaurantWebsite && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantWebsite.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="restaurantType"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Type
              </label>
              <Controller
                control={control}
                name="restaurantType"
                rules={{
                  required: "Restaurant type is required",
                }}
                render={({ field }) => (
                  <Select
                    id="restaurantType"
                    options={restaurantTypeOptions}
                    classNames={{
                      option: (state) =>
                        `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                          state.isSelected ? "!bg-primary text-white" : ""
                        }`,
                    }}
                    defaultValue={restaurantTypeOptions.find(
                      (option) => option.value === restaurantType
                    )}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                  />
                )}
              />
              {errors.restaurantType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantType.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="restaurantCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Category
              </label>
              <Controller
                control={control}
                name="restaurantCategory"
                rules={{
                  required: "Restaurant category is required",
                }}
                render={({ field }) => (
                  <Select
                    id="restaurantCategory"
                    isMulti
                    classNames={{
                      option: (state) =>
                        `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                          state.isSelected ? "!bg-primary text-white" : ""
                        }`,
                    }}
                    options={restaurantCategoryOptions}
                    defaultValue={restaurantCategoryOptions.filter((option) =>
                      restaurantCategory.includes(
                        option.value as RestaurantCategory
                      )
                    )}
                    onChange={(selected) => {
                      field.onChange(selected);
                      const selectedCategories = selected.map(
                        (option) => option.value
                      );
                      setShowDineInCapacity(
                        selectedCategories.includes(
                          RestaurantCategory.DineIn
                        ) ||
                          selectedCategories.includes(
                            RestaurantCategory.PremiumDineIn
                          )
                      );
                    }}
                  />
                )}
              />
              {errors.restaurantCategory && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantCategory.message}
                </p>
              )}
            </div>

            {/* {getValues("restaurantCategory").includes(
              RestaurantCategory.DineIn
            ) ||
            getValues("restaurantCategory").includes(
              RestaurantCategory.PremiumDineIn
            ) ? (
              <div>
                <label
                  htmlFor="dineInCapacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dine-in Capacity
                </label>
                <input
                  type="number"
                  id="dineInCapacity"
                  {...register("dineInCapacity", {
                    min: {
                      value: 1,
                      message: "Capacity must be at least 1",
                    },
                  })}
                  className="input"
                  placeholder="Dine-in Capacity"
                  defaultValue={dineInCapacity}
                />
                {errors.dineInCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dineInCapacity.message}
                  </p>
                )}
              </div>
            ) : null} */}

            {showDineInCapacity ? (
              <div className="col-span-2">
                <label
                  htmlFor="dineInCapacity"
                  className="block mb-2 text-sm font-medium text-left text-gray-700"
                >
                  Dine-In Capacity
                </label>
                <input
                  type="number"
                  {...register("dineInCapacity")}
                  id="dineInCapacity"
                  className="input input-primary"
                  placeholder="Enter dine-in capacity"
                  value={dineInCapacity}
                  style={{
                    appearance: "textfield",
                  }}
                  inputMode="decimal"
                  step="0.01"
                  onWheel={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === "e" || e.key === "-" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setValue("dineInCapacity", e.target.value)}
                />
              </div>
            ) : null}

            <div className="flex justify-end">
              <CButton
                type="submit"
                variant={ButtonType.Primary}
                className="w-full"
                disabled={btnLoading}
              >
                {btnLoading ? "Updating..." : "Update"}
              </CButton>
            </div>
          </form>
        </FullPageModal>
      )}
    </div>
  );
};

export default RestaurantBasicInformationEditForm;
