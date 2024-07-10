import React from "react";

const Categories = () => {
  const categories = [
    {
      name: "Appetizers",
      description: "Start your meal with a delicious appetizer.",
    },
    { name: "Main Courses", description: "Hearty and filling main courses." },
    { name: "Desserts", description: "Sweet treats to finish your meal." },
    { name: "Beverages", description: "Refresh with a drink." },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Category
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200">
                {category.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {category.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
