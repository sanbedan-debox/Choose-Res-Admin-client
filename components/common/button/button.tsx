import React from "react";
import { ButtonType } from "./interface";

interface ReusableButtonProps {
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
const buttonStyles = {
  [ButtonType.Confirm]:
    "flex items-center justify-center h-10 px-4 py-2 m-1 text-green-600 hover:text-green text-sm border border-green-600 rounded-full transition-colors duration-300 transform hover:bg-green-100 focus:outline-none focus:bg-green-100 md:w-auto w-32",
  [ButtonType.Icon]:
    "flex items-center justify-center h-10 px-3 py-2 m-1 text-white text-sm transition-colors duration-300 transform bg-primary rounded-full hover:bg-white hover:text-primary focus:outline-none focus:bg-blue-400 md:w-auto w-10",
  [ButtonType.Outlined]:
    "flex items-center justify-center h-10 px-4 py-2 m-1 text-white text-sm border border-primary rounded-full transition-colors duration-300 transform hover:bg-primary hover:text-white focus:outline-none focus:bg-blue-400 md:w-auto w-32",
  [ButtonType.Primary]:
    "flex items-center justify-center  h-10 px-4 py-2 m-1 text-white text-sm transition-colors duration-300 transform bg-primary rounded-full hover:bg-white hover:text-primary focus:outline-none focus:bg-blue-400 md:w-auto w-32",
  [ButtonType.Text]:
    "text-primary text-sm transition-colors duration-300 transform hover:text-blue-600 focus:outline-none",
  [ButtonType.Warning]:
    "flex items-center justify-center h-10 px-4 py-2 m-1 text-red-500 hover:text-red text-sm border border-red-500 rounded-full transition-colors duration-300 transform hover:bg-red-100 focus:outline-none focus:bg-red-100 md:w-auto w-32",
};

const CButton: React.FC<ReusableButtonProps> = ({
  type,
  onClick,
  disabled,
  className,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonStyles[type]} ${className}`}
    >
      {children}
    </button>
  );
};

export default CButton;
