import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { ImFileEmpty } from "react-icons/im";
import { IoIosAddCircleOutline } from "react-icons/io";
import Select from "react-select";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";

interface Heading {
  title: string;
  dataKey: string;
  render?: (rowData: DataItem) => React.ReactNode;
}

interface DataItem {
  _id: string;
  [key: string]: any;
}

interface FormAddTableProps {
  data?: DataItem[];
  headings: Heading[] | any[];
  title: string;
  emptyMessage: string;
  emptyCaption?: string;
  buttonText: string;
  onAddClick: () => void;
  isShowImage?: boolean;
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
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const handleQuickEdit = () => {
    // Implement quick edit logic
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
              // className
              classNames={{
                option: (state) =>
                  `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                    state.isSelected ? "!bg-primary text-white" : ""
                  }  `,
              }}
            />
            <button
              type="button"
              className="text-primary hover:underline hover:cursor-pointer text-sm"
              onClick={handleQuickEdit}
            >
              Quick Edit
            </button>
          </div>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex justify-start align-middle p-4 border rounded-md space-x-4">
          <div className="flex text-xl text-gray-500 items-center">
            <ImFileEmpty />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 text-start">{emptyCaption}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 ">
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
                <span className="text-md">{item?.name || item?.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                {headings.map((heading) => (
                  <span key={heading.dataKey}>
                    {heading.render
                      ? heading.render(item)
                      : item[heading.dataKey] || item[heading.dataKey]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default FormAddTable;

// EDITTABLE FORM TABLE

// ------------------------
// import React, { useState } from "react";
// import { CiImageOn } from "react-icons/ci";
// import { ImFileEmpty } from "react-icons/im";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import Select from "react-select";
// import CButton from "../button/button";
// import { ButtonType } from "../button/interface";

// interface Heading {
//   title: string;
//   dataKey: string;
//   render?: (
//     rowData: DataItem,
//     handleChange?: (
//       e: React.ChangeEvent<HTMLInputElement>,
//       dataKey: string,
//       id: string
//     ) => void
//   ) => React.ReactNode;
// }

// interface DataItem {
//   _id: string;
//   [key: string]: any;
// }

// interface FormAddTableProps {
//   data?: DataItem[];
//   headings: Heading[] | any[];
//   title: string;
//   emptyMessage: string;
//   emptyCaption?: string;
//   buttonText: string;
//   onAddClick: () => void;
//   isShowImage?: boolean;
//   onSaveChanges?: (updatedData: DataItem[]) => void;
// }

// const FormAddTable: React.FC<FormAddTableProps> = ({
//   data = [],
//   headings,
//   title,
//   emptyMessage,
//   emptyCaption = "",
//   buttonText,
//   onAddClick,
//   isShowImage = false,
//   onSaveChanges,
// }) => {
//   const [imageError, setImageError] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [editedData, setEditedData] = useState<DataItem[]>(data);

//   const filteredData = editedData.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSelectItem = (id: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedItems.length === filteredData.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(filteredData.map((item) => item._id));
//     }
//   };

//   const handleBulkAction = (action: string) => {
//     if (action === "delete") {
//       // Implement delete logic
//     } else if (action === "aggregate") {
//       // Implement aggregate logic
//     }
//   };

//   const handleQuickEdit = () => {
//     setIsEditMode(true);
//   };

//   const handleCancelEdit = () => {
//     setEditedData(data); // Revert changes
//     setIsEditMode(false);
//   };

//   const handleSaveChanges = () => {
//     if (onSaveChanges) {
//       onSaveChanges(editedData);
//     }
//     setIsEditMode(false);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     dataKey: string,
//     id: string
//   ) => {
//     const newData = editedData.map((item) =>
//       item._id === id ? { ...item, [dataKey]: e.target.value } : item
//     );
//     setEditedData(newData);
//   };

//   return (
//     <div className="w-full border rounded-md p-2 border-t-2 border-b-2 ">
//       <h2 className="block mb-2 text-sm font-medium text-left text-gray-700">
//         {title}
//       </h2>
//       <div className="flex items-center justify-between mb-2">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="p-2 border rounded-md w-1/3 max-h-8"
//         />
//         {selectedItems.length > 0 && (
//           <div className="flex items-center space-x-4">
//             <Select
//               options={[
//                 { value: "delete", label: "Delete" },
//                 { value: "aggregate", label: "Aggregate" },
//               ]}
//               placeholder="Bulk edit options"
//               onChange={(selectedOption) =>
//                 handleBulkAction(selectedOption?.value ?? "")
//               }
//               className="text-sm"
//             />
//             {!isEditMode && (
//               <button
//                 type="button"
//                 className="text-primary hover:underline hover:cursor-pointer text-sm"
//                 onClick={handleQuickEdit}
//               >
//                 Quick Edit
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {filteredData.length === 0 ? (
//         <div className="flex justify-start align-middle p-4 border rounded-md space-x-4">
//           <div className="flex text-xl text-gray-500 items-center">
//             <ImFileEmpty />
//           </div>
//           <div className="flex flex-col">
//             <p className="text-sm text-gray-500 text-start">{emptyCaption}</p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <div className="flex justify-between items-center p-2 ">
//             <input
//               type="checkbox"
//               checked={
//                 selectedItems.length === filteredData.length &&
//                 selectedItems.length > 0
//               }
//               onChange={handleSelectAll}
//               className="mr-2"
//             />
//           </div>
//           {filteredData.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between items-center p-2 border rounded-md"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedItems.includes(item._id)}
//                 onChange={() => handleSelectItem(item._id)}
//                 className="mr-2"
//               />
//               <div className="flex items-center space-x-2 py-1">
//                 {isShowImage &&
//                   (item?.image?.trim() && !imageError ? (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-10 h-10 rounded-md"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div className="text-primary text-2xl">
//                       <CiImageOn />
//                     </div>
//                   ))}
//                 {isEditMode ? (
//                   <input
//                     type="text"
//                     value={item.name}
//                     onChange={(e) => handleInputChange(e, "name", item._id)}
//                     className="border p-1 rounded-md"
//                   />
//                 ) : (
//                   <span className="text-md">{item?.name || item?.name}</span>
//                 )}
//               </div>
//               <div className="flex items-center space-x-4">
//                 {headings.map((heading) => (
//                   <span key={heading.dataKey}>
//                     {isEditMode && heading.dataKey !== "name" ? (
//                       <input
//                         type="text"
//                         value={item[heading.dataKey]}
//                         onChange={(e) =>
//                           handleInputChange(e, heading.dataKey, item._id)
//                         }
//                         className="border p-1 rounded-md"
//                       />
//                     ) : heading.render ? (
//                       heading.render(item, handleInputChange)
//                     ) : (
//                       item[heading.dataKey] || item[heading.dataKey]
//                     )}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {isEditMode && (
//         <div className="flex justify-end space-x-2 mt-2">
//           <CButton
//             type="button"
//             variant={ButtonType.Outlined}
//             onClick={handleCancelEdit}
//           >
//             Cancel
//           </CButton>
//           <CButton
//             type="button"
//             variant={ButtonType.Primary}
//             onClick={handleSaveChanges}
//           >
//             Save
//           </CButton>
//         </div>
//       )}

//       <CButton
//         type="button"
//         variant={ButtonType.Outlined}
//         onClick={onAddClick}
//         className="w-full mt-2 mb-2"
//       >
//         <div className="flex justify-center items-center">
//           {buttonText}
//           <IoIosAddCircleOutline className="text-xl ml-1" />
//         </div>
//       </CButton>
//     </div>
//   );
// };

// export default FormAddTable;

// import React, { useState } from "react";
// import { CiImageOn } from "react-icons/ci";
// import { ImFileEmpty } from "react-icons/im";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import Select from "react-select";
// import CButton from "../button/button";
// import { ButtonType } from "../button/interface";

// interface Heading {
//   title: string;
//   dataKey: string;
//   render?: (
//     rowData: DataItem,
//     isEditing: boolean,
//     onChange: (key: string, value: any) => void
//   ) => React.ReactNode;
// }

// interface DataItem {
//   _id: string;
//   [key: string]: any;
// }

// interface FormAddTableProps {
//   data?: DataItem[];
//   headings: Heading[] | any[];
//   title: string;
//   emptyMessage: string;
//   emptyCaption?: string;
//   buttonText: string;
//   onAddClick: () => void;
//   isShowImage?: boolean;
// }

// const FormAddTable: React.FC<FormAddTableProps> = ({
//   data = [],
//   headings,
//   title,
//   emptyMessage,
//   emptyCaption = "",
//   buttonText,
//   onAddClick,
//   isShowImage = false,
// }) => {
//   const [imageError, setImageError] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editedData, setEditedData] = useState<{ [key: string]: DataItem }>({});

//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSelectItem = (id: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedItems.length === filteredData.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(filteredData.map((item) => item._id));
//     }
//   };

//   const handleQuickEdit = () => {
//     setIsEditing(true);
//     setEditedData(
//       selectedItems.reduce((acc, id) => {
//         const item = data.find((item) => item._id === id);
//         if (item) {
//           acc[id] = { ...item };
//         }
//         return acc;
//       }, {} as { [key: string]: DataItem })
//     );
//   };

//   const handleSave = () => {
//     // Handle save logic here (e.g., call API with editedData)
//     setIsEditing(false);
//     setSelectedItems([]);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedData({});
//     setSelectedItems([]);
//   };

//   const handleChange = (id: string, key: string, value: any) => {
//     setEditedData((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [key]: value,
//       },
//     }));
//   };

//   return (
//     <div className="w-full border rounded-md p-2 border-t-2 border-b-2">
//       <h2 className="block mb-2 text-sm font-medium text-left text-gray-700">
//         {title}
//       </h2>
//       <div className="flex items-center justify-between mb-2">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="p-2 border rounded-md w-1/3 max-h-8"
//         />
//         {selectedItems.length > 0 && (
//           <div className="flex items-center space-x-4">
//             <Select
//               options={[
//                 { value: "delete", label: "Delete" },
//                 { value: "aggregate", label: "Aggregate" },
//               ]}
//               placeholder="Bulk edit options"
//               onChange={(selectedOption) =>
//                 handleBulkAction(selectedOption?.value ?? "")
//               }
//               classNames={{
//                 option: (state) =>
//                   `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
//                     state.isSelected ? "!bg-primary text-white" : ""
//                   }`,
//               }}
//             />
//             {isEditing ? (
//               <>
//                 <button
//                   type="button"
//                   className="text-primary hover:underline hover:cursor-pointer text-sm"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   className="text-secondary hover:underline hover:cursor-pointer text-sm"
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button
//                 type="button"
//                 className="text-primary hover:underline hover:cursor-pointer text-sm"
//                 onClick={handleQuickEdit}
//               >
//                 Quick Edit
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {filteredData.length === 0 ? (
//         <div className="flex justify-start align-middle p-4 border rounded-md space-x-4">
//           <div className="flex text-xl text-gray-500 items-center">
//             <ImFileEmpty />
//           </div>
//           <div className="flex flex-col">
//             <p className="text-sm text-gray-500 text-start">{emptyCaption}</p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <div className="flex justify-between items-center p-2">
//             <input
//               type="checkbox"
//               checked={
//                 selectedItems.length === filteredData.length &&
//                 selectedItems.length > 0
//               }
//               onChange={handleSelectAll}
//               className="mr-2"
//             />
//           </div>
//           {filteredData.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between items-center p-2 border rounded-md"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedItems.includes(item._id)}
//                 onChange={() => handleSelectItem(item._id)}
//                 className="mr-2"
//               />
//               <div className="flex items-center space-x-2 py-1">
//                 {isShowImage &&
//                   (item?.image?.trim() && !imageError ? (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-10 h-10 rounded-md"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div className="text-primary text-2xl">
//                       <CiImageOn />
//                     </div>
//                   ))}
//                 <span className="text-md">
//                   {isEditing && selectedItems.includes(item._id) ? (
//                     <input
//                       type="text"
//                       value={editedData[item._id]?.name || ""}
//                       onChange={(e) =>
//                         handleChange(item._id, "name", e.target.value)
//                       }
//                       className="p-1 border rounded-md"
//                     />
//                   ) : (
//                     item?.name || item?.name
//                   )}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-4">
//                 {headings.map((heading) => (
//                   <span key={heading.dataKey}>
//                     {heading.render ? (
//                       heading.render(
//                         item,
//                         isEditing && selectedItems.includes(item._id),
//                         (key, value) => handleChange(item._id, key, value)
//                       )
//                     ) : isEditing && selectedItems.includes(item._id) ? (
//                       <input
//                         type="text"
//                         value={editedData[item._id]?.[heading.dataKey] || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             item._id,
//                             heading.dataKey,
//                             e.target.value
//                           )
//                         }
//                         className="p-1 border rounded-md"
//                       />
//                     ) : (
//                       item[heading.dataKey] || item[heading.dataKey]
//                     )}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <CButton
//         type="button"
//         variant={ButtonType.Outlined}
//         onClick={onAddClick}
//         className="w-full mt-2 mb-2"
//       >
//         <div className="flex justify-center items-center">
//           {buttonText}
//           <IoIosAddCircleOutline className="text-xl ml-1" />
//         </div>
//       </CButton>
//     </div>
//   );
// };

// export default FormAddTable;
