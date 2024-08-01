import React from "react";
import { ButtonType } from "./interface";
import { FaSpinner } from "react-icons/fa";

interface ReusableButtonProps {
  type?: "button" | "submit" | "reset";
  variant: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const buttonStyles = {
  [ButtonType.Confirm]: "btn btn-confirmation",
  [ButtonType.Icon]:
    "flex items-center justify-center h-10 px-3 py-2 m-1 text-white text-sm transition-colors duration-300 transform bg-primary rounded-full hover:bg-white hover:text-primary focus:outline-none focus:bg-blue-400 md:w-auto w-10",
  [ButtonType.Outlined]: "btn btn-outlined !py-2.5",
  [ButtonType.Primary]: "btn btn-primary !py-2.5",
  [ButtonType.Text]:
    "text-primary text-sm transition-colors duration-300 transform hover:text-blue-600 focus:outline-none",
  [ButtonType.Warning]: "btn btn-warning",
};

const CButton: React.FC<ReusableButtonProps> = ({
  variant,
  onClick,
  disabled,
  loading,
  className,
  children,
  type,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading} // Disable button when loading
      className={`${buttonStyles[variant]} ${className} ${
        loading ? "flex items-center justify-center" : "" // Center content if loading
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      {loading ? (
        <FaSpinner className="animate-spin h-5 w-5 text-white" /> // Adjust spinner size and color
      ) : (
        children // Display children when not loading
      )}
    </button>
  );
};

export default CButton;
