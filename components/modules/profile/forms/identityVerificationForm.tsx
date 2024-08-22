import useRestaurantsStore from "@/store/restaurant";
import React from "react";

const IdentityVerificationForm: React.FC = () => {
  const { selectedRestaurant } = useRestaurantsStore();

  return (
    <div className="bg-white p-4 rounded-lg space-y-4 md:space-y-3 w-full">
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
          <button className="mt-2 text-primary hover:underline text-md">
            Add passcode
          </button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900">
            Two-step verification
          </h3>
          <p className="text-md text-gray-600">
            An extra layer to boost your Choose account security. A verification
            code will be required in addition to your password each time you
            sign in.
          </p>
          <button className="mt-2 text-primary hover:underline text-md">
            Enable
          </button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-red-400">
            Sign out everywhere
          </h3>
          <p className="text-md text-gray-600">
            If you lost a device or left logged in to a public computer, you can
            sign out everywhere except your current browser.
          </p>
          <button className="mt-2 text-red-400 hover:underline text-md">
            Sign out everywhere
          </button>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900">Security</h3>
          <p className="text-md text-gray-600">
            Choose can contact you if there’s unusual activity in your account,
            help you access and recover your account and send you other
            transactional messages about your account.
          </p>
          <button className="mt-2 text-primary hover:underline text-md">
            Add phone number
          </button>
          <button className="mt-2 ml-4 text-primary hover:underline text-md">
            Add email address
          </button>
        </div>
      </div>
      {/* Transfer Business Section */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-md font-semibold">Transfer business</h2>
        <p className="text-md text-gray-600">
          This transfers the business to a new person within your organization.
          To process payments, Square needs to verify their identity. Don’t
          worry, you’ll still be able to process payments during the transfer
          process.
        </p>
        <p className="text-md text-red-400 font-semibold">
          NOTE: This feature is not supported when selling a business.
        </p>
        <button className="w-full text-start text-primary hover:underline text-md">
          Transfer business
        </button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-md font-semibold">Deactivate your business</h2>
        <p className="text-md text-gray-600">
          Deactivating your business means that you will be unable to receive or
          recover any of your payment history or account information.
        </p>
        <button className="w-full text-start text-red-400 hover:underline text-md">
          Deactivate your business
        </button>
      </div>
      <div className="bg-white  rounded-xl space-y-4 w-full">
        <div className="bg-white p-4 rounded-lg border text-left space-y-2">
          <h3 className="text-sm font-semibold">Order Hardware</h3>
          <p className="text-md text-gray-600">
            Need a new POS system? Order now to enhance your business
            operations.
          </p>
          <button className="w-full text-start text-primary hover:underline text-md">
            Order Hardware
          </button>
        </div>
        {/* Request Servicing */}
        <div className="bg-white border text-left p-4 rounded-lg space-y-2">
          <h3 className="text-sm font-semibold">Request Servicing</h3>
          <p className="text-md text-gray-600">
            Is your equipment malfunctioning? Request a service call today.
          </p>
          <button className="w-full text-start text-primary hover:underline text-md">
            Request Servicing
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;
