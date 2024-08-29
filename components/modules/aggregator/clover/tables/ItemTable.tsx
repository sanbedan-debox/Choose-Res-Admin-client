import React from "react";
import {
  useCloverItemStore,
  useCloverModifierGroupStore,
} from "../../../../../store/cloverStores";

const ItemTable: React.FC = () => {
  const { items } = useCloverItemStore();
  const { modifierGroups } = useCloverModifierGroupStore();

  // Function to get modifier group names by ids
  const getModifierGroupNamesByIds = (ids: string[]) => {
    return ids
      ?.map((id) => {
        const group = modifierGroups?.find((group) => group.id === id);
        return group ? group.name : "Unknown";
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
              Price
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modifier Group
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Online Ordering
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dine In
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catering
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Limit
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Popular Item
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              UpSell Item
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Is Vegan
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Has Nuts
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Is Gluten Free
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Is Halal
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Is Spicy
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                {item.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">{item.price}</td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.modifierGroups.length > 0
                  ? getModifierGroupNamesByIds(item.modifierGroups)
                  : "None"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                <span
                  className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    item.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item["Online Ordering"] ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item["Dine In"] ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.Catering ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item["Item Limit"]}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item["Popular Item"] ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item["UpSell Item"] ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.IsVegan ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.HasNuts ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.IsGlutenFree ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.IsHalal ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {item.IsSpicy ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
