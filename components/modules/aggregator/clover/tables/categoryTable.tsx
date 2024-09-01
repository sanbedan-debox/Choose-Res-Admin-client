import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import React, { useState } from "react";
import Select from "react-select";
import {
  useCloverCategoryStore,
  useCloverItemStore,
} from "../../../../../store/cloverStores";

const CategoryTable: React.FC = () => {
  // Config
  // Global States
  const { setToastData } = useGlobalStore();
  const { categories, setCategories } = useCloverCategoryStore();
  const { items, setItems } = useCloverItemStore();

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Local States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [increaseBy, setIncreaseBy] = useState<"amount" | "percentage">(
    "amount"
  );
  const [value, setValue] = useState<number | "">("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(
    categories?.map((category) => ({
      ...category,
      status: category.status ? true : false,
    })) ?? []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const handleManageItems = (category: Category) => {
    setSelectedCategory(category?.id);
    setSelectedItems(category.items); // Auto-select items in the category
    setFilteredItems(items ?? []);
    setIsModalOpen(true);
  };
  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) =>
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
      setFilteredItems(
        items.filter((item) => item.name.toLowerCase().includes(searchVal))
      );
    } else {
      setFilteredItems(items);
    }
  };

  const updateCategoryItems = (categoryId: string, itemIds: string[]) => {
    const updatedCategories = categories?.map((category) =>
      category.id === categoryId ? { ...category, items: itemIds } : category
    );
    setCategories(updatedCategories ?? []);
  };

  const handleSave = () => {
    if (selectedCategory) {
      updateCategoryItems(selectedCategory, selectedItems);
    }
    setIsModalOpen(false);
  };

  // Helper Functions
  const getItemNamesByIds = (ids: string[]) => {
    if (!Array.isArray(items)) return "Unknown";

    return ids
      .map((id) => {
        const item = items.find((item) => item.id === id);
        return item ? item.name : "Unknown";
      })
      .join(", ");
  };

  // Handler Functions

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) {
      setToastData({
        message: "Something went worng try again later",
        type: "error",
      });
      return;
    }

    const category = categories?.find((cat) => cat.id === categoryToDelete);

    if (!category) {
      setToastData({
        message: "Invalid Category,Please try again later",
        type: "error",
      });
      return;
    }

    // Determine items to delete
    const itemsToDelete = category.items.filter((itemId) =>
      categories?.every(
        (cat) => cat.id === categoryToDelete || !cat.items.includes(itemId)
      )
    );

    // Remove items that are not in any other category
    const updatedItems = items?.filter(
      (item) => !itemsToDelete.includes(item.id)
    );
    setItems(updatedItems ?? []);

    // Remove the category
    const updatedCategories = categories?.filter(
      (cat) => cat.id !== categoryToDelete
    );
    setCategories(updatedCategories ?? []);

    console.log(categories);
    console.log(items);
    setToastData({
      message: "Successfully Removed Category",
      type: "success",
    });
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleManageItemPrice = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setModalOpen(true);
  };

  const handlePriceChange = () => {
    if (value !== "" && selectedCategory) {
      const amountOrPercentage =
        increaseBy === "amount" ? Number(value) : Number(value) / 100;

      // Create a copy of the current items
      const formatItems = items ? [...items] : [];

      // Update the prices based on the selected category and mode
      const updatedItems = formatItems.map((item) => {
        if (
          categories
            ?.find((cat) => cat.id === selectedCategory)
            ?.items.includes(item.id)
        ) {
          const newPrice =
            increaseBy === "amount"
              ? item.price + amountOrPercentage
              : item.price * (1 + amountOrPercentage);
          return { ...item, price: newPrice };
        }
        return item;
      });

      // Update the state with the modified items
      setToastData({
        message: "Successfully Updated Price",
        type: "success",
      });
      setItems(updatedItems);
    }

    // Reset state and close the modal
    setValue("");
    setModalOpen(false);
  };

  // Render

  return (
    <div className="overflow-x-auto h-full">
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
                // Update Categories
                setCategories(editData);
                setEditMode(false);
              }}
            >
              Save
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => {
                setEditData(
                  categories?.map((category) => ({
                    ...category,
                    status: category.status ? true : false,
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
      <table className="min-w-full divide-y divide-gray-200 bg-white h-full">
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
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 h-full">
          {editMode
            ? editData?.map((category) => (
                <tr key={category.id}>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((cat) =>
                            cat.id === category.id
                              ? { ...cat, name: e.target.value }
                              : cat
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {category.items.length > 0
                      ? getItemNamesByIds(category.items)
                      : "None"}
                  </td>

                  <td className="py-3 px-4 text-sm">
                    <Select
                      options={[
                        { value: true, label: "Active" },
                        { value: false, label: "Inactive" },
                      ]}
                      value={
                        category.status
                          ? { value: true, label: "Active" }
                          : { value: false, label: "Inactive" }
                      }
                      onChange={(option) =>
                        setEditData((prev) =>
                          prev.map((cat) =>
                            cat.id === category.id
                              ? { ...cat, status: option?.value === true }
                              : cat
                          )
                        )
                      }
                      className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                      classNamePrefix="react-select"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {/* Keep other columns as is */}
                  </td>
                </tr>
              ))
            : categories?.map((category) => (
                <tr key={category.id}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
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
                  <td className=" px-4 text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <p
                        className="text-primary cursor-pointer hover:underline"
                        onClick={() => handleManageItems(category)}
                      >
                        Manage Items
                      </p>
                      <p
                        className="text-red-600 cursor-pointer hover:underline"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </p>
                      {category.items.length > 0 && (
                        <div className="flex space-x-4">
                          <p
                            className="text-primary cursor-pointer hover:underline"
                            onClick={() => handleManageItemPrice(category.id)}
                          >
                            Increase Items Price
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          {}
        </tbody>
      </table>
      {/* Increase Item Price */}
      <ReusableModal
        title="Increase Item Price"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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
              increaseBy === "amount" ? "Amount" : "Percentage"
            }`}
            value={value}
            onChange={(e) =>
              setValue(e.target.value ? Number(e.target.value) : "")
            }
            className="input input-primary"
          />
          <div className="flex justify-end mt-4 space-x-4">
            <CButton
              className="w-full"
              variant={ButtonType.Primary}
              onClick={handlePriceChange}
            >
              Save
            </CButton>
          </div>
        </div>
      </ReusableModal>

      {/* Delete Category */}
      <ReusableModal
        title="Confirm Deletion"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        width="md"
      >
        <div className="space-y-6 mt-2">
          <p>
            Are you sure you want to delete this category? All items in this
            category will also be deleted if they are not used in any other
            category.
          </p>
          <div className="flex justify-end mt-4 space-x-4">
            <CButton
              className="w-full"
              variant={ButtonType.Primary}
              onClick={handleConfirmDelete}
            >
              Confirm
            </CButton>
          </div>
        </div>
      </ReusableModal>
      <ReusableModal
        title="Manage Items"
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-2 border-b border-gray-200 cursor-pointer"
                onClick={() => handleCheckboxChange(item.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
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
    </div>
  );
};

export default CategoryTable;
