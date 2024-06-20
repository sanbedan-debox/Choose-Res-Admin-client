import React from "react";

const BulkManagement: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        Menu manager <span className="text-blue-500">NEW</span>
      </h3>
      <p>Bulk edit and schedule price changes and item visibility.</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Advanced properties</h3>
      <p>View and edit all your menus on one screen.</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Price editor</h3>
      <p>
        Edit menu group and item prices using the original price editor tool.
      </p>
    </div>
  );
};

export default BulkManagement;
