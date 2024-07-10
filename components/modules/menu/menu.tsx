// components/Menu.js
import React from "react";

const Menu = () => {
  const menuItems = [
    { name: "Burger", price: "$5.99" },
    { name: "Pizza", price: "$8.99" },
    { name: "Pasta", price: "$7.99" },
    { name: "Salad", price: "$4.99" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Item
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200">
                {item.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;
