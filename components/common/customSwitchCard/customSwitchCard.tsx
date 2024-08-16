import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import React from "react";

interface CustomSwitchCardProps {
  title: string;
  caption: string;
  switchChecked: boolean;
  label: string;
  onSwitchChange: () => void;
  classNameDiv?: string;
}

const CustomSwitchCard: React.FC<CustomSwitchCardProps> = ({
  title,
  caption,
  switchChecked,
  onSwitchChange,
  label = "",
  classNameDiv = "",
}) => {
  return (
    <div
      className={`flex justify-between items-center p-4 border rounded-md shadow-sm bg-white ${classNameDiv}`}
    >
      <div className="flex flex-col justify-center items-start">
        <h3 className=" font-medium text-start text-md">{title}</h3>
        <p className="text-gray-600 text-start text-xs mt-1">{caption}</p>
      </div>
      <div>
        <CustomSwitch
          label={label}
          checked={switchChecked}
          onChange={onSwitchChange}
        />
      </div>
    </div>
  );
};

export default CustomSwitchCard;
