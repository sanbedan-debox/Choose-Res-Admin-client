import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [filteredMods, setFilteredMods] = useState<Modifier[]>([]);
  const [selectedModifierGroup, setSelectedModifierGroup] = useState<
    string | null
  >(null);

  const handleManageMods = (modifierGroup: ModifierGroup) => {
    setSelectedModifierGroup(modifierGroup.id);
    setSelectedMods(modifierGroup.modifiers); // Auto-select items in the category
    setFilteredMods(modifiers ?? []);
    setIsModalOpen(true);
  };
  const handleCheckboxChange = (modId: string) => {
    setSelectedMods((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
    );
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value.toLowerCase().trim();
    if (!modifiers) {
      return; // Early return if items is null or undefined
    }
    if (searchVal !== "") {
      setFilteredMods(
        modifiers.filter((mods) => mods.name.toLowerCase().includes(searchVal))
      );
    } else {
      setFilteredMods(modifiers);
    }
  };

  const updateModifierGroupMods = (
    modifierGroupId: string,
    modsId: string[]
  ) => {
    const updatedModiferGroup = modifierGroups?.map((modgrp) =>
      modgrp.id === modifierGroupId ? { ...modgrp, modifiers: modsId } : modgrp
    );
    setModifierGroups(updatedModiferGroup ?? []);
  };

  const handleSave = () => {
    if (selectedModifierGroup) {
      updateModifierGroupMods(selectedModifierGroup, selectedMods);
    }
    setIsModalOpen(false);
  };

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
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
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
                  <td>
                    <p
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => handleManageMods(group)}
                    >
                      Manage Items
                    </p>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <ReusableModal
        title="Manage Modifiers"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        width="md"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearch}
            className="input input-primary w-full"
          />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {filteredMods.length > 0 ? (
            filteredMods.map((mods) => (
              <div
                key={mods.id}
                className="flex items-center p-2 border-b border-gray-200 cursor-pointer"
                onClick={() => handleCheckboxChange(mods.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedMods.includes(mods.id)}
                  readOnly
                  className="mr-3"
                />
                <span className="text-sm font-medium">{mods.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No Data Found</p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <CButton variant={ButtonType.Primary} onClick={handleSave}>
            Save
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default ModifierGroupTable;
