import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { timeZoneOptions } from "./interface/interface";

const RestaurantAvailibility = () => {
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
          Restaurant Availibility Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Timezone
          </label>
          {/* <Select
            {...register("timezone", {
              required: "Timezone is required",
            })}
            id="timezone"
            options={timeZoneOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Timezone"
          /> */}
          {errors.timezone && (
            <p className="text-red-500 text-sm text-start">
              {/* {errors.timezone.message} */}
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
            onClick={() =>
              router.push("/onboarding-restaurant/restaurant-info")
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

export default RestaurantAvailibility;
