import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { StatusEnum } from "@/generated/graphql";

interface IFormInput {
  name: string;
  desc: string;
  image: string;
  price: number;
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

  const onSubmit = async (data: IFormInput) => {
    try {
      await sdk.addItem({
        input: {
          name: {
            value: data.name,
          },
          desc: {
            value: data.desc,
          },
          image: data.image,
          price: {
            value: data.price,
          },
          status: data.status,
          applySalesTax: data.applySalesTax,
          popularItem: data.popularItem,
          upSellItem: data.upSellItem,
        },
      });

      console.log("Item added successfully:", data);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error(errorMessage);
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
      <div className="flex flex-col items-center space-y-5 text-center">
        <h1 className="font-display max-w-2xl font-semibold text-2xl">
          Add a new item
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new item to your menu.
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
            placeholder="Enter item name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="desc"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
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

        <div className="col-span-2">
          <label
            htmlFor="image"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Image
          </label>
          <input
            type="text"
            {...register("image", { required: "Image URL is required" })}
            id="image"
            className="input input-primary"
            placeholder="Enter image URL"
          />
          {errors.image && (
            <p className="text-red-500 text-sm text-start">
              {errors.image.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2 flex items-center space-x-3">
          <label
            htmlFor="applySalesTax"
            className="text-sm font-medium text-left text-gray-700"
          >
            Apply Sales Tax
          </label>
          <input
            type="checkbox"
            {...register("applySalesTax")}
            id="applySalesTax"
            className="input input-primary"
          />
        </div>

        <div className="col-span-2 flex items-center space-x-3">
          <label
            htmlFor="popularItem"
            className="text-sm font-medium text-left text-gray-700"
          >
            Popular Item
          </label>
          <input
            type="checkbox"
            {...register("popularItem")}
            id="popularItem"
            className="input input-primary"
          />
        </div>

        <div className="col-span-2 flex items-center space-x-3">
          <label
            htmlFor="upSellItem"
            className="text-sm font-medium text-left text-gray-700"
          >
            Up-sell Item
          </label>
          <input
            type="checkbox"
            {...register("upSellItem")}
            id="upSellItem"
            className="input input-primary"
          />
        </div>

        <CButton variant={ButtonType.Primary} type="submit" className="w-full">
          Add Item
        </CButton>
      </form>
    </motion.div>
  );
};

export default AddItemForm;
