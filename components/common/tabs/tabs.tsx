import React, { useState } from "react";

interface TabItem {
  label: string;
  component: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex space-x-2 border-b">
        {items.map((item, index) => (
          <button
            key={index}
            className={`pb-2 px-2 text-sm ${
              index === activeTab
                ? "border-b-2 border-blue-500 text-primary"
                : "text-black"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{items[activeTab].component}</div>
    </div>
  );
};

export default Tabs;
