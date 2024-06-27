import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import Image from "next/image";
import logo1 from "../../../assets/logo/logoWhite.png";
import { useRouter } from "next/router";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";

const Locations = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const locationTypeOptions = [
    { value: "physical", label: "Physical location" },
    { value: "virtual", label: "Virtual location" },
  ];

  const onSubmit = (data: any) => {
    // handle form submission
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
        <h1 className="font-display max-w-md text-2xl font-semibold transition-colors ">
          Location Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location business name
          </label>
          <input
            type="text"
            {...register("businessName", {
              required: "Business name is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location nickname
          </label>
          <input
            type="text"
            {...register("locationNickname", {
              required: "Location nickname is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Location nickname"
          />
          {errors.locationNickname && (
            <p className="text-red-500 text-sm">
              {errors.locationNickname.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Business description
          </label>
          <textarea
            {...register("businessDescription", {
              required: "Business description is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Business description"
            rows="4"
          />
          {errors.businessDescription && (
            <p className="text-red-500 text-sm">
              {errors.businessDescription.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location type
          </label>
          <Select
            {...register("locationType", {
              required: "Location type is required",
            })}
            options={locationTypeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none"
            classNamePrefix="react-select"
            placeholder="Select location type"
          />
          {errors.locationType && (
            <p className="text-red-500 text-sm">
              {errors.locationType.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: "Address Line 1 is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Address Line 1"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            City
          </label>
          <input
            type="text"
            {...register("city", {
              required: "City is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            State
          </label>
          <input
            type="text"
            {...register("state", {
              required: "State is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="State"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Postcode
          </label>
          <input
            type="text"
            {...register("postcode", {
              required: "Postcode is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Postcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm">{errors.postcode.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Phone
          </label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Phone"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Website
          </label>
          <input
            type="text"
            {...register("website")}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Website"
          />
        </div>

        <div className="col-span-2">
          <button
            onClick={() => router.push("/onboarding/location")}
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

export default Locations;
