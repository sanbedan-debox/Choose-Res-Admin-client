import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { revenueOptions, stateOptions } from "./interface/interface";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";

interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  location: string;
}

const UserLocation = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    location,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setState,
    setPostcode,
    setLocation,
  } = useOnboardingStore();

  const { userId } = useAuthStore();

  useEffect(() => {
    setValue("addressLine1", addressLine1);
    setValue("addressLine2", addressLine2);
    setValue("city", city);
    setValue("state", state);
    setValue("postcode", postcode);
    setValue("location", location);
  }, [setValue, addressLine1, addressLine2, city, state, postcode, location]);

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await sdk.UpdateUserOnboarding({
        input: {
          address: {
            addressLine1: {
              value: data.addressLine1,
            },
            addressLine2: {
              value: data.addressLine2,
            },
            city: {
              value: data.city,
            },
            state: { value: data.state },
            postcode: {
              value: data.postcode,
            },
            coordinate: {
              coordinates: [22, 22],
            },
          },
        },
      });
      setToastData({
        message: "Location details updated successfully!",
        type: "success",
      });
      router.push("/onboarding/user/user-verification");
    } catch (error) {
      setToastData({
        message: "Failed to update location details.",
        type: "error",
      });
    }
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
          Location Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: "Address Line 1 is required",
            })}
            className="input input-primary"
            placeholder="Address Line 1"
            onChange={(e) => setAddressLine1(e.target.value)}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            {...register("addressLine2", {
              required: "Address Line 2 is required",
            })}
            className="input input-primary"
            placeholder="Address Line 2"
            onChange={(e) => setAddressLine2(e.target.value)}
          />
          {errors.addressLine2 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine2.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="col-span-3 flex-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              City
            </label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="input input-primary"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (
              <p className="text-red-500 text-sm text-start">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              State
            </label>
            <Select
              {...register("state", { required: "State is required" })}
              id="state"
              options={stateOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select State"
              value={stateOptions.find((option) => option.value === state)}
              onChange={(option) => {
                setValue("state", option?.value || "");
                setState(option?.value || "");
              }}
            />
            {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Zipcode
          </label>
          <input
            type="text"
            {...register("postcode", {
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: "Invalid zipcode format",
              },
              required: "Zipcode is required",
            })}
            className="input input-primary"
            placeholder="Zipcode"
            onChange={(e) => setPostcode(e.target.value)}
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Search Location
          </label>
          <Select
            id="location"
            {...register("location", { required: "Location is required" })}
            options={revenueOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Search location"
            value={revenueOptions.find((option) => option.value === location)}
            onChange={(option) => {
              setValue("location", option?.value || "");
              setLocation(option?.value || "");
            }}
          />
          {errors.location && (
            <p className="text-red-500 text-sm text-start">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <button
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

export default UserLocation;
