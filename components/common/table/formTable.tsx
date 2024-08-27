import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { ImFileEmpty } from "react-icons/im";
import { IoIosAddCircleOutline } from "react-icons/io";
import Select from "react-select";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";

export interface Heading {
  title: string;
  dataKey: string;
  render?: (rowData: DataItemFormAddTable) => React.ReactNode;
}

interface DataItemFormAddTable {
  _id: string;
  [key: string]: any;
}

interface FormAddTableProps {
  data?: DataItemFormAddTable[];
  headings: Heading[] | any[];
  title: string;
  emptyMessage: string;
  emptyCaption?: string;
  buttonText: string;
  onAddClick: () => void;
  isShowImage?: boolean;
  onSave?: (updatedData: DataItemFormAddTable[]) => void;
}

const FormAddTable: React.FC<FormAddTableProps> = ({
  data = [],
  headings,
  title,
  emptyMessage,
  emptyCaption = "",
  buttonText,
  onAddClick,
  isShowImage = false,
  onSave = () => {},
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState<{
    [key: string]: DataItemFormAddTable;
  }>({});

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item._id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete") {
      // Implement delete logic
    } else if (action === "aggregate") {
      // Implement aggregate logic
    }
  };

  const handleSave = () => {
    onSave(Object.values(editableData));
    setEditMode(false);
  };

  const handleQuickEdit = () => {
    setEditMode(true);
    const initialEditableData = filteredData.reduce((acc, item) => {
      acc[item._id] = { ...item };
      return acc;
    }, {} as { [key: string]: DataItemFormAddTable });
    setEditableData(initialEditableData);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="w-full border rounded-md p-2 border-t-2 border-b-2 ">
      <h2 className="block mb-2 text-sm font-medium text-left text-gray-700">
        {title}
      </h2>
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-1/3 max-h-8"
        />
        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-4">
            <Select
              options={[
                { value: "delete", label: "Delete" },
                { value: "aggregate", label: "Aggregate" },
              ]}
              placeholder="Bulk edit options"
              onChange={(selectedOption) =>
                handleBulkAction(selectedOption?.value ?? "")
              }
              classNames={{
                option: (state) =>
                  `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                    state.isSelected ? "!bg-primary text-white" : ""
                  }  `,
              }}
            />
            {editMode ? (
              <>
                <button
                  type="button"
                  className="text-primary hover:underline hover:cursor-pointer text-sm"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-secondary hover:underline hover:cursor-pointer text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="text-primary hover:underline hover:cursor-pointer text-sm"
                onClick={handleQuickEdit}
              >
                Quick Edit
              </button>
            )}
          </div>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex justify-start align-middle p-4 border rounded-md space-x-4">
          <div className="flex text-xl text-gray-500 items-center">
            <ImFileEmpty />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 text-start">
              {searchTerm ? "No Data Found" : emptyMessage}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2">
            <input
              type="checkbox"
              checked={
                selectedItems.length === filteredData.length &&
                selectedItems.length > 0
              }
              onChange={handleSelectAll}
              className="mr-2"
            />
          </div>
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div className="flex">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleSelectItem(item._id)}
                  className="mr-2"
                />
                <div className="flex items-center space-x-2 py-1">
                  {isShowImage &&
                    (item?.image?.trim() && !imageError ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-md"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-primary text-2xl">
                        <CiImageOn />
                      </div>
                    ))}
                  {editMode ? (
                    <input
                      type="text"
                      value={editableData[item._id]?.name || ""}
                      onChange={(e) =>
                        handleInputChange(item._id, "name", e.target.value)
                      }
                      className="p-1 border rounded"
                    />
                  ) : (
                    <span className="text-md">{item?.name || item?.name}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {headings.map((heading) => (
                  <span key={heading.dataKey}>
                    {/* {editMode && heading.title !== "Actions" ? (
                      <input
                        type="text"
                        value={editableData[item._id]?.[heading.dataKey] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            item._id,
                            heading.dataKey,
                            e.target.value
                          )
                        }
                        className="p-1 border rounded"
                      />
                    ) : heading.render ? (
                      heading.render(item)
                    ) : (
                      item[heading.dataKey] || item[heading.dataKey]
                    )} */}
                    {editMode && heading.title !== "Actions" ? (
                      <input
                        type={
                          ["Price", "price", "Count", "count"].includes(
                            heading.title
                          )
                            ? "number"
                            : "text"
                        }
                        value={editableData[item._id]?.[heading.dataKey] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            item._id,
                            heading.dataKey,
                            e.target.value
                          )
                        }
                        className="p-1 border rounded"
                      />
                    ) : heading.render ? (
                      heading.render(item)
                    ) : (
                      item[heading.dataKey] || item[heading.dataKey]
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!editMode && (
        <CButton
          type="button"
          variant={ButtonType.Outlined}
          onClick={onAddClick}
          className="w-full mt-2 mb-2"
        >
          <div className="flex justify-center items-center">
            {buttonText}
            <IoIosAddCircleOutline className="text-xl ml-1" />
          </div>
        </CButton>
      )}
    </div>
  );
};

export default FormAddTable;
