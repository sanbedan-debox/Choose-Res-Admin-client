import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { locationTypeOptions, timeZoneOptions } from "./interface/interface";
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

  const stateOptions = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];
  const mondayChecked = watch("mondayRegularHours");
  const tuesdayChecked = watch("tuesdayRegularHours");
  const wednesdayChecked = watch("wednesdayRegularHours");
  const thursdayChecked = watch("thursdayRegularHours");
  const fridayChecked = watch("fridayRegularHours");
  const saturdayChecked = watch("saturdayRegularHours");
  const sundayChecked = watch("sundayRegularHours");
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
            Business description
          </label>
          <textarea
            {...register("businessDescription", {
              required: "Business description is required",
            })}
            className="input input-primary"
            placeholder="Business description"
            rows={4}
          />
          {errors.businessDescription && (
            <p className="text-red-500 text-sm text-start">
              {errors.businessDescription?.message?.toString() ?? ""}
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
            className="input input-primary"
            placeholder="Address Line 1"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine1?.message?.toString()}
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
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine2?.message?.toString() ?? ""}
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
              {...register("city", {
                required: "City is required",
              })}
              className="input input-primary"
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-500 text-sm text-start">
                {errors.city?.message?.toString() ?? ""}
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
              {...register("state", {
                required: "State is required",
              })}
              id="state"
              options={stateOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select State"
            />
            {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message?.toString() ?? ""}
              </p>
            )}
          </div>
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
            className="input input-primary"
            placeholder="Postcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message?.toString() ?? ""}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Select Location
          </label>
          <Select
            {...register("locationType", {
              required: "Location type is required",
            })}
            id="location"
            options={locationTypeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Location "
          />
          {errors.locationType && (
            <p className="text-red-500 text-sm text-start">
              {errors.locationType.message?.toString() ?? ""}
            </p>
          )}
        </div>
        {/* <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Branding
          </label>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Logo
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
        </div> */}

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Timezone
          </label>
          <Select
            {...register("timezone", {
              required: "Timezone is required",
            })}
            id="timezone"
            options={timeZoneOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Timezone"
          />
          {errors.timezone && (
            <p className="text-red-500 text-sm text-start">
              {errors.timezone.message?.toString() ?? ""}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Regular hours
          </label>
          <div className="space-y-2">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} className="flex flex-col">
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-start text-gray-700">
                    {day}
                  </label>
                </div>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="checkbox"
                    {...register(`hours.${day}.enabled`)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    {...register(`hours.${day}.from`, { disabled: true })}
                    className={`input input-primary ${
                      watch(`hours.${day}.enabled`) ? "" : "opacity-50"
                    }`}
                    placeholder="From"
                  />
                  <input
                    type="text"
                    {...register(`hours.${day}.to`, { disabled: true })}
                    className={`input input-primary ${
                      watch(`hours.${day}.enabled`) ? "" : "opacity-50"
                    }`}
                    placeholder="To"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <button
            onClick={async () => {
              await sdk.ChangeUserToActive();
              router.replace("/dashboard");
            }}
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
