import { useEffect } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import useOnboardingStore from "@/store/onboarding";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import {
  BusinessTypeEnum,
  EstimatedRevenueEnum,
  StaffCountEnum,
} from "@/generated/graphql";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
interface IFormInput {
  businessType: string;
  businessName: string;
  employees: string;
  revenue: string;
  // establishedAt: any;
  // dob: string;
}

const formatBusinessTypeEnum = (value: BusinessTypeEnum) => {
  switch (value) {
    case BusinessTypeEnum.Lp:
      return "LP";
    case BusinessTypeEnum.Llp:
      return "LLP";
    case BusinessTypeEnum.Llc:
      return "LLC";
    case BusinessTypeEnum.Corporation:
      return "Corporation";
    case BusinessTypeEnum.SoleProprietor:
      return "Sole Proprietor";
    default:
      return "";
  }
};

const formatStaffCountEnum = (value: StaffCountEnum) => {
  switch (value) {
    case StaffCountEnum.From0To10:
      return "0 to 10";
    case StaffCountEnum.From11to25:
      return "11 to 25";
    case StaffCountEnum.From26to40:
      return "26 to 40";
    case StaffCountEnum.Above40:
      return "Above 41";
    default:
      return "";
  }
};

const formatEstimatedRevenueEnum = (value: EstimatedRevenueEnum) => {
  switch (value) {
    case EstimatedRevenueEnum.From0to50K:
      return "$0 to $50,000";
    case EstimatedRevenueEnum.From50Kto200K:
      return "$50,000 to $200,000";
    case EstimatedRevenueEnum.From200Kto500K:
      return "$200,000 to $500,000";
    case EstimatedRevenueEnum.Above1M:
      return "Above $1,000,000";
    default:
      return "";
  }
};

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
    // establishedAt,
    // setestablishedAt,
    dob,
    setdob,
  } = useOnboardingStore();

  useEffect(() => {
    setValue("businessType", businessType);
    setValue("businessName", businessName);
    setValue("employees", employeeSize);
    setValue("revenue", estimatedRevenue);
  }, [businessType, businessName, employeeSize, estimatedRevenue, setValue]);

  const BusinessType = Object.values(BusinessTypeEnum).map((val) => ({
    value: val.toString(),
    label: formatBusinessTypeEnum(val),
  }));

  const employeSize = Object.values(StaffCountEnum).map((val) => ({
    value: val.toString(),
    label: formatStaffCountEnum(val),
  }));

  // const employeSize = Object.values(StaffCountEnum).map((val)=>({
  //   value: val.toString(),
  //   label: val.toString(),
  // }))

  const revenueOptions = Object.values(EstimatedRevenueEnum).map((val) => ({
    value: val.toString(),
    label: formatEstimatedRevenueEnum(val),
  }));

  const onSubmit = async (data: IFormInput) => {
    try {
      const businessTypeValue = data.businessType as BusinessTypeEnum;
      const estimatedRevenueValue = data.revenue as EstimatedRevenueEnum;
      const employeeSizeValue = data.employees as StaffCountEnum;
      const response = await sdk.UpdateUserOnboarding({
        input: {
          businessName: data.businessName,

          businessType: businessTypeValue,
          estimatedRevenue: estimatedRevenueValue,

          employeeSize: employeeSizeValue,

          // establishedAt: establishedAt?.toISOString(),
          // dob: dob?.toISOString(),
        },
      });
      setToastData({
        message: "Business details updated successfully!",
        type: "success",
      });
      router.push("/onboarding/user/user-location");
    } catch (error: any) {
      setToastData({
        message: `{Failed to update business details.:${error.message}`,
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
          <Controller
            name="businessType"
            control={control}
            rules={{ required: "Business type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="state"
                options={BusinessType}
                value={BusinessType.find(
                  (option) => option.value === businessType
                )}
                onChange={(option) => {
                  setValue("businessType", option?.value || "");
                  setbusinessType(option?.value || "");
                }}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select business type"
              />
            )}
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
            What is your business legal name
          </label>
          <input
            type="text"
            {...register("businessName", {
              validate: (value) =>
                !!value.trim() || "Business name is required",
              required: "Business name is required",
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
            What is your staff count
          </label>

          <Controller
            name="employees"
            control={control}
            rules={{ required: "employees is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="state"
                options={employeSize}
                value={employeSize.find(
                  (option) => option.value === employeeSize
                )}
                onChange={(option) => {
                  setValue("employees", option?.value || "");
                  setemployeeSize(option?.value || "");
                }}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select number of staffs"
              />
            )}
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
            What is your estimated annual revenue
          </label>
          <Controller
            name="revenue"
            control={control}
            rules={{ required: "revenue is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="state"
                options={revenueOptions}
                value={revenueOptions.find(
                  (option) => option.value === estimatedRevenue
                )}
                onChange={(option) => {
                  setValue("revenue", option?.value || "");
                  setestimatedRevenue(option?.value || "");
                }}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select estimated Revenue"
              />
            )}
          />
          {errors.revenue && (
            <p className="text-red-500 text-sm text-start">
              {errors.revenue.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <CButton
            variant={ButtonType.Primary}
            type="submit"
            className="mt-8 w-full"
          >
            Continue
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default UserInfo;
