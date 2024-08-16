import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import { useState } from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  tempSelectedItems: any[];
  handleItemClick: (item: any) => void;
  handleAddItems: () => void;
  headings: {
    title: string;
    dataKey: string;
    render?: (item: any) => React.ReactNode;
  }[];
  renderActions?: (item: any) => React.ReactNode;
  createNewItemButtonLabel?: string;
  addSelectedItemsButtonLabel?: string;
  onClickCreatebtn?: () => void;
}

const AddFormDropdown: React.FC<Props> = ({
  title,
  isOpen,
  onClose,
  data,
  tempSelectedItems,
  handleItemClick,
  handleAddItems,
  headings,
  renderActions,
  createNewItemButtonLabel = "Create New Item",
  onClickCreatebtn,
  addSelectedItemsButtonLabel = "Add Selected Items",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ReusableModal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-primary w-full"
        />
        <ul>
          {filteredItems?.map((item) => (
            <li key={item._id} className="flex items-center p-2 border-b">
              <input
                aria-label="Add item"
                type="checkbox"
                checked={tempSelectedItems.some(
                  (selectedItem) => selectedItem._id === item._id
                )}
                onChange={() => handleItemClick(item)}
                className="mr-2"
              />
              {/* <CustomSwitch
                checked={tempSelectedItems.some(
                  (selectedItem) => selectedItem._id === item._id
                )}
                onChange={() => handleItemClick(item)}
                label="Add item"
                className="mr-2"
              /> */}
              <div className="flex flex-1 justify-between">
                <span
                  className="cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  {item.name}
                </span>
                <div className="flex space-x-2">
                  {headings.map((heading, index) => (
                    <div key={index} className="flex items-center">
                      <span className="font-medium"> </span>
                      {heading.render
                        ? heading.render(item)
                        : item[heading.dataKey]}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2 justify-end">
          <CButton onClick={onClickCreatebtn} variant={ButtonType.Outlined}>
            <div className="flex justify-center items-center">
              {createNewItemButtonLabel}

              <BsArrowUpRightCircle className="text-xl ml-1" />
            </div>
          </CButton>
          <CButton onClick={handleAddItems} variant={ButtonType.Primary}>
            <div className="flex justify-center items-center">
              {addSelectedItemsButtonLabel}

              <IoIosAddCircleOutline className="text-xl ml-1" />
            </div>
          </CButton>
        </div>
      </div>
    </ReusableModal>
  );
};

export default AddFormDropdown;
