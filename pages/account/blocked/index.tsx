import BlockerLayout from "@/components/layouts/BlockersLayout";
import Image from "next/image";
import LogoImage from "../../../assets/logo/logoDark.png";
import IllustrationImage from "../../../assets/svg/pending.svg";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = () => {
  return (
    <div className="text-black ">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Account Blocked</h1>
      <p className="text-gray-600 mb-6">
        Your account payment is pending. Please check your email for further
        instructions.
      </p>
      {/* <div className="mb-4 flex justify-center">
        <Image
          src={IllustrationImage}
          alt="Illustration"
          className="w-20  rounded-lg shadow-lg"
        />
      </div> */}
      <div className="bg-primary p-4 rounded-lg text-white">
        <p>Contact Number: +1 (123) 456-7890</p>
        <p>Email: support@choose.com</p>
        <p>Operating Hours: Monday to Friday, 9 AM to 5 PM (EST)</p>
        <p>
          Please check your email for instructions on completing your account
          verification.
        </p>
      </div>
    </div>
  );
};

PaymentPending.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default PaymentPending;
