import useGlobalStore from "@/store/global";
import React from "react";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BiFoodMenu } from "react-icons/bi";
import { FiMonitor } from "react-icons/fi";
import { MdOutlinePointOfSale } from "react-icons/md";
import useAuthStore from "@/store/auth";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";

interface Step {
  icon: JSX.Element;
  name: string;
  stepsCompleted: number;
  totalSteps: number;
}

const SetupGuide: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const { firstName } = useAuthStore();

  const { setisShowSetupPanel } = useGlobalStore();
  const handleShowSetup = () => {
    setisShowSetupPanel(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} ${
    months[currentDate.getMonth()]
  }`;

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Welcome</span>
          <span className="text-lg font-bold">{firstName}</span>
          <span className="text-sm">|</span>
          <span className="text-sm font-semibold">Date</span>
          <span className="text-sm font-bold">{formattedDate}</span>
        </div>
        <CButton
          variant={ButtonType.Primary}
          onClick={handleShowSetup}
          className="btn btn-primary "
        >
          I'll finish this later
        </CButton>
      </div>
      <h2 className="text-xl font-semibold mb-4">
        Hello! Let’s get you set up.
      </h2>
      <div className="relative w-full bg-gray-200 h-2 mb-4">
        <div
          className="absolute bg-blue-600 h-full"
          style={{ width: "7%" }}
        ></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex cursor-pointer hover:bg-primary hover:bg-opacity-10 items-center bg-primary bg-opacity-5 p-4 rounded-md space-x-2"
          >
            {step.icon}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{step.name}</span>
              <span className="text-xs text-gray-500">{`${step.stepsCompleted} of ${step.totalSteps} steps completed`}</span>
            </div>
          </div>
        ))}
        <div className="flex cursor-pointer hover:bg-primary hover:bg-opacity-10 items-center bg-primary bg-opacity-5 p-4 rounded-md space-x-2">
          <span className="text-sm font-semibold">+ View all steps</span>
        </div>
      </div>
    </div>
  );
};
const DynamicSetupGuide: React.FC = () => {
  // Example data for setup steps
  const setupSteps: Step[] = [
    {
      icon: <AiOutlineUser size={24} />,
      name: "User Details",
      stepsCompleted: 1,
      totalSteps: 4,
    },
    {
      icon: <BiFoodMenu size={24} />,
      name: "Create/Edit Menus",
      stepsCompleted: 0,
      totalSteps: 1,
    },
    {
      icon: <FiMonitor size={24} />,
      name: "Set up Choose Account",
      stepsCompleted: 2,
      totalSteps: 5,
    },
    {
      icon: <AiOutlineSetting size={24} />,
      name: "Account",
      stepsCompleted: 3,
      totalSteps: 4,
    },
    {
      icon: <MdOutlinePointOfSale size={24} />,
      name: "Choose Point of Sale",
      stepsCompleted: 0,
      totalSteps: 1,
    },
  ];

  return <SetupGuide steps={setupSteps || []} />; // Ensure steps is always defined
};

export default DynamicSetupGuide;
