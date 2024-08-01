// import { useState } from "react";

// const ReusableItemModal = ({ show, onClose, items, onSelectItem }) => {
//   const [search, setSearch] = useState("");

//   const filteredItems = items.filter((item) =>
//     item.name.value.toLowerCase().includes(search.toLowerCase())
//   );

//   if (!show) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Select an Item</h2>
//           <button onClick={onClose}>Close</button>
//         </div>
//         <div className="modal-body">
//           <input
//             type="text"
//             placeholder="Search items..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="input"
//           />
//           <ul className="item-list">
//             {filteredItems.map((item) => (
//               <li
//                 key={item._id}
//                 onClick={() => onSelectItem(item)}
//                 className="item"
//               >
//                 <span>{item.name.value}</span>
//                 <span>{item.price.value}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReusableItemModal;
