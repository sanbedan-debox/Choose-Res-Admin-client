import React from "react";

const MenuManagement: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        Menu builder <span className="text-blue-500">NEW</span>
      </h3>
      <p>
        Our newest tool for creating and managing menus with improved workflows
        and streamlined settings.
      </p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Edit menus</h3>
      <p>
        Original menu editing pages that contain all advanced menu features.
      </p>
      <a href="#" className="text-blue-500 mt-4 block">
        Compare menu tools
      </a>
    </div>
  );
};

export default MenuManagement;
