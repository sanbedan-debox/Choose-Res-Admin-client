import React from "react";

const CustomSwitch = ({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <div
      className={`${className} switch ${
        checked ? "switch-primary checked" : ""
      }`}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      title={label}
      aria-label={label}
    >
      <div className="switch-handle"></div>
    </div>
  );
};

export default CustomSwitch;
