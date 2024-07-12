import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { StatusEnum } from "@/generated/graphql";
import useMenuStore from "@/store/menu";
import useGlobalStore from "@/store/global";
import { title } from "process";

interface IFormInput {
  name: string;
  desc: string;
  image: string;
  price: string;
  status: StatusEnum;
  applySalesTax: boolean;
  popularItem: boolean;
  upSellItem: boolean;
}

const statusOptions = [
  { value: StatusEnum.Active, label: "Active" },
  { value: StatusEnum.Inactive, label: "Inactive" },
];

const AddItemForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();

  const { fetchMenuDatas, setfetchMenuDatas, setisAddItemModalOpen } =
    useMenuStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
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
            value: parseFloat(data.price),
          },
          status: data.status,
          applySalesTax: data.applySalesTax,
          popularItem: data.popularItem,
          upSellItem: data.upSellItem,
        },
      });
      setBtnLoading(false);
      setisAddItemModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
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
        className="max-w-4xl mx-auto p-6 bg-white rounded-md "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit/Add Item</h2>
          <CButton
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Item
          </CButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    onChange={(option) => {
                      setValue("status", StatusEnum.Active);
                    }}
                  />
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm text-start">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block mb-2 text-lg font-medium text-left text-gray-700">
                Options
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("applySalesTax")}
                    id="applySalesTax"
                    className="input input-primary"
                  />
                  <label className="ml-2 text-gray-700 whitespace-nowrap">
                    Apply Sales Tax
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("popularItem")}
                    id="popularItem"
                    className="input input-primary"
                  />
                  <label className="ml-2 text-gray-700 whitespace-nowrap">
                    Popular Name
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("upSellItem")}
                    id="upSellItem"
                    className="input input-primary"
                  />
                  <label className="ml-2 text-gray-700 whitespace-nowrap ">
                    Up-sell Item
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddItemForm;
