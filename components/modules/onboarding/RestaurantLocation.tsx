import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { RestaurantCategory, RestaurantType } from "./interface/interface";
import { sdk } from "@/utils/graphqlClient";

const RestaurantLocation = () => {
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

  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-md items-center space-y-5 text-center"
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
        <h1 className="font-display max-w-md text-2xl font-semibold transition-colors">
          Restaurant Location Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Restaurant Name
          </label>
          <input
            {...register("resname", {
              required: "Business description is required",
            })}
            className="input input-primary"
            placeholder="Restaurant Name"
            type="text"
          />
          {errors.resname && (
            <p className="text-red-500 text-sm text-start">
              {errors.resname.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-lg font-medium text-left text-gray-700">
            Branding
          </label>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Logo(Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                {...register("logo")}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <svg
                    xmlns="http:www.w3.org/2000/svg"
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
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop a logo or{" "}
                  <span className="text-blue-600">browse file</span>
                </p>
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Restaurant Website
          </label>
          <input
            {...register("resname", {
              required: "Business description is required",
            })}
            className="input input-primary"
            placeholder="Restaurant Website"
            type="text"
          />
          {errors.resname && (
            <p className="text-red-500 text-sm text-start">
              {errors.resname.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Restaurant Type
          </label>
          <Select
            {...register("type", {
              required: "Type is required",
            })}
            id="state"
            options={RestaurantType}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Restaurant Type"
          />
          {errors.state && (
            <p className="text-red-500 text-sm text-start">
              {errors.state.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Restaurant Category
          </label>
          <Select
            {...register("category", {
              required: "Restaurant category is required",
            })}
            id="state"
            options={RestaurantCategory}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Restaurant Category"
          />
          {errors.state && (
            <p className="text-red-500 text-sm text-start">
              {errors.state.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Dine-In Capacity
          </label>
          <input
            {...register("resname", {
              required: "Business description is required",
            })}
            className="input input-primary"
            placeholder="Dine-In Capacity"
            type="text"
          />
          {errors.dineincap && (
            <p className="text-red-500 text-sm text-start">
              {errors.dineincap.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <button
            onClick={() =>
              router.push("/onboarding-restaurant/restaurant-availibility")
            }
            type="submit"
            className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantLocation;
