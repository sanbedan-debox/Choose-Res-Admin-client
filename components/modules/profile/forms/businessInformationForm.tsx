import React, { useState } from "react";
import Select from "react-select";
import { FaEdit } from "react-icons/fa";
import { sdk } from "@/utils/graphqlClient";
import useProfileStore from "@/store/profile";
import {
  BusinessTypeEnum,
  EstimatedRevenueEnum,
  StaffCountEnum,
} from "@/generated/graphql";
import ReusableModal from "@/components/common/modal/modal";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { MdOutlineEdit } from "react-icons/md";

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
  const {
    businessType,
    businessName,
    employeeSize,
    estimatedRevenue,
    setbusinessType,
    setbusinessName,
    setemployeeSize,
    setestimatedRevenue,
  } = useProfileStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsFormChanged(false);
  };

  const handleFormChange = () => {
    setIsFormChanged(true);
  };

  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const updateBusinessInfo = async () => {
    if (!isFormChanged) {
      handleCloseModal();
      return;
    }
    try {
      setBtnLoading(true);
      const businessTypeValue = businessType as BusinessTypeEnum;
      const estimatedRevenueValue = estimatedRevenue as EstimatedRevenueEnum;
      const employeeSizeValue = employeeSize as StaffCountEnum;
      const response = await sdk.updateUserProfile({
        input: {
          businessName: businessName,

          businessType: businessTypeValue,
          estimatedRevenue: estimatedRevenueValue,

          employeeSize: employeeSizeValue,
        },
      });
      setToastData({
        message: "Business details updated successfully!",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-start space-y-5">
      <div className="bg-white p-4 rounded-xl space-y-4 md:space-y-3 w-full ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Business Information</h2>
          <MdOutlineEdit
            className="text-primary text-xl cursor-pointer"
            onClick={handleOpenModal}
          />
        </div>
        <div className="text-left text-sm text-gray-600">
          <p>
            <strong>Business Type:</strong>{" "}
            {formatBusinessTypeEnum(businessType as BusinessTypeEnum)}
          </p>
          <p>
            <strong>Business Name:</strong> {businessName}
          </p>
          <p>
            <strong>Staff Count:</strong>{" "}
            {formatStaffCountEnum(employeeSize as StaffCountEnum)}
          </p>
          <p>
            <strong>Estimated Revenue:</strong>{" "}
            {formatEstimatedRevenueEnum(
              estimatedRevenue as EstimatedRevenueEnum
            )}
          </p>
        </div>
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit Business Information"
        width="md"
      >
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
              value={BusinessType.find(
                (option) => option.value === businessType
              )}
              onChange={(option) => {
                setbusinessType(option?.value || "");
                handleFormChange();
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
                setbusinessName(e.target.value);
                handleFormChange();
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
              value={employeSize.find(
                (option) => option.value === employeeSize
              )}
              onChange={(option) => {
                setemployeeSize(option?.value || "");
                handleFormChange();
              }}
              className="mt-1  text-sm rounded-lg w-full focus:outline-none text-left"
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
              value={revenueOptions.find(
                (option) => option.value === estimatedRevenue
              )}
              onChange={(option) => {
                setestimatedRevenue(option?.value || "");
                handleFormChange();
              }}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select estimated Revenue"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <CButton
            type="submit"
            loading={btnLoading}
            // disabled={!isFormChanged}
            className="w-full"
            variant={ButtonType.Primary}
            onClick={() => {
              updateBusinessInfo();
            }}
          >
            Update
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default BusinessInformationForm;
