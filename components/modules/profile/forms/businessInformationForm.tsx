import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import {
  BusinessTypeEnum,
  EstimatedRevenueEnum,
  StaffCountEnum,
} from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useProfileStore from "@/store/profile";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Select from "react-select";

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
    id,
    setestimatedRevenue,
  } = useProfileStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

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
      await sdk.updateBusinessDetails({
        input: {
          _id: id,
          estimatedRevenue: estimatedRevenueValue,
          employeeSize: employeeSizeValue,
        },
      });
      setToastData({
        message: "Business details updated successfully!",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (error) {
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
    <div className="w-full flex flex-col items-start bg-white">
      <div className="bg-white p-4 rounded-xl space-y-4 w-full ">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl w-full">
          <h2 className="text-xl font-semibold">Business Information</h2>
          <MdOutlineEdit
            className="text-primary text-2xl cursor-pointer"
            onClick={handleOpenModal}
          />
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-3">
            <p>
              <strong>Business Name:</strong> {businessName}
            </p>
          </div>
          <div className="flex justify-between items-center border-b py-3">
            <p>
              <strong>Business Type:</strong>{" "}
              {formatBusinessTypeEnum(businessType as BusinessTypeEnum)}
            </p>
          </div>
          <div className="flex justify-between items-center border-b py-3">
            <p>
              <strong>Staff Count:</strong>{" "}
              {formatStaffCountEnum(employeeSize as StaffCountEnum)}
            </p>
          </div>
          <div className="flex justify-between items-center py-3">
            <p>
              <strong>Estimated Revenue:</strong>{" "}
              {formatEstimatedRevenueEnum(
                estimatedRevenue as EstimatedRevenueEnum
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Modal for Editing */}
      {isModalOpen && (
        <FullPageModal
          actionButtonLabel=""
          onActionButtonClick={() => {}}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Edit Business Information"
        >
          <div className="space-y-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="col-span-2">
              <label
                htmlFor="employees"
                className="block mb-2 text-sm font-medium text-left text-gray-700"
              >
                What is your staff count
              </label>
              <Select
                classNames={{
                  option: (state) =>
                    `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent ${
                      state.isSelected ? "!bg-primary text-white" : ""
                    }`,
                }}
                id="employees"
                options={Object.values(StaffCountEnum).map((val) => ({
                  value: val.toString(),
                  label: formatStaffCountEnum(val),
                }))}
                value={Object.values(StaffCountEnum)
                  .map((val) => ({
                    value: val.toString(),
                    label: formatStaffCountEnum(val),
                  }))
                  .find((option) => option.value === employeeSize)}
                onChange={(option) => {
                  setemployeeSize(option?.value || "");
                  handleFormChange();
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
                classNames={{
                  option: (state) =>
                    `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent ${
                      state.isSelected ? "!bg-primary text-white" : ""
                    }`,
                }}
                id="revenue"
                options={Object.values(EstimatedRevenueEnum).map((val) => ({
                  value: val.toString(),
                  label: formatEstimatedRevenueEnum(val),
                }))}
                value={Object.values(EstimatedRevenueEnum)
                  .map((val) => ({
                    value: val.toString(),
                    label: formatEstimatedRevenueEnum(val),
                  }))
                  .find((option) => option.value === estimatedRevenue)}
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
              className="w-full"
              variant={ButtonType.Primary}
              onClick={updateBusinessInfo}
            >
              Update
            </CButton>
          </div>
        </FullPageModal>
      )}
    </div>
  );
};

export default BusinessInformationForm;
