import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";
import React, { useState } from "react";
import {
  useCloverModifierGroupStore,
  useCloverModifierStore,
} from "../../../../../store/cloverStores";

const ModifierGroupTable: React.FC = () => {
  const { modifierGroups, setModifierGroups } = useCloverModifierGroupStore();
  const { modifiers } = useCloverModifierStore();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(
    modifierGroups?.map((group) => ({
      ...group,
    })) ?? []
  );

  const { setToastData } = useGlobalStore();
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
      <div className="flex justify-between mb-4">
        {!editMode ? (
          <CButton
            variant={ButtonType.Outlined}
            onClick={() => setEditMode(true)}
          >
            Bulk Edit
          </CButton>
        ) : (
          <div className="flex space-x-4">
            <CButton
              variant={ButtonType.Primary}
              onClick={() => {
                // Validation
                const hasValidationError = editData.some(
                  (group) => (group.maxRequired ?? 0) < (group.minRequired ?? 0)
                );

                if (hasValidationError) {
                  const invalidGroup = editData.find(
                    (group) =>
                      (group.maxRequired ?? 0) < (group.minRequired ?? 0)
                  );

                  setToastData({
                    message: invalidGroup
                      ? `Max Required for "${invalidGroup.name}" cannot be less than Min Required`
                      : "Validation error",
                    type: "error",
                  });

                  return;
                }

                setModifierGroups(editData); // Update state with the new data
                setEditMode(false);
              }}
            >
              Save
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => {
                setEditData(
                  modifierGroups?.map((group) => ({
                    ...group,
                  })) ?? []
                );
                setEditMode(false);
              }}
            >
              Cancel
            </CButton>
          </div>
        )}
      </div>
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
          {editMode
            ? editData.map((group) => (
                <tr key={group.id}>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((g) =>
                            g.id === group.id
                              ? { ...g, name: e.target.value }
                              : g
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {group.modifiers.length > 0
                      ? getModifierNamesByIds(group.modifiers)
                      : "None"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="number"
                      value={group.minRequired ?? 0}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((g) =>
                            g.id === group.id
                              ? { ...g, minRequired: Number(e.target.value) }
                              : g
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="number"
                      value={group.maxRequired ?? 1}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((g) =>
                            g.id === group.id
                              ? { ...g, maxRequired: Number(e.target.value) }
                              : g
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                </tr>
              ))
            : modifierGroups?.map((group) => (
                <tr key={group.id}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {group.name}
                  </td>
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
