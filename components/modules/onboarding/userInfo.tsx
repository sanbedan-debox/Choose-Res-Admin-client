import { useEffect } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import useOnboardingStore from "@/store/onboarding";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";
import { BusinessTypeEnum } from "@/generated/graphql";

interface IFormInput {
  businessType: string;
  businessName: string;
  employees: string;
  revenue: string;
}

const UserInfo = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();

  const {
    businessType,
    setbusinessType,
    businessName,
    setbusinessName,
    employeeSize,
    setemployeeSize,
    estimatedRevenue,
    setestimatedRevenue,
  } = useOnboardingStore();

  const { userId } = useAuthStore();

  useEffect(() => {
    setValue("businessType", businessType);
    setValue("businessName", businessName);
    setValue("employees", employeeSize);
    setValue("revenue", estimatedRevenue);
  }, [businessType, businessName, employeeSize, estimatedRevenue, setValue]);

  const BusinessType = [
    { value: "Llc", label: "LLC" },
    { value: "PrivateLimited", label: "PrivateLimited" },
  ];

  const employeSize = [
    { value: "1", label: "1" },
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
      const businessTypeValue =
        BusinessTypeEnum[data.businessType as keyof typeof BusinessTypeEnum];
      const response = await sdk.UpdateUserOnboarding({
        input: {
          _id: userId,
          businessName: data.businessName,
          businessType: businessTypeValue,
          estimatedRevenue: {
            value: data.revenue,
          },
          employeeSize: {
            value: data.employees,
          },
        },
      });
      setToastData({
        message: "Business details updated successfully!",
        type: "success",
      });
      router.push("/onboarding/user/user-location");
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
            options={BusinessType}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select business type"
            value={BusinessType.find((option) => option.value === businessType)}
            onChange={(option) => {
              setValue("businessType", option?.value || "");
              setbusinessType(option?.value || "");
            }}
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
              validate: (value) =>
                !!value.trim() || "Business name is required",
            })}
            id="businessName"
            className="input input-primary"
            placeholder="Enter your business name"
            onChange={(e) => setbusinessName(e.target.value)}
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
            options={employeSize}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select number of employees"
            value={employeSize.find((option) => option.value === employeeSize)}
            onChange={(option) => {
              setValue("employees", option?.value || "");
              setemployeeSize(option?.value || "");
            }}
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
            options={revenueOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select estimated annual revenue"
            value={revenueOptions.find(
              (option) => option.value === estimatedRevenue
            )}
            onChange={(option) => {
              setValue("revenue", option?.value || "");
              setestimatedRevenue(option?.value || "");
            }}
          />
          {errors.revenue && (
            <p className="text-red-500 text-sm text-start">
              {errors.revenue.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <button type="submit" className="mt-8 w-full btn btn-primary">
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserInfo;
