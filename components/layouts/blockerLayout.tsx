import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import logo1 from "../../assets/logo/logoDark.png";

type Props = {
  children: ReactNode;
};

const BlockerLayouout = ({ children }: Props) => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 py-2 border-b ">
        <div className="flex-1 flex justify-center">
          <Image src={logo1} alt="Logo" width={140} height={140} />
        </div>
      </div>

      <div className="flex-grow flex items-start justify-start p-10">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
      <div className="flex items-center justify-between px-10 py-8 border-t ">
        <div className="flex-1 flex flex-col justify-start space-y-1">
          <p className="text-gray-500 whitespace-pre-line">
            If you have any queries please email us at
            <Link
              className="text-primary"
              href="mailto:communications@choosepos.com"
            >
              {" "}
              communications@choosepos.com
            </Link>
          </p>
          <p className="text-gray-500 whitespace-pre-line text-sm space-x-2">
            <Link className="text-primary underline" href="/terms-conditions">
              {" "}
              Terms and Conditions{" "}
            </Link>
            <Link className="text-primary underline" href="/privacy-policy">
              {" "}
              Privacy Policies{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockerLayouout;
