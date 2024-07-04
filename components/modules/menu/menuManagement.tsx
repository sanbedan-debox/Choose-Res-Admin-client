import React from "react";
import { FaArrowRight } from "react-icons/fa";

const MenuManagement: React.FC = () => {
  const menuItems = [
    {
      title: "Menu builder",
      caption:
        "Our newest tool for creating and managing menus with improved workflows and streamlined settings.",
    },
    {
      title: "Edit menus",
      caption:
        "Original menu editing pages that contain all advanced menu features.",
    },
    {
      title: "Menu builder",
      caption:
        "Our newest tool for creating and managing menus with improved workflows and streamlined settings.",
    },
    {
      title: "Edit menus",
      caption:
        "Original menu editing pages that contain all advanced menu features.",
    },
  ];

  return (
    <div className="p-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 mb-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
        >
          <div>
            <h3 className="text-md font-semibold mb-1">{item.title}</h3>
            <p className="text-sm">{item.caption}</p>
          </div>
          <FaArrowRight className="text-gray-500 group-hover:text-primary" />
        </div>
      ))}
      <a href="#" className="text-blue-500 mt-4 block">
        Compare menu tools
      </a>
    </div>
  );
};

export default MenuManagement;
