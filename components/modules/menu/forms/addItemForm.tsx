import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { title } from "process";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import useMenuOptionsStore from "@/store/menuOptions";
import useMenuItemsStore from "@/store/menuItems";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";

interface IFormInput {
  name: string;
  desc: string;
  image: string;
  price: number;
  status: { value: string; label: string };
  applySalesTax: boolean;
  popularItem: boolean;
  upSellItem: boolean;
  isSpicy: boolean;
  hasNuts: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isVegan: boolean;
}

const statusOptions: any[] = [
  { value: StatusEnum.Active, label: "Active" },
  { value: StatusEnum.Inactive, label: "Inactive" },
];

const AddItemForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>();

  const { fetchMenuDatas, setfetchMenuDatas, setisAddItemModalOpen } =
    useMenuOptionsStore();
  const { editItemId, isEditItem, setEditItemId, setisEditItem } =
    useMenuItemsStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();

  useEffect(() => {
    const fetchItemData = async () => {
      if (editItemId) {
        try {
          const response = await sdk.getItem({ id: editItemId });
          const item = response.getItem;
          setValue("name", item.name.value);
          setValue("desc", item.desc.value);
          setValue("status", { value: item.status, label: item.status });
          setValue("price", item.price.value);
          setValue("applySalesTax", item.applySalesTax);
          setValue("popularItem", item.popularItem);
          setValue("upSellItem", item.upSellItem);
          setValue("isSpicy", item.isSpicy);
          setValue("hasNuts", item.hasNuts);
          setValue("isGlutenFree", item.isGlutenFree);
          setValue("isHalal", item.isHalal);
          setValue("isVegan", item.isVegan);
          setPreviewUrl(item.image || "");
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          setToastData({
            type: "error",
            message: errorMessage,
          });
        }
      }
    };

    fetchItemData();
  }, [editItemId, setValue, setToastData]);

  const onSubmit = async (data: IFormInput) => {
    try {
      const statusSub = data.status.value as StatusEnum;
      const parsedPrice = parseFloat(data.price.toString());

      setBtnLoading(true);
      !isEditItem
        ? // ADD ITEM API
          await sdk.addItem({
            input: {
              name: {
                value: data.name,
              },
              desc: {
                value: data.desc,
              },
              image: previewUrl,
              price: {
                value: parsedPrice,
              },
              status: statusSub,
              applySalesTax: data.applySalesTax ? true : false,
              popularItem: data.popularItem ? true : false,
              upSellItem: data.upSellItem ? true : false,
              hasNuts: data.hasNuts ? true : false,
              isGlutenFree: data.isGlutenFree ? true : false,
              isHalal: data.isHalal ? true : false,
              isVegan: data.isVegan ? true : false,
              isSpicy: data.isSpicy ? true : false,
              // availability: [],
            },
          })
        : // EDIT/UPDATE ITEM API
          await sdk.updateItem({
            input: {
              _id: editItemId || "",
              name: {
                value: data.name,
              },
              desc: {
                value: data.desc,
              },
              image: previewUrl,
              price: {
                value: parsedPrice,
              },
              status: statusSub,
              applySalesTax: data.applySalesTax ? true : false,
              popularItem: data.popularItem ? true : false,
              upSellItem: data.upSellItem ? true : false,
              hasNuts: data.hasNuts ? true : false,
              isGlutenFree: data.isGlutenFree ? true : false,
              isHalal: data.isHalal ? true : false,
              isVegan: data.isVegan ? true : false,
              isSpicy: data.isSpicy ? true : false,
              // availability: [],
            },
          });
      setBtnLoading(false);
      setisAddItemModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisEditItem(false);
      setEditItemId(null);
      setToastData({
        type: "success",
        message: "Item Added Successfully",
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "csv-data");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
        { method: "POST", body: formData }
      ).then((r) => r.json());

      const cloudinaryUrl = response?.secure_url;
      setPreviewUrl(cloudinaryUrl);
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {!isEditItem ? "ADD ITEM" : "EDIT ITEM"}
          </h2>
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="mb-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              id="name"
              className="input input-primary"
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm text-start">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="mb-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Description
            </label>
            <textarea
              {...register("desc", { required: "Description is required" })}
              id="desc"
              className="input input-primary"
              placeholder="Enter item description"
            />
            {errors.desc && (
              <p className="text-red-500 text-sm text-start">
                {errors.desc.message}
              </p>
            )}
          </div>
          <div className="mb-1">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              id="price"
              className="input input-primary"
              placeholder="Enter item price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm text-start">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="block mb-2 text-lg font-medium text-left text-gray-700">
              Photo
            </label>
            <div className="mb-4">
              <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
                <input
                  type="file"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {isUploading ? (
                    <div className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto animate-spin"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : (
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
                        Upload an image
                      </p>
                    </div>
                  )}
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mb-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Status
            </label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="status"
                  options={statusOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select status"
                />
              )}
            />

            {errors.status && (
              <p className="text-red-500 text-sm text-start">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="mb-1 flex-col space-y-4">
            <CustomSwitchCard
              label="sales Tax"
              title="Apply Sales Tax"
              caption="This item is subject to sales tax."
              switchChecked={watch("applySalesTax")}
              onSwitchChange={() =>
                setValue("applySalesTax", !watch("applySalesTax"))
              }
            />
            <CustomSwitchCard
              label="is it a popular item"
              title="Popular Item"
              caption="Mark this item as popular."
              switchChecked={watch("popularItem")}
              onSwitchChange={() =>
                setValue("popularItem", !watch("popularItem"))
              }
            />
            <CustomSwitchCard
              label="do you want to up-sell it"
              title="Up-sell Item"
              caption="Suggest this item to customers."
              switchChecked={watch("upSellItem")}
              onSwitchChange={() =>
                setValue("upSellItem", !watch("upSellItem"))
              }
            />
            <CustomSwitchCard
              label="does this item contain nuts"
              title="Contains Nuts"
              caption="This item contains nuts."
              switchChecked={watch("hasNuts")}
              onSwitchChange={() => setValue("hasNuts", !watch("hasNuts"))}
            />
            <CustomSwitchCard
              label="is the item gluten-free"
              title="Gluten-Free"
              caption="This item is gluten-free."
              switchChecked={watch("isGlutenFree")}
              onSwitchChange={() =>
                setValue("isGlutenFree", !watch("isGlutenFree"))
              }
            />
            <CustomSwitchCard
              label="is it halal"
              title="Halal"
              caption="This item is halal."
              switchChecked={watch("isHalal")}
              onSwitchChange={() => setValue("isHalal", !watch("isHalal"))}
            />
            <CustomSwitchCard
              label="is it vegan"
              title="Vegan"
              caption="This item is vegan."
              switchChecked={watch("isVegan")}
              onSwitchChange={() => setValue("isVegan", !watch("isVegan"))}
            />
            <CustomSwitchCard
              label="is it spicy"
              title="Spicy"
              caption="This item is spicy."
              switchChecked={watch("isSpicy")}
              onSwitchChange={() => setValue("isSpicy", !watch("isSpicy"))}
            />
          </div>
          <CButton
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Item
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default AddItemForm;
