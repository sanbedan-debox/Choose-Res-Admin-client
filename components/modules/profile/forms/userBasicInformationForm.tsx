import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useProfileStore from "@/store/profile";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { useBasicProfileStore } from "../store/basicProfileInformation";

const UserBasicInformationForm: React.FC = () => {
  const { firstName, lastName, email, phone } = useBasicProfileStore();
  const { ein } = useProfileStore();
  const [einState, setEinState] = useState(ein);

  useEffect(() => {
    setEinState(ein);
  }, [ein]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState<"firstName" | "lastName">(
    "firstName"
  );
  const [formState, setFormState] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    setFormState({
      firstName,
      lastName,
    });
  }, [firstName, lastName]);

  const handleInputChange = (
    field: "firstName" | "lastName",
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  const { setToastData } = useGlobalStore();
  const { setFirstName } = useAuthStore();

  const updateUserDetails = async () => {
    try {
      const response = await sdk.updateUserDetails({
        input: {
          firstName: formState.firstName,
          lastName: formState.lastName,
        },
      });

      if (response && response.updateUserDetails) {
        // Assuming setBasicProfileStore updates the local store
        useBasicProfileStore.setState({
          firstName: formState.firstName,
          lastName: formState.lastName,
        });
        setFirstName(formState.firstName);

        setIsModalOpen(false);
        // Optionally show a success message
        setToastData({
          message: "User details updated successfully!",
          type: "success",
        });
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg space-y-6 w-full ">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2 w-full">
          <h2 className="text-xl font-semibold">User Information</h2>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">First Name</h2>
            <p className="text-sm text-gray-600">
              {firstName ? firstName : "No first name"}
            </p>
          </div>
          <MdOutlineEdit
            className="text-primary text-2xl cursor-pointer"
            onClick={() => {
              setEditField("firstName");
              setIsModalOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Last Name</h2>
            <p className="text-sm text-gray-600">
              {lastName ? lastName : "No last name"}
            </p>
          </div>
          <MdOutlineEdit
            className="text-primary text-2xl cursor-pointer"
            onClick={() => {
              setEditField("lastName");
              setIsModalOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Email</h2>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-primary hover:underline">
              Add Secondary Email
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Phone</h2>
            <p className="text-sm text-gray-600">
              {phone ? phone : "No phone number"}
            </p>
          </div>
          <div className="flex space-x-4">
            <span className="flex items-center space-x-1 text-red-400">
              <FaExclamationTriangle />
              <span>Verification needed</span>
            </span>
            <button className="text-primary hover:underline">Verify</button>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-900">EIN</h2>
          </div>
          <div className="text-left text-sm text-gray-600">
            <p>{ein}</p>
          </div>
        </div>
      </div>

      <FullPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${editField === "firstName" ? "First Name" : "Last Name"}`}
        actionButtonLabel="Update"
        onActionButtonClick={updateUserDetails}
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              {editField === "firstName" ? "First Name" : "Last Name"}
            </label>
            <input
              type="text"
              value={formState[editField]}
              onChange={(e) => handleInputChange(editField, e.target.value)}
              className="input input-primary"
              placeholder={`Enter your ${
                editField === "firstName" ? "First Name" : "Last Name"
              }`}
            />
          </div>
          <div className="flex justify-end">
            <CButton
              type="submit"
              className="w-full"
              variant={ButtonType.Primary}
              onClick={updateUserDetails}
            >
              Update
            </CButton>
          </div>
        </div>
      </FullPageModal>
    </div>
  );
};

export default UserBasicInformationForm;
