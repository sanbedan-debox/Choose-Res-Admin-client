import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";

interface IFormInput {
  businessType: string;
  businessName: string;
  phoneNumber: string;
  ein?: string;
  employees: string;
  revenue: string;
  mobileBusiness: boolean;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

const UserInfo = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const roleOptions = [
    { value: "LLC", label: "Limited Liability Company (LLC)" },
    { value: "Corporation", label: "Corporation" },
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
  ];

  const employeeOptions = [
    { value: "1", label: "Just me" },
    { value: "2-10", label: "2-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-200", label: "51-200" },
    { value: "200+", label: "200+" },
  ];

  const revenueOptions = [
    { value: "0-50000", label: "$0 - $50,000" },
    { value: "50001-200000", label: "$50,001 - $200,000" },
    { value: "200001-500000", label: "$200,001 - $500,000" },
    { value: "500001-1000000", label: "$500,001 - $1,000,000" },
    { value: "1000001+", label: "$1,000,001+" },
  ];

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await sdk.UpdateUserOnboarding({
        input: {
          _id: "user-id", // Replace with actual user ID
          businessDetails: {
            businessName: data.businessName,
            businessType: data.businessType,
            dob: "", // Add appropriate dob
            estimatedRevenue: data.revenue,
            employeeSize: data.employees,
            establishedAt: "", // Add appropriate established date
          },
          businessAddress: {
            address: data.address,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            zip: data.zip,
          },
          businessAccountDetails: {
            // Add appropriate business account details
          },
        },
      });
      setToastData({
        message: "Business details updated successfully!",
        type: "success",
      });
      router.push("/onboarding/location");
    } catch (error) {
      setToastData({
        message: "Failed to update business details.",
        type: "error",
      });
    }
  };

  return (
    <motion.div
      className="z-10 w-full max-w-md flex flex-col items-center space-y-5 text-center"
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
        <h1 className="font-display max-w-2xl font-semibold transition-colors text-2xl">
          Tell us about your business
        </h1>
        <p className="max-w-md text-accent-foreground/80 transition-colors text-sm">
          Every business is unique. We want to hear about yours. If you
          registered your business with the IRS, make sure the information you
          submit matches what is on your IRS documents.
        </p>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="businessType"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What kind of business are you
          </label>
          <Select
            {...register("businessType", {
              required: "Business type is required",
            })}
            id="businessType"
            options={roleOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select business type"
          />
          {errors.businessType && (
            <p className="text-red-500 text-sm text-start">
              {errors.businessType.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="businessName"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What is your business name
          </label>
          <input
            type="text"
            {...register("businessName", {
              required: "Business name is required",
            })}
            id="businessName"
            className="input input-primary"
            placeholder="Enter your business name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm text-start">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="employees"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            How many employees
          </label>
          <Select
            {...register("employees", {
              required: "Number of employees is required",
            })}
            id="employees"
            options={employeeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select number of employees"
          />
          {errors.employees && (
            <p className="text-red-500 text-sm text-start">
              {errors.employees.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="revenue"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Estimated annual revenue
          </label>
          <Select
            {...register("revenue", {
              required: "Estimated annual revenue is required",
            })}
            id="revenue"
            options={revenueOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select estimated annual revenue"
          />
          {errors.revenue && (
            <p className="text-red-500 text-sm text-start">
              {errors.revenue.message}
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

export default UserInfo;
