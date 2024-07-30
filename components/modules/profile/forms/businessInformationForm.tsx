import React, { useEffect, useState } from "react";
import Select from "react-select";
import { sdk } from "@/utils/graphqlClient";
import useOnboardingStore from "@/store/onboarding";
import {
  BusinessTypeEnum,
  EstimatedRevenueEnum,
  StaffCountEnum,
} from "@/generated/graphql";

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

const BusinessInformationForm: React.FC = () => {
  const [businessType, setBusinessType] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [employees, setEmployees] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");

  const {
    setbusinessType,
    setbusinessName,
    setemployeeSize,
    setestimatedRevenue,
  } = useOnboardingStore();

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await sdk.getBusinessDetails();
        const { businessType, businessName, employeeSize, estimatedRevenue } =
          response.getBusinessDetails;

        setBusinessType(businessType || "");
        setBusinessName(businessName || "");
        setEmployees(employeeSize || "");
        setRevenue(estimatedRevenue || "");

        setbusinessType(businessType || "");
        setbusinessName(businessName || "");
        setemployeeSize(employeeSize || "");
        setestimatedRevenue(estimatedRevenue || "");
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };

    fetchBusinessDetails();
  }, [setbusinessType, setbusinessName, setemployeeSize, setestimatedRevenue]);

  const BusinessType = Object.values(BusinessTypeEnum).map((val) => ({
    value: val.toString(),
    label: formatBusinessTypeEnum(val),
  }));

  const employeSize = Object.values(StaffCountEnum).map((val) => ({
    value: val.toString(),
    label: formatStaffCountEnum(val),
  }));

  const revenueOptions = Object.values(EstimatedRevenueEnum).map((val) => ({
    value: val.toString(),
    label: formatEstimatedRevenueEnum(val),
  }));

  return (
    <div className="z-10 w-full flex flex-col items-start space-y-5 text-center">
      <div className="space-y-4 md:space-y-3 w-full max-w-2xl">
        <div className="col-span-2">
          <label
            htmlFor="businessType"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What kind of business are you
          </label>
          <Select
            id="businessType"
            options={BusinessType}
            value={BusinessType.find((option) => option.value === businessType)}
            onChange={(option) => {
              setBusinessType(option?.value || "");
              setbusinessType(option?.value || "");
            }}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select business type"
          />
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
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              setbusinessName(e.target.value);
            }}
            id="businessName"
            className="input input-primary"
            placeholder="Enter your business name"
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="employees"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What is your staff count
          </label>
          <Select
            id="employees"
            options={employeSize}
            value={employeSize.find((option) => option.value === employees)}
            onChange={(option) => {
              setEmployees(option?.value || "");
              setemployeeSize(option?.value || "");
            }}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select number of staffs"
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="revenue"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            What is your estimated annual revenue
          </label>
          <Select
            id="revenue"
            options={revenueOptions}
            value={revenueOptions.find((option) => option.value === revenue)}
            onChange={(option) => {
              setRevenue(option?.value || "");
              setestimatedRevenue(option?.value || "");
            }}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select estimated Revenue"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInformationForm;
