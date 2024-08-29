import React from "react";
import {
  useCloverModifierGroupStore,
  useCloverModifierStore,
} from "../../../../../store/cloverStores";

const ModifierGroupTable: React.FC = () => {
  const { modifierGroups } = useCloverModifierGroupStore();
  const { modifiers } = useCloverModifierStore();

  // Function to get modifier names by ids
  const getModifierNamesByIds = (ids: string[]) => {
    return ids
      .map((id) => {
        const modifier = modifiers?.find((mod) => mod.id === id);
        return modifier ? modifier.name : "Unknown";
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
              Modifiers
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Required
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Required
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {modifierGroups?.map((group) => (
            <tr key={group.id}>
              <td className="py-3 px-4 text-sm text-gray-500">{group.name}</td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {group.modifiers.length > 0
                  ? getModifierNamesByIds(group.modifiers)
                  : "None"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {group.minRequired}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {group.maxRequired}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModifierGroupTable;
