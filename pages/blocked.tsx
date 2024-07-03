import React from "react";
import LogoImage from "../assets/logo/logoDark.png";
import IllustrationImage from "../assets/svg/blocked.svg";
import Image from "next/image";

const BlockedAccountMessage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg min-w-full min-h-screen text-center">
      <Image src={LogoImage} alt="Logo" className="w-36 h-10 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Blocked</h1>
      <p className="text-gray-600 mb-6">
        Your account has been blocked due to suspicious activity detected on
        your account. Please contact our support team for further assistance and
        to resolve this issue promptly.
      </p>
      <div className="mb-4 flex justify-center">
        <Image
          src={IllustrationImage}
          alt="Illustration"
          className="w-72  rounded-lg shadow-lg"
        />
      </div>
      <div className="bg-red-100 p-4 rounded-lg text-primary">
        <p>Contact Number: +1 (123) 456-7890</p>
        <p>Email: support@choose.com</p>
        <p>Operating Hours: Monday to Friday, 9 AM to 5 PM (EST)</p>
        <p>Please have your account details ready when contacting support.</p>
      </div>
    </div>
  );
};

export default BlockedAccountMessage;
