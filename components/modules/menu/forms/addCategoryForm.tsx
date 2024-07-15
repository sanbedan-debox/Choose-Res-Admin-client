import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import useMenuStore from "@/store/menu";
import Select from "react-select";
import { MenuTypeEnum } from "@/generated/graphql";

interface IFormInput {
  name: string;
  description: string;
  items: string[];
}

const AddCategoryForm = () => {
  const menuTypeOptions: any[] = [
    { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
    { value: MenuTypeEnum.DineIn, label: "Dine In" },
    { value: MenuTypeEnum.Catering, label: "Catering" },
  ];
  const [btnLoading, setBtnLoading] = useState(false);
  const [itemsOption, setItemsOption] = useState<any[]>([]);
  const { setToastData } = useGlobalStore();
  const { fetchMenuDatas, setfetchMenuDatas, setisAddCategoryModalOpen } =
    useMenuStore();
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);

      await sdk.addCategory({
        input: {
          name: {
            value: data.name,
          },
          desc: {
            value: data.description,
          },
        },
      });
      setToastData({
        type: "success",
        message: "Category Added Successfully",
      });
      setBtnLoading(false);
      setisAddCategoryModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const items = await sdk.getItemsForCategoryDropdown();
        if (items && items.getItems) {
          const formattedItemsList = items.getItems.map((item) => ({
            value: item._id,
            label: item?.name?.value,
          }));
          setItemsOption(formattedItemsList);
        }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };
    fetch();
  }, []);

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-5 text-center">
        <h1 className="font-display max-w-2xl font-semibold text-2xl">
          Add a new category
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new category.
        </p>
      </div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
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
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            id="description"
            className="input input-primary"
            placeholder="Enter category description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm text-start">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Type
          </label>
          <Controller
            name="items"
            control={control}
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="type"
                isMulti
                // options={itemsOption}
                options={itemsOption}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select menu type"
              />
            )}
          />
        </div>

        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          Add Category
        </CButton>
      </form>
    </motion.div>
  );
};

export default AddCategoryForm;
