import CBTable from "@/components/common/table/table";
import React from "react";

const Items: React.FC = () => {
  const items = [
    { name: "Cheeseburger", category: "Main Courses", price: "$8.99" },
    { name: "Margherita Pizza", category: "Main Courses", price: "$10.99" },
    { name: "Caesar Salad", category: "Appetizers", price: "$5.99" },
    { name: "Chocolate Cake", category: "Desserts", price: "$4.99" },
    { name: "Lemonade", category: "Beverages", price: "$2.99" },
  ];

  const headings = [
    { title: "Item", dataKey: "name" },
    { title: "Category", dataKey: "category" },
    { title: "Price", dataKey: "price" },
  ];

  return (
    <div className=" p-4">
      <CBTable headings={headings} data={items} />
    </div>
  );
};

export default Items;
