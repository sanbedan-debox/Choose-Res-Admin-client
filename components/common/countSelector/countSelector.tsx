import React, { useState } from "react";
import CustomSwitch from "../customSwitch/customSwitch";

interface CountSelectorProps {
  title: string;
  initialValue: number;
  onCountChange: (count: number) => void;
  showLimit?: boolean;
}

const CountSelector: React.FC<CountSelectorProps> = ({
  title,
  initialValue,
  onCountChange,
  showLimit = false,
}) => {
  const [count, setCount] = useState(initialValue);
  const [isLimited, setIsLimited] = useState(false);

  const handleCountChange = (increment: number) => {
    const newCount = count + increment;
    setCount(newCount);
    onCountChange(newCount);
  };

  const handleLimitToggle = () => {
    setIsLimited(!isLimited);
  };

  return (
    <div className="">
      <div className="flex bg-primary bg-opacity-5 items-center py-3 rounded-md px-3 justify-between">
        <span className="text-left font-medium text-gray-700">{title}</span>
        <div className="flex space-x-3">
          {showLimit && (
            <div className="flex align-middle space-x-3">
              <span>Is Limited?</span>
              <CustomSwitch
                checked={isLimited}
                onChange={handleLimitToggle}
                label="Is Limited?"
                className="mr-2"
              />
            </div>
          )}
          <button
            type="button"
            className={`px-2 py-1 text-sm rounded ${
              !isLimited ? "text-white bg-primary" : "bg-gray-200 text-white"
            }`}
            onClick={() => handleCountChange(-1)}
            disabled={count <= 0 || isLimited}
          >
            -
          </button>
          <span className={`${!isLimited ? "text-black " : " text-gray-400"}`}>
            {count}
          </span>

          <button
            type="button"
            className={`px-2 py-1 text-sm rounded ${
              !isLimited ? "text-white bg-primary" : "bg-gray-200 text-white"
            }`}
            onClick={() => handleCountChange(1)}
            disabled={isLimited}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountSelector;
