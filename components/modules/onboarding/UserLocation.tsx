import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";

const UserLocation = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
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
            className=" input input-primary"
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
            Address Line 2
          </label>
          <input
            type="text"
            {...register("addressLine2")}
            className=" input input-primary"
            placeholder="Address Line 2"
          />
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
            className=" input input-primary"
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
            className=" input input-primary"
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
            className=" input input-primary"
            placeholder="Postcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm">{errors.postcode.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            {...register("latitude")}
            className=" input input-primary"
            placeholder="Latitude"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            {...register("longitude")}
            className=" input input-primary"
            placeholder="Longitude"
          />
        </div>

        <button
          onClick={() => router.push("/onboarding/user-verification")}
          type="submit"
          className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
};

export default UserLocation;
