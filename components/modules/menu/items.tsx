// components/Items.js
import React from "react";

const Items = () => {
  const items = [
    { name: "Cheeseburger", category: "Main Courses", price: "$8.99" },
    { name: "Margherita Pizza", category: "Main Courses", price: "$10.99" },
    { name: "Caesar Salad", category: "Appetizers", price: "$5.99" },
    { name: "Chocolate Cake", category: "Desserts", price: "$4.99" },
    { name: "Lemonade", category: "Beverages", price: "$2.99" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Items</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Item
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Category
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200">
                {item.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {item.category}
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

export default Items;
