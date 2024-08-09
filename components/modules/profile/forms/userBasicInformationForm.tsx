import React from "react";
import { hideEmail, hidePhoneNumber } from "@/utils/utilFUncs";
import { FaExclamationTriangle } from "react-icons/fa";
import { useBasicProfileStore } from "../store/basicProfileInformation";
import useRestaurantsStore from "@/store/restaurant";

const UserBasicInformationForm: React.FC = () => {
  const { firstName, lastName, email, phone } = useBasicProfileStore();
  const { selectedRestaurant } = useRestaurantsStore();
  return (
    <div className="bg-white p-6 rounded-lg space-y-6 w-full border border-gray-300">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">First Name</h2>
            <p className="text-sm text-gray-600">
              {firstName ? firstName : "No first name"}
            </p>
          </div>
          <button className="text-primary hover:underline">Edit</button>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Last Name</h2>
            <p className="text-sm text-gray-600">
              {lastName ? lastName : "No last name"}
            </p>
          </div>
          <button className="text-primary hover:underline">Edit</button>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
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
            <h2 className="text-lg font-semibold text-gray-900">Phone</h2>
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
        {/* <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Password</h2>
            <p className="text-sm text-gray-600">Last changed 23 Jun 2024</p>
          </div>
          <button className="text-primary hover:underline">Update</button>
        </div> */}
      </div>

      <div className="space-y-4">
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900">
            Personal POS Passcode for {selectedRestaurant}
          </h3>
          <p className="text-sm text-gray-600">
            Your personal POS passcode is used to log in and clock in on the
            {selectedRestaurant} point of sale. Please don’t share this passcode
            with anyone.
          </p>
          <button className="mt-2 text-primary hover:underline">
            Add passcode
          </button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900">
            Two-step verification
          </h3>
          <p className="text-sm text-gray-600">
            An extra layer to boost your Choose account security. A verification
            code will be required in addition to your password each time you
            sign in.
          </p>
          <button className="mt-2 text-primary hover:underline">Enable</button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-red-400">
            Sign out everywhere
          </h3>
          <p className="text-sm text-gray-600">
            If you lost a device or left logged in to a public computer, you can
            sign out everywhere except your current browser.
          </p>
          <button className="mt-2 text-red-400 hover:underline">
            Sign out everywhere
          </button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900">Security</h3>
          <p className="text-sm text-gray-600">
            Choose can contact you if there’s unusual activity in your account,
            help you access and recover your account and send you other
            transactional messages about your account.
          </p>
          <button className="mt-2 text-primary hover:underline">
            Add phone number
          </button>
          <button className="mt-2 ml-4 text-primary hover:underline">
            Add email address
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBasicInformationForm;
