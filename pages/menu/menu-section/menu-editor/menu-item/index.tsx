import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useState } from "react";
import {
  availibilityOptions,
  menuTypeOptions,
  visibilityOptions,
} from "../interface";

const MenuItem = () => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    router.push("/onboarding/integrations");
  };

  const mondayChecked = watch("mondayRegularHours");
  const tuesdayChecked = watch("tuesdayRegularHours");
  const wednesdayChecked = watch("wednesdayRegularHours");
  const thursdayChecked = watch("thursdayRegularHours");
  const fridayChecked = watch("fridayRegularHours");
  const saturdayChecked = watch("saturdayRegularHours");
  const sundayChecked = watch("sundayRegularHours");
  return (
    <motion.div
      className=" bg-white min-h-screen min-w-full flex items-center justify-center"
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
      <div className="space-y-4 md:space-y-3 w-full max-w-2xl text-black">
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Name
          </label>
          <input
            // onChange={(e) => setNewItemName(e.target.value)}
            type="text"
            // {...register("postcode", {
            //   required: "Postcode is required",
            // })}
            className="input input-primary"
            placeholder="Enter Item Name"
          />
          {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
        </div>
        <div className="col-span-2 flex-1">
          <label
            htmlFor="state"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Menu Type
          </label>
          <Select
            //   {...register("state", {
            //     required: "State is required",
            //   })}
            id="menutype"
            options={menuTypeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select menu Type"
          />
          {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Tax Rate
          </label>
          <input
            type="text"
            // {...register("postcode", {
            //   required: "Postcode is required",
            // })}
            className="input input-primary"
            placeholder="Enter tax rate"
          />
          {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
        </div>
        <div className="col-span-2 flex-1">
          <label
            htmlFor="state"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Visibility
          </label>
          <Select
            //   {...register("state", {
            //     required: "State is required",
            //   })}
            id="state"
            options={visibilityOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Visibility"
          />
          {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
        </div>
        <div className="col-span-2 flex-1">
          <label
            htmlFor="state"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Availibility
          </label>
          <Select
            //   {...register("state", {
            //     required: "State is required",
            //   })}
            id="state"
            options={availibilityOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Avaiilibility"
          />
          {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="btn btn-primary"
            // onClick={addItem}
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
