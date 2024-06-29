import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";

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

  // const stateOptions = [
  //   { value: "NY", label: "New York" },
  //   { value: "CA", label: "California" },
  //   { value: "TX", label: "Texas" },
  //   // Add more states as needed
  // ];

  const onSubmit = (data: IFormInput) => {
    // handle form submission
    console.log(data);
    router.push("/onboarding/location");
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
            What kind of business are you ?
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
            <p className="text-red-500 text-sm">
              {errors.businessType.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="businessName"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What is your business name ?
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
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* <div className="col-span-2">
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Preferred phone number
          </label>
          <input
            type="text"
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            id="phoneNumber"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="ein"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Employer Identification Number (Optional)
          </label>
          <input
            type="text"
            {...register("ein")}
            id="ein"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter your EIN"
          />
        </div> */}

        <div className="col-span-2">
          <label
            htmlFor="employees"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            How many employees ?
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
            <p className="text-red-500 text-sm">{errors.employees.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="revenue"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Estimated annual revenue ?
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
            <p className="text-red-500 text-sm">{errors.revenue.message}</p>
          )}
        </div>

        {/* <div className="col-span-2">
          <label
            htmlFor="mobileBusiness"
            className="flex items-center mb-2 text-sm font-medium text-left text-gray-700"
          >
            <input
              type="checkbox"
              {...register("mobileBusiness")}
              id="mobileBusiness"
              className="mr-2"
            />
            I have a mobile business
          </label>
        </div>

        <div className="col-span-2">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            {...register("address", {
              required: "Address is required",
            })}
            id="address"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="apartment"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Apartment, suite, unit, etc. (Optional)
          </label>
          <input
            type="text"
            {...register("apartment")}
            id="apartment"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter apartment, suite, etc."
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            {...register("city", {
              required: "City is required",
            })}
            id="city"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter your city"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="col-span-2">
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
            className="mt-1 text-sm rounded-lg w-full focus:outline-none"
            classNamePrefix="react-select"
            placeholder="Select state"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="zip"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            ZIP code
          </label>
          <input
            type="text"
            {...register("zip", {
              required: "ZIP code is required",
            })}
            id="zip"
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Enter your ZIP code"
          />
          {errors.zip && (
            <p className="text-red-500 text-sm">{errors.zip.message}</p>
          )}
        </div> */}

        <div className="col-span-2">
          <button
            onClick={() => router.push("/onboarding/user-location")}
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
