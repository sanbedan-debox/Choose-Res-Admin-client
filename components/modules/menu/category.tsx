import CBTable from "@/components/common/table/table";
import React from "react";

const Categories: React.FC = () => {
  const categories = [
    {
      name: "Appetizers",
      description: "Start your meal with a delicious appetizer.",
    },
    { name: "Main Courses", description: "Hearty and filling main courses." },
    { name: "Desserts", description: "Sweet treats to finish your meal." },
    { name: "Beverages", description: "Refresh with a drink." },
  ];

  const headings = [
    { title: "Category", dataKey: "name" },
    { title: "Description", dataKey: "description" },
  ];

  return (
    <div className="p-4">
      <CBTable headings={headings} data={categories} />
    </div>
  );
};

export default Categories;
