// import CButton from "@/components/common/button/button";
// import { ButtonType } from "@/components/common/button/interface";
// import FullPageModal from "@/components/common/modal/fullPageModal";
// import { sdk } from "@/utils/graphqlClient";
// import React, { useState } from "react";
// import {
//   useCloverCategoryStore,
//   useCloverItemStore,
//   useCloverModifierGroupStore,
//   useCloverModifierStore,
// } from "../../../../../store/cloverStores";
// import CategoryTable from "../tables/categoryTable";
// import ItemTable from "../tables/ItemTable";
// import ModifierGroupTable from "../tables/modifierGroupTable";
// import ModifierTable from "../tables/modifierTable";

// const CloverPullForm: React.FC = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const { categories, setCategories } = useCloverCategoryStore();
//   const { items, setItems } = useCloverItemStore();
//   const { modifierGroups, setModifierGroups } = useCloverModifierGroupStore();
//   const { modifiers, setModifiers } = useCloverModifierStore();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState<
//     "Category" | "Items" | "Modifier Groups" | "Modifiers"
//   >("Category");

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await sdk.FetchCloverInventory();
//       const { categories, items, modifiers, modifierGroups } =
//         response.fetchCloverInventory;

//       setCategories(categories.map((cat: any) => ({ ...cat })));
//       setItems(
//         items.map((item: any) => ({
//           ...item,
//           "Online Ordering": item.status,
//           "Dine In": item.status,
//           Catering: item.status,
//           "Item Limit": 0,
//           "Popular Item": false,
//           "UpSell Item": false,
//           IsVegan: false,
//           HasNuts: false,
//           IsGlutenFree: false,
//           IsHalal: false,
//           IsSpicy: false,
//         }))
//       );
//       setModifierGroups(modifierGroups.map((group: any) => ({ ...group })));
//       setModifiers(modifiers.map((mod: any) => ({ ...mod })));
//       console.log(modifierGroups);
//       console.log(items);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNextStep = () => {
//     if (step === 1) {
//       fetchData();
//       setStep(2);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-8">
//       {step === 1 && (
//         <div>
//           <div className="space-y-4">
//             <iframe
//               width="560"
//               height="315"
//               src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
//               title="YouTube video player"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             ></iframe>
//             <div className="text-gray-700">
//               <p>Follow the guidelines to pull data from Clover.</p>
//               <ul className="list-disc pl-5">
//                 <li>Step 1: Instruction 1</li>
//                 <li>Step 2: Instruction 2</li>
//                 <li>Step 3: Instruction 3</li>
//               </ul>
//             </div>
//           </div>
//           <CButton variant={ButtonType.Primary} onClick={handleNextStep}>
//             Next
//           </CButton>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="loader"></div>{" "}
//               {/* Replace with your loading spinner */}
//             </div>
//           ) : (
//             <div className="text-center">
//               <p>Categories: {categories?.length || 0}</p>
//               <p>Items: {items?.length || 0}</p>
//               <p>Modifier Groups: {modifierGroups?.length || 0}</p>
//               <p>Modifiers: {modifiers?.length || 0}</p>
//               <CButton
//                 variant={ButtonType.Primary}
//                 onClick={() => setIsModalOpen(true)}
//               >
//                 Preview Data
//               </CButton>
//             </div>
//           )}
//         </div>
//       )}

//       <FullPageModal
//         actionButtonLabel=""
//         onActionButtonClick={() => {}}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title="Preview Data"
//       >
//         <div className="space-y-4">
//           <div className="flex justify-around">
//             {["Category", "Items", "Modifier Groups", "Modifiers"].map(
//               (section) => (
//                 <button
//                   key={section}
//                   className={`${
//                     activeSection === section
//                       ? "text-blue-600"
//                       : "text-gray-600"
//                   }`}
//                   onClick={() => setActiveSection(section as any)}
//                 >
//                   {section}
//                 </button>
//               )
//             )}
//           </div>

//           {activeSection === "Category" && categories && <CategoryTable />}

//           {activeSection === "Items" && items && <ItemTable />}

//           {activeSection === "Modifier Groups" && modifierGroups && (
//             <ModifierGroupTable />
//           )}

//           {activeSection === "Modifiers" && modifiers && <ModifierTable />}
//         </div>
//       </FullPageModal>
//     </div>
//   );
// };

// export default CloverPullForm;

import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import { sdk } from "@/utils/graphqlClient";
import React, { useState } from "react";

import {
  useCloverCategoryStore,
  useCloverItemStore,
  useCloverModifierGroupStore,
  useCloverModifierStore,
} from "@/store/cloverStores";
import CategoryTable from "../tables/categoryTable";
import ItemTable from "../tables/ItemTable";
import ModifierGroupTable from "../tables/modifierGroupTable";
import ModifierTable from "../tables/modifierTable";

const CloverPullForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { categories, setCategories } = useCloverCategoryStore();
  const { items, setItems } = useCloverItemStore();
  const { modifierGroups, setModifierGroups } = useCloverModifierGroupStore();
  const { modifiers, setModifiers } = useCloverModifierStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "Category" | "Items" | "Modifier Groups" | "Modifiers"
  >("Category");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await sdk.FetchCloverInventory();
      const { categories, items, modifiers, modifierGroups } =
        response.fetchCloverInventory;

      setCategories(categories.map((cat: any) => ({ ...cat })));
      setItems(
        items.map((item: any) => ({
          ...item,
          "Online Ordering": item.status,
          "Dine In": item.status,
          Catering: item.status,
          "Item Limit": 0,
          "Popular Item": false,
          "UpSell Item": false,
          IsVegan: false,
          HasNuts: false,
          IsGlutenFree: false,
          IsHalal: false,
          IsSpicy: false,
        }))
      );
      setModifierGroups(modifierGroups.map((group: any) => ({ ...group })));
      setModifiers(modifiers.map((mod: any) => ({ ...mod })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      fetchData();
      setStep(2);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-8">
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

      {step === 1 && (
        <div className="space-y-10 text-center">
          <div className="w-full mx-auto">
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64"
            ></iframe>
          </div>

          <div className="text-left">
            <h2 className="text-lg font-semibold">CSV Upload Rules</h2>
            <ul className="list-disc list-inside text-md">
              <li>The file must be in CSV format.</li>
              <li>Ensure all required fields are filled.</li>
              <li>Follow the template provided in the second step.</li>
              <li>{`Don't keep additional fields.`}</li>
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

      {step === 2 && (
        <div className="text-center space-y-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="loader mb-4"></div>{" "}
              {/* Replace with your loading spinner */}
              <p className="text-lg font-semibold text-gray-700">
                Fetching Clover Data...
              </p>
              <p className="text-gray-500">
                Please wait while we retrieve the latest data from Clover.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h2 className="text-md font-bold text-gray-900">
                  Data Fetched Successfully!
                </h2>
                <p className="text-sm text-gray-700">
                  We have successfully retrieved the data from Clover. Here is a
                  summary of the information:
                </p>
                <div className="bg-white rounded-lg p-6  ">
                  <p className="text-md font-medium text-gray-800">
                    Categories:{" "}
                    <span className="font-bold">{categories?.length || 0}</span>
                  </p>
                  <p className="text-md font-medium text-gray-800">
                    Items:{" "}
                    <span className="font-bold">{items?.length || 0}</span>
                  </p>
                  <p className="text-md font-medium text-gray-800">
                    Modifier Groups:{" "}
                    <span className="font-bold">
                      {modifierGroups?.length || 0}
                    </span>
                  </p>
                  <p className="text-md font-medium text-gray-800">
                    Modifiers:{" "}
                    <span className="font-bold">{modifiers?.length || 0}</span>
                  </p>
                </div>
                <p className="text-gray-600">
                  You can now preview the data and make any necessary edits.
                  Click on the button below to review the data.
                </p>
              </div>
              <CButton
                variant={ButtonType.Primary}
                onClick={() => setIsModalOpen(true)}
                className="mt-4"
              >
                Preview Data
              </CButton>
            </>
          )}
        </div>
      )}

      <FullPageModal
        actionButtonLabel=""
        onActionButtonClick={() => {}}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Preview Data"
      >
        <div className="space-y-4">
          <div className="flex space-x-4 border-gray-200 pb-2">
            {["Category", "Items", "Modifier Groups", "Modifiers"].map(
              (section) => (
                <button
                  key={section}
                  className={`px-4 py-2 text-sm font-semibold rounded-md ${
                    activeSection === section
                      ? "bg-blue-600 text-white border-b-2 border-blue-600"
                      : "bg-gray-100 text-gray-600"
                  } transition-colors duration-200 ease-in-out`}
                  onClick={() => setActiveSection(section as any)}
                >
                  {section}
                </button>
              )
            )}
          </div>

          {activeSection === "Category" && categories && <CategoryTable />}
          {activeSection === "Items" && items && <ItemTable />}
          {activeSection === "Modifier Groups" && modifierGroups && (
            <ModifierGroupTable />
          )}
          {activeSection === "Modifiers" && modifiers && <ModifierTable />}
        </div>
      </FullPageModal>
    </div>
  );
};

export default CloverPullForm;
