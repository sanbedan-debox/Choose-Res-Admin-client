// import { useState } from "react";
// import { MdArrowOutward } from "react-icons/md";
// import ReusableModal from "@/components/common/modal/modal";
// import CButton from "@/components/common/button/button";
// import { ButtonType } from "@/components/common/button/interface";

// interface Props {
//   title: string;
//   isOpen: boolean;
//   onClose: () => void;
//   searchTerm: string;
//   handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   filteredItems: any[]; // Replace 'any[]' with your actual type for items
//   tempSelectedItems: any[]; // Replace 'any[]' with your actual type for selected items
//   handleItemClick: (item: any) => void; // Replace 'any' with your actual type for item
//   handleAddItems: () => void;
//   createNewItemButtonLabel?: string;
//   addSelectedItemsButtonLabel?: string;
// }

// const AddFormDropdown: React.FC<Props> = ({
//   title,
//   isOpen,
//   onClose,
//   searchTerm,
//   handleSearch,
//   filteredItems,
//   tempSelectedItems,
//   handleItemClick,
//   handleAddItems,
//   createNewItemButtonLabel = "Create New Item",
//   addSelectedItemsButtonLabel = "Add Selected Items",
// }) => {
//   return (
//     <ReusableModal title={title} isOpen={isOpen} onClose={onClose}>
//       <div className="space-y-4">
//         <input
//           type="text"
//           placeholder="Search items..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="input input-primary w-full"
//         />
//         <ul>
//           {filteredItems.map((item) => (
//             <li key={item._id} className="flex items-center p-2 border-b">
//               <input
//                 aria-label="Add item"
//                 type="checkbox"
//                 checked={tempSelectedItems.some(
//                   (selectedItem) => selectedItem._id === item._id
//                 )}
//                 onChange={() => handleItemClick(item)}
//                 className="mr-2"
//               />
//               <div className="flex w-full justify-between">
//                 <span
//                   className="flex-1 cursor-pointer"
//                   onClick={() => handleItemClick(item)}
//                 >
//                   {item.name}
//                 </span>
//                 <div className="flex space-x-2">
//                   <p className="">${item.price}</p>
//                   <MdArrowOutward />
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="flex space-x-2 justify-end">
//           <CButton onClick={onClose} variant={ButtonType.Outlined}>
//             {createNewItemButtonLabel}
//           </CButton>
//           <CButton onClick={handleAddItems} variant={ButtonType.Primary}>
//             {addSelectedItemsButtonLabel}
//           </CButton>
//         </div>
//       </div>
//     </ReusableModal>
//   );
// };

// export default AddFormDropdown;

import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import ReusableModal from "@/components/common/modal/modal";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredItems: any[]; // Replace 'any[]' with your actual type for items
  tempSelectedItems: any[]; // Replace 'any[]' with your actual type for selected items
  handleItemClick: (item: any) => void; // Replace 'any' with your actual type for item
  handleAddItems: () => void;
  headings: {
    title: string;
    dataKey: string;
    render?: (item: any) => React.ReactNode;
  }[];
  renderActions?: (item: any) => React.ReactNode;
  createNewItemButtonLabel?: string;
  addSelectedItemsButtonLabel?: string;
}

const AddFormDropdown: React.FC<Props> = ({
  title,
  isOpen,
  onClose,
  searchTerm,
  handleSearch,
  filteredItems,
  tempSelectedItems,
  handleItemClick,
  handleAddItems,
  headings,
  renderActions,
  createNewItemButtonLabel = "Create New Item",
  addSelectedItemsButtonLabel = "Add Selected Items",
}) => {
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
          {filteredItems.map((item) => (
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
          <CButton onClick={onClose} variant={ButtonType.Outlined}>
            {createNewItemButtonLabel}
          </CButton>
          <CButton onClick={handleAddItems} variant={ButtonType.Primary}>
            {addSelectedItemsButtonLabel}
          </CButton>
        </div>
      </div>
    </ReusableModal>
  );
};

export default AddFormDropdown;
