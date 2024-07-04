import BlockerLayout from "@/components/layouts/BlockersLayout";
import Image from "next/image";
import LogoImage from "../../../assets/logo/logoDark.png";
import IllustrationImage from "../../../assets/svg/pending.svg";
import React from "react";
import { BsShopWindow } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = () => {
  return (
    <div className="text-black ">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Verification Pending
      </h1>
      <p className="text-gray-600 whitespace-pre-line">
        {`Your account verification is pending. Please check your email for further instructions.\nTill we Verify your account please proceed by adding restaurants`}
      </p>
      <p className="text-gray-600 mb-8"></p>

      <button className="btn p-0  hover:scale-105 transition-all  mb-12">
        <div className="flex items-center space-x-2">
          <p className="text-lg text-primary ">Add restaurants </p>
          <div className="  text-primary ">
            <FaArrowRight />
          </div>
        </div>
      </button>
    </div>
  );
};

PaymentPending.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default PaymentPending;
