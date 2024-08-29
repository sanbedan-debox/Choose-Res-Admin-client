import React from "react";
import { useCloverModifierStore } from "../../../../../store/cloverStores";

const ModifierTable: React.FC = () => {
  const { modifiers } = useCloverModifierStore();

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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {modifiers?.map((modifier) => (
            <tr key={modifier.id}>
              <td className="py-3 px-4 text-sm text-gray-500">
                {modifier.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                ${modifier.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModifierTable;
