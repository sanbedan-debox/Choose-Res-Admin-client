import React from "react";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";

interface CustomSwitchCardProps {
  title: string;
  caption: string;
  switchChecked: boolean;
  label: string;
  onSwitchChange: () => void;
}

const CustomSwitchCard: React.FC<CustomSwitchCardProps> = ({
  title,
  caption,
  switchChecked,
  onSwitchChange,
  label = "",
}) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white">
      <div>
        <h3 className=" font-semibold text-start text-md">{title}</h3>
        <p className="text-gray-600 text-sm">{caption}</p>
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
