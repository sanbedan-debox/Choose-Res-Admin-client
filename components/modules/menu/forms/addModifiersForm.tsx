import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import useModStore from "@/store/modifiers";

interface IFormInput {
  name: string;
  optional: boolean;
  maxSelections: number;
  desc: string;
  minSelections: number;
  price: number;
}

const AddModifierForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>();

  const { fetchMenuDatas, setfetchMenuDatas, setisAddModifierModalOpen } =
    useMenuOptionsStore();
  const { editModId, isEditMod, setEditModId, setisEditMod } = useModStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  useEffect(() => {
    const fetchItemData = async () => {
      if (editModId) {
        try {
          const response = await sdk.getModifier({ id: editModId });
          const item = response.getModifier;
          setValue("name", item.name.value);
          // setValue("desc", item.);
          setValue("price", item.price.value);
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
  }, [editModId, setValue, setToastData]);

  const onSubmit = async (data: IFormInput) => {
    const parsedPrice = parseFloat(data.price.toString());

    try {
      setBtnLoading(true);
      !isEditMod
        ? // ADD ITEM API
          await sdk.addModifier({
            input: {
              name: {
                value: data.name,
              },
              price: {
                value: parsedPrice,
              },
              preSelect: data.optional,
            },
          })
        : // EDIT/UPDATE ITEM API
          await sdk.updateModifier({
            input: {
              _id: editModId || "",
              name: {
                value: data.name,
              },
              price: {
                value: parsedPrice,
              },
              // availability: [],
            },
          });
      setisAddModifierModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisEditMod(false);
      setEditModId(null);
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
    } finally {
      setBtnLoading(false);
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

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
            {!isEditMod ? "ADD Modifier" : "EDIT Modifier"}
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
              style={{
                appearance: "textfield",
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              onWheel={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "-" || e.key === "+") {
                  e.preventDefault();
                }
              }}
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
                  // onChange={handleLogoChange}
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
              htmlFor="optional"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              optional
            </label>

            <CustomSwitchCard
              label="optional"
              title="optional"
              caption="If its checked ,you can use this modifer will become optional"
              switchChecked={watch("optional")}
              onSwitchChange={() => setValue("optional", !watch("optional"))}
            />

            {errors.optional && (
              <p className="text-red-500 text-sm text-start">
                {errors.optional.message}
              </p>
            )}
          </div>

          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {!isEditMod ? "Save Modifier" : "Edit Modifier"}
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default AddModifierForm;
