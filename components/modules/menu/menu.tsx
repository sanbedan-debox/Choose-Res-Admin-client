// components/Menu.tsx
import CBTable from "@/components/common/table/table";
import React from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Menu: React.FC = () => {
  const menuItems = [
    { name: "Burger", price: "$5.99", id: 1134, active: true },
    { name: "Pizza", price: "$8.99", id: 131, active: false },
    { name: "Pasta", price: "$7.99", id: 1123, active: false },
    { name: "Salad", price: "$4.99", id: 13123, active: true },
  ];

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Price", dataKey: "price" },
  ];

  const renderActions = (rowData: { id: number }) => (
    <div className="flex space-x-3">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => console.log("Delete", rowData.id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => console.log("Edit", rowData.id)}
      />
      <FaShieldAlt
        className="text-green-500 cursor-pointer"
        onClick={() => console.log("Change Password", rowData.id)}
      />
    </div>
  );

  return (
    <div className="p-4">
      <CBTable
        headings={headings}
        data={menuItems}
        showAvailableSwitch
        actions={renderActions}
      />
    </div>
  );
};

export default Menu;
