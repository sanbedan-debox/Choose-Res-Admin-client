import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import React, { useState } from "react";
import { useCloverModifierStore } from "../../../../../store/cloverStores";

const ModifierTable: React.FC = () => {
  const { modifiers, setModifiers } = useCloverModifierStore();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(
    modifiers?.map((modifier) => ({ ...modifier })) ?? []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [increaseBy, setIncreaseBy] = useState<"amount" | "percentage">(
    "amount"
  );
  const [value, setValue] = useState<number | "">("");
  const [confirmPriceChangeModalOpen, setConfirmPriceChangeModalOpen] =
    useState(false);

  const handlePriceIncrease = () => {
    const numericValue = typeof value === "number" ? value : 0;

    const updatedModifiers = editData.map((modifier) => {
      if (increaseBy === "amount") {
        setValue("");

        return { ...modifier, price: (modifier.price ?? 0) + numericValue };
      }
      setValue("");

      return {
        ...modifier,
        price: (modifier.price ?? 0) * (1 + numericValue / 100),
      };
    });

    setEditData(updatedModifiers);
    setModifiers(updatedModifiers);
    setModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        {!editMode ? (
          <div className="flex space-x-4">
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => setEditMode(true)}
            >
              Bulk Edit
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => setModalOpen(true)}
            >
              Bulk Increase Price
            </CButton>
          </div>
        ) : (
          <div className="flex space-x-4">
            <CButton
              variant={ButtonType.Primary}
              onClick={() => {
                // Save logic
                setModifiers(editData); // Update state with the new data
                setEditMode(false);
              }}
            >
              Save
            </CButton>
            <CButton
              variant={ButtonType.Outlined}
              onClick={() => {
                setEditData(
                  modifiers?.map((modifier) => ({ ...modifier })) ?? []
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {editMode
            ? editData.map((modifier) => (
                <tr key={modifier.id}>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="text"
                      value={modifier.name}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((mod) =>
                            mod.id === modifier.id
                              ? { ...mod, name: e.target.value }
                              : mod
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={modifier.price ?? 0}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev.map((mod) =>
                            mod.id === modifier.id
                              ? { ...mod, price: Number(e.target.value) }
                              : mod
                          )
                        )
                      }
                      className="input input-primary"
                    />
                  </td>
                </tr>
              ))
            : modifiers?.map((modifier) => (
                <tr key={modifier.id}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {modifier.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    ${modifier.price.toFixed(2)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <ReusableModal
        title="Increase Modifier Price"
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
              onClick={() => {
                setConfirmPriceChangeModalOpen(true);
              }}
            >
              Save
            </CButton>
          </div>
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
          <p>Are you sure you want to update the prices of the Modifiers</p>
          <div className="flex justify-end mt-4 space-x-4">
            <CButton
              className="w-full"
              variant={ButtonType.Primary}
              onClick={() => {
                handlePriceIncrease();
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

export default ModifierTable;
