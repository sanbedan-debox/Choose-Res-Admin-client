import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import ReusableModal from "@/components/common/modal/modal";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface Item {
  category: string;
  categoryDesc: string;
  subCategory: string;
  subCategoryDesc: string;
  itemName: string;
  itemDesc: string;
  price: number;
  itemStatus: boolean;
  onlineOrdering: boolean;
  dineIn: boolean;
  catering: boolean;
  itemLimit: number;
  popularItem: boolean;
  upSellItem: boolean;
  isVegan: boolean;
  hasNuts: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isSpicy: boolean;
}

const tableHeaders = [
  "Category",
  "Category Desc",
  "Sub Category",
  "Sub Category Desc",
  "Item Name",
  "Item Desc",
  "Item Price",
  "Item Status",
  "Online Ordering",
  "Dine In",
  "Catering",
  "Item Limit",
  "Popular Item",
  "Up Sell Item",
  "Is Vegan",
  "Has Nuts",
  "Is Gluten Free",
  "Is Halal",
  "Is Spicy",
];

const CloverPullForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    categories: [{ name: "Biriyani" }, { name: "Pizza" }],
    subCategories: [
      { category: "Biriyani", name: "Veg" },
      { category: "Pizza", name: "Veg" },
      { category: "Biriyani", name: "Non Veg" },
    ],
    items: [
      {
        category: "Biriyani",
        categoryDesc:
          "A traditional Indian dish made with layers of rice spices and various ingredients cooked slowly",
        subCategory: "Veg",
        subCategoryDesc:
          "Delicious vegetarian dishes prepared with spices offering a variety of flavors",
        itemName: "Paneer Biriyani",
        itemDesc: "The best paneer biriyani in town rich in flavor",
        price: 2190,
        itemStatus: true,
        onlineOrdering: true,
        dineIn: false,
        catering: false,
        itemLimit: 100,
        popularItem: true,
        upSellItem: true,
        isVegan: true,
        hasNuts: false,
        isGlutenFree: false,
        isHalal: false,
        isSpicy: false,
      },
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState<Item[]>(data.items);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceMode, setPriceMode] = useState<"amount" | "percentage">("amount");
  const [priceValue, setPriceValue] = useState<number>(0);

  const handleNextStep = async () => {
    setLoading(true);
    setStep(2);
    setLoading(false);
    setIsModalOpen(true);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChange = (index: number, key: keyof Item, value: any) => {
    const updatedItems = [...editedItems];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setEditedItems(updatedItems);
  };

  const handleSave = () => {
    setData({ ...data, items: editedItems });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedItems(data.items);
    setIsEditMode(false);
  };

  const handleManagePrice = () => {
    setIsPriceModalOpen(true);
  };

  const handlePriceSave = () => {
    const updatedItems = editedItems.map((item) => {
      if (priceMode === "amount") {
        return { ...item, price: item.price + priceValue };
      } else {
        return { ...item, price: item.price * (1 + priceValue / 100) };
      }
    });
    setEditedItems(updatedItems);
    setIsPriceModalOpen(false);
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="w-full flex justify-between items-center px-12 py-4 mb-5">
        <div
          className={`rounded-md w-8 h-8 flex items-center justify-center ${
            step >= 1 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div
          className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}
        ></div>
        <div
          className={`rounded-md w-8 h-8 flex items-center justify-center ${
            step >= 2 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          2
        </div>
      </div>

      {/* Step 1: Guidelines */}
      {step === 1 && (
        <div className="flex flex-col space-y-10 text-center">
          <div className="w-full mx-auto">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64"
            ></iframe>
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold">Guidelines</h2>
            <ul className="list-disc list-inside text-md">
              <li>Follow the instructions in the video.</li>
              <li>Click "Next" when you're ready to proceed.</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <CButton
              loading={loading}
              onClick={handleNextStep}
              variant={ButtonType.Primary}
            >
              Next
            </CButton>
          </div>
        </div>
      )}

      {/* Step 2: Data Summary */}
      {step === 2 && (
        <div className="flex flex-col space-y-10 text-center">
          {loading ? (
            <FaSpinner className="animate-spin text-2xl text-primary" />
          ) : (
            <div>
              <h2 className="text-lg font-semibold">Data Summary</h2>
              <div className="mt-4">
                <p>Categories: {data.categories.length}</p>
                <p>Subcategories: {data.subCategories.length}</p>
                <p>Items: {data.items.length}</p>
              </div>
              <CButton
                onClick={() => setIsModalOpen(true)}
                variant={ButtonType.Primary}
              >
                View Details
              </CButton>
            </div>
          )}
        </div>
      )}

      <FullPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Data Preview"
        actionButtonLabel={isEditMode ? "Save" : "Close"}
        onActionButtonClick={
          isEditMode ? handleSave : () => setIsModalOpen(false)
        }
      >
        <div className="flex justify-start mb-4">
          {!isEditMode ? (
            <>
              <CButton onClick={handleEditToggle} variant={ButtonType.Primary}>
                {"Edit"}
              </CButton>
              <CButton onClick={handleManagePrice} variant={ButtonType.Primary}>
                Manage Price
              </CButton>
            </>
          ) : (
            <>
              <CButton onClick={handleSave} variant={ButtonType.Primary}>
                Save
              </CButton>
              <CButton
                onClick={handleCancel}
                variant={ButtonType.Outlined}
                className="ml-2"
              >
                Cancel
              </CButton>
            </>
          )}
        </div>
        {data.items.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedItems.map((item: Item, index: number) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                          handleChange(index, "category", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.category
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.categoryDesc}
                        onChange={(e) =>
                          handleChange(index, "categoryDesc", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.categoryDesc
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.subCategory}
                        onChange={(e) =>
                          handleChange(index, "subCategory", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.subCategory
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.subCategoryDesc}
                        onChange={(e) =>
                          handleChange(index, "subCategoryDesc", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.subCategoryDesc
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) =>
                          handleChange(index, "itemName", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.itemName
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.itemDesc}
                        onChange={(e) =>
                          handleChange(index, "itemDesc", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.itemDesc
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleChange(index, "price", Number(e.target.value))
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.itemStatus ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "itemStatus",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.itemStatus ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.onlineOrdering ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "onlineOrdering",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.onlineOrdering ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.dineIn ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "dineIn",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.dineIn ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.catering ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "catering",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.catering ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={item.itemLimit}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "itemLimit",
                            Number(e.target.value)
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    ) : (
                      item.itemLimit
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.popularItem ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "popularItem",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.popularItem ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.upSellItem ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "upSellItem",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.upSellItem ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.isVegan ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "isVegan",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.isVegan ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.hasNuts ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "hasNuts",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.hasNuts ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.isGlutenFree ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "isGlutenFree",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.isGlutenFree ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.isHalal ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "isHalal",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.isHalal ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                    {isEditMode ? (
                      <select
                        value={item.isSpicy ? "Yes" : "No"}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "isSpicy",
                            e.target.value === "Yes"
                          )
                        }
                        className="border border-gray-300 p-1 rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : item.isSpicy ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No data available</div>
        )}
      </FullPageModal>
      <ReusableModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Manage Price"
      >
        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setPriceMode("amount")}
              className={`px-4 py-2 rounded ${
                priceMode === "amount" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              Increase by Amount
            </button>
            <button
              onClick={() => setPriceMode("percentage")}
              className={`px-4 py-2 rounded ${
                priceMode === "percentage"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              Increase by Percentage
            </button>
          </div>
          <input
            type="number"
            value={priceValue}
            onChange={(e: any) => setPriceValue(Number(e.target.value))}
            placeholder={
              priceMode === "amount" ? "Enter amount" : "Enter percentage"
            }
            className="border border-gray-300 p-2 rounded"
          />
          <CButton
            variant={ButtonType.Primary}
            className="w-full"
            onClick={handlePriceSave}
          >
            Save
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default CloverPullForm;
