import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import React, { useState } from "react";
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
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories?.map((category) => (
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
                {category.items.length > 0 && (
                  <div className="flex space-x-4">
                    <p
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => handleManageItemPrice(category.id)}
                    >
                      Manage Items Price
                    </p>
                    <p
                      className="text-red-600 cursor-pointer hover:underline"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </p>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Manage Price */}
      <ReusableModal
        title="Manage Item Price"
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
    </div>
  );
};

export default CategoryTable;
