import React from "react";
import {
  useCloverCategoryStore,
  useCloverItemStore,
} from "../../../../../store/cloverStores";

const CategoryTable: React.FC = () => {
  const { categories } = useCloverCategoryStore();
  const { items } = useCloverItemStore();

  // Function to get item names by ids
  const getItemNamesByIds = (ids: string[]) => {
    return ids
      ?.map((id) => {
        const item = items?.find((item) => item.id === id);
        return item ? item.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories?.map((category) => (
            <tr key={category.id}>
              <td className="py-3 px-4 text-sm text-gray-500">
                {category.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {getItemNamesByIds(category.items)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                <span
                  className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    category.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.status ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
