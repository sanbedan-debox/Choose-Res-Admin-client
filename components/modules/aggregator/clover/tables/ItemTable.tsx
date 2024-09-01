import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import React, { useState } from "react";
import Select from "react-select";
import {
  useCloverItemStore,
  useCloverModifierGroupStore,
} from "../../../../../store/cloverStores";

const ItemTable: React.FC = () => {
  // Config
  // Global States
  const { items, setItems } = useCloverItemStore();
  const { modifierGroups } = useCloverModifierGroupStore();
  const { setToastData } = useGlobalStore();
  // Local States
  const [editMode, setEditMode] = useState(false);
  const [increaseValue, setIncreaseValue] = useState<number>(0);
  const [editData, setEditData] = useState(
    items?.map((item) => ({
      ...item,
      status: item.status ? true : false,
      "Popular Item": item["Popular Item"] ? true : false,
      "UpSell Item": item["UpSell Item"] ? true : false,
      IsVegan: item.IsVegan ? true : false,
      HasNuts: item.HasNuts ? true : false,
      IsGlutenFree: item.IsGlutenFree ? true : false,
      IsHalal: item.IsHalal ? true : false,
      IsSpicy: item.IsSpicy ? true : false,
    })) ?? []
  );
  const [bulkPriceIncreaseModalOpen, setBulkPriceIncreaseModalOpen] =
    useState(false);

  const [increaseBy, setIncreaseBy] = useState<"amount" | "percentage">(
    "amount"
  );
  const [confirmPriceChangeModalOpen, setConfirmPriceChangeModalOpen] =
    useState(false);

  //Managing Modifier Groups States
  const [isManageModModalOpen, setIsManageModModalOpen] = useState(false);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [filteredMods, setFilteredMods] = useState<ModifierGroup[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Handler Functions

  const handleManageItems = (item: Item) => {
    setSelectedItem(item?.id);
    setSelectedMods(item.modifierGroups); // Auto-select items in the category
    setFilteredMods(modifierGroups ?? []);
    setIsManageModModalOpen(true);
  };

  const handleCheckboxChange = (itemId: string) => {
    setSelectedMods((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value.toLowerCase().trim();
    if (!items) {
      return; // Early return if items is null or undefined
    }
    if (searchVal !== "") {
      setFilteredMods(
        (modifierGroups ?? []).filter((item) =>
          item.name.toLowerCase().includes(searchVal)
        )
      );
    } else {
      setFilteredMods(modifierGroups ?? []);
    }
  };

  const updateItemMods = (itemId: string, modIds: string[]) => {
    const updatedModifiers = items?.map((item) =>
      item.id === itemId ? { ...item, modifierGroups: modIds } : item
    );
    setItems(updatedModifiers ?? []);
  };

  const handleSave = () => {
    if (selectedItem) {
      updateItemMods(selectedItem, selectedMods);
    }
    setIsManageModModalOpen(false);
  };

  // Function to get modifier group names by ids
  const getModifierGroupNamesByIds = (ids: string[]) => {
    return ids
      ?.map((id) => {
        const group = modifierGroups?.find((group) => group.id === id);
        return group ? group.name : "Unknown";
      })
      .join(", ");
  };

  const handlePriceChange = (
    increaseValue: number,
    increaseType: "amount" | "percentage"
  ) => {
    const updatedItems = items?.map((item) => {
      const newPrice =
        increaseType === "percentage"
          ? item.price * (1 + increaseValue / 100)
          : item.price + increaseValue;
      return { ...item, price: newPrice };
    });
    setItems(updatedItems ?? []);
    setBulkPriceIncreaseModalOpen(false);
  };

  // render
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        {!editMode ? (
          <div className="flex space-x-3">
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => setEditMode(true)}
            >
              Bulk Edit
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => setBulkPriceIncreaseModalOpen(true)}
            >
              Bulk Price Increase
            </CButton>
          </div>
        ) : (
          <div className="flex space-x-4">
            <CButton
              variant={ButtonType.Primary}
              onClick={() => {
                // Validation
                const conflictItem = editData.find(
                  (item) => item.IsVegan && item.IsHalal
                );
                if (conflictItem) {
                  setToastData({
                    message: `${conflictItem.name} cannot be both Vegan and Halal at the same time.`,
                    type: "error",
                  });
                  return;
                }

                setItems(editData);
                setEditMode(false);
              }}
            >
              Save
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => {
                setEditData(
                  items?.map((item) => ({
                    ...item,
                    status: item.status ? true : false,
                    "Popular Item": item["Popular Item"] ? true : false,
                    "UpSell Item": item["UpSell Item"] ? true : false,
                    IsVegan: item.IsVegan ? true : false,
                    HasNuts: item.HasNuts ? true : false,
                    IsGlutenFree: item.IsGlutenFree ? true : false,
                    IsHalal: item.IsHalal ? true : false,
                    IsSpicy: item.IsSpicy ? true : false,
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
              Price
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modifier Group
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
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
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {editMode
            ? editData.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, name: e.target.value }
                              : i
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, price: Number(e.target.value) }
                              : i
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {item.modifierGroups.length > 0
                      ? getModifierGroupNamesByIds(item.modifierGroups)
                      : "None"}
                  </td>{" "}
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Active" },
                        { value: false, label: "Inactive" },
                      ]}
                      value={
                        item.status
                          ? { value: true, label: "Active" }
                          : { value: false, label: "Inactive" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, status: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item["Popular Item"]
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, "Popular Item": option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item["UpSell Item"]
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, "UpSell Item": option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item.IsVegan
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, IsVegan: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item.HasNuts
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, HasNuts: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item.IsGlutenFree
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, IsGlutenFree: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item.IsHalal
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, IsHalal: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        item.IsSpicy
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, IsSpicy: option?.value === true }
                              : i
                          )
                        )
                      }
                      className="text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                </tr>
              ))
            : items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {item.price}
                  </td>
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
                  <td>
                    <p
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => handleManageItems(item)}
                    >
                      Manage Items
                    </p>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <ReusableModal
        title="Bulk Price Increase"
        isOpen={bulkPriceIncreaseModalOpen}
        onClose={() => setBulkPriceIncreaseModalOpen(false)}
        width="md"
      >
        <div className="space-y-6 mt-2">
          <div className="flex space-x-4">
            <div
              className={`flex-1 cursor-pointer p-2 text-center rounded-md ${
                increaseBy === "amount" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setIncreaseBy("amount")}
            >
              Increase by Amount
            </div>
            <div
              className={`flex-1 cursor-pointer p-2 text-center rounded-md ${
                increaseBy === "percentage" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setIncreaseBy("percentage")}
            >
              Increase by Percentage
            </div>
          </div>
          <input
            type="number"
            placeholder={`Enter ${
              increaseBy === "amount" ? "amount" : "percentage"
            } to increase`}
            className="input input-primary w-full"
            onChange={(e) => setIncreaseValue(Number(e.target.value))}
          />
          <CButton
            className="w-full"
            variant={ButtonType.Primary}
            onClick={() => {
              if (!increaseValue) {
                setBulkPriceIncreaseModalOpen(false);
                return;
              }
              setConfirmPriceChangeModalOpen(true);
            }}
          >
            Save
          </CButton>
        </div>
      </ReusableModal>
      <ReusableModal
        title="Manage Items"
        isOpen={isManageModModalOpen}
        onClose={() => setIsManageModModalOpen(false)}
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
            filteredMods.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-2 border-b border-gray-200 cursor-pointer"
                onClick={() => handleCheckboxChange(item.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedMods.includes(item.id)}
                  readOnly
                  className="mr-3"
                />
                <span className="text-sm font-medium">{item.name}</span>
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
      {/* Confirmation Price change */}
      <ReusableModal
        title="Confirm Price Change"
        isOpen={confirmPriceChangeModalOpen}
        onClose={() => setConfirmPriceChangeModalOpen(false)}
        width="md"
      >
        <div className="space-y-6 mt-2">
          <p>Are you sure you want to update prices of all the items</p>
          <div className="flex justify-end mt-4 space-x-4">
            <CButton
              className="w-full"
              variant={ButtonType.Primary}
              onClick={() => {
                handlePriceChange(increaseValue, increaseBy);

                setConfirmPriceChangeModalOpen(false);
              }}
            >
              Yes
            </CButton>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};

export default ItemTable;
