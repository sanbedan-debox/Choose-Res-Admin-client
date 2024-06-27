import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";

const UserVerification = () => {
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
          Tax Information
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            EIN
          </label>
          <input
            type="text"
            {...register("ein", {
              required: "EIN is required",
            })}
            className=" input input-primary"
            placeholder="EIN"
          />
          {errors.ein && (
            <p className="text-red-500 text-sm">{errors.ein.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            SSN
          </label>
          <input
            type="text"
            {...register("ssn", {
              required: "SSN is required",
            })}
            className=" input input-primary"
            placeholder="SSN"
          />
          {errors.ssn && (
            <p className="text-red-500 text-sm">{errors.ssn.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Tax Rate
          </label>
          <input
            type="text"
            {...register("taxRate", {
              required: "Tax Rate is required",
            })}
            className=" input input-primary"
            placeholder="Tax Rate"
          />
          {errors.taxRate && (
            <p className="text-red-500 text-sm">{errors.taxRate.message}</p>
          )}
        </div>

        <button
          onClick={() => router.push("/onboarding/location")}
          type="submit"
          className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
};

export default UserVerification;
