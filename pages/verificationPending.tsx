import React from "react";

const VerificationPendingMessage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Verification Pending
        </h1>
        <p className="text-gray-600 mb-6">
          Your account verification is pending. Please check your email for
          further instructions.
        </p>
        <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800">
          <p>For support, contact: +1 (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingMessage;
