import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import { ChangeEvent, useEffect, useState } from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Heading } from "../table/formTable";

interface Props {
  title: string;
  createLabel: string;
  addLabel: string;
  data: any[];
  headings: Heading[] | any[];
  isOpen: boolean;
  onClose: () => void;
  addHandler: (idsList: string[]) => void;
  createClickHandler: () => void;
}

const AddFormDropdown: React.FC<Props> = ({
  title,
  createLabel,
  addLabel,
  data,
  headings,
  isOpen,
  onClose,
  addHandler,
  createClickHandler,
}) => {
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    let searchVal = event.target.value.toString().toLowerCase().trim();
    let arr = [...data];
    if (searchVal !== "") {
      setFilteredItems(
        arr?.filter((item) =>
          item.name.toLowerCase().includes(searchVal.toLowerCase().trim())
        )
      );
    } else {
      setFilteredItems(arr);
    }
  };

  const selectItemHandler = (id: string) => {
    // TODO: Can use refs for getting checked state of checkbox
    const idx = selectedItems.findIndex((e) => e === id);

    if (idx >= 0) {
      setSelectedItems((prev) => prev.filter((e) => e !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    setFilteredItems(data);
  }, [data]);

  return (
    <ReusableModal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search items..."
          onChange={handleSearch}
          className="input input-primary w-full"
        />
        <ul>
          {filteredItems?.map((item) => (
            <li key={item._id} className="flex items-center p-2 border-b">
              <input
                aria-label="Add item"
                type="checkbox"
                checked={selectedItems.some(
                  (selectedItem) => selectedItem === item._id
                )}
                onChange={(e) => {
                  selectItemHandler(item._id);
                }}
                className="mr-2"
              />
              <div className="flex flex-1 justify-between">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    selectItemHandler(item._id);
                  }}
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
          <CButton onClick={createClickHandler} variant={ButtonType.Outlined}>
            <div className="flex justify-center items-center">
              {createLabel}

              <BsArrowUpRightCircle className="text-xl ml-1" />
            </div>
          </CButton>
          <CButton
            onClick={() => {
              addHandler(selectedItems);
            }}
            variant={ButtonType.Primary}
          >
            <div className="flex justify-center items-center">
              {addLabel}

              <IoIosAddCircleOutline className="text-xl ml-1" />
            </div>
          </CButton>
        </div>
      </div>
    </ReusableModal>
  );
};

export default AddFormDropdown;
