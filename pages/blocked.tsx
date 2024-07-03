import React from "react";

const BlockedAccountMessage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Account Blocked
        </h1>
        <p className="text-gray-600 mb-6">
          Your account has been blocked. Please contact support for further
          assistance.
        </p>
        <div className="bg-red-100 p-4 rounded-lg text-primary">
          <p>Contact Number: +1 (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccountMessage;
