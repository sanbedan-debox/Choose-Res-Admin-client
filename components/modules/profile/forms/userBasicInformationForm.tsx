import useProfileStore from "@/store/profile";
import useRestaurantsStore from "@/store/restaurant";
import { hideEIN, hideEmail, hidePhoneNumber } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useBasicProfileStore } from "../store/basicProfileInformation";

const UserBasicInformationForm: React.FC = () => {
  const { firstName, lastName, email, phone } = useBasicProfileStore();
  const { selectedRestaurant } = useRestaurantsStore();
  const { ein } = useProfileStore();
  const [einState, setEinState] = useState(ein);

  useEffect(() => {
    setEinState(ein);
  }, [ein]);

  return (
    <div className="bg-white p-6 rounded-lg space-y-6 w-full border border-gray-300">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">First Name</h2>
            <p className="text-sm text-gray-600">
              {firstName ? firstName : "No first name"}
            </p>
          </div>
          <button className="text-primary hover:underline">Edit</button>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Last Name</h2>
            <p className="text-sm text-gray-600">
              {lastName ? lastName : "No last name"}
            </p>
          </div>
          <button className="text-primary hover:underline">Edit</button>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Email</h2>
            <p className="text-sm text-gray-600">{hideEmail(email)}</p>
          </div>
          <div className="flex space-x-4">
            {/* <button className="text-primary hover:underline">Verify</button> */}
            <button className="text-primary hover:underline">
              Add Secondary Email
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Phone</h2>
            <p className="text-sm text-gray-600">
              {phone ? hidePhoneNumber(phone) : "No phone number"}
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
            <p>{hideEIN(ein)}</p>
          </div>
        </div>
        {/* <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-md font-semibold text-gray-900">Password</h2>
            <p className="text-sm text-gray-600">Last changed 23 Jun 2024</p>
          </div>
          <button className="text-primary hover:underline">Update</button>
        </div> */}
      </div>
    </div>
  );
};

export default UserBasicInformationForm;
