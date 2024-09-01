import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import { sdk } from "@/utils/graphqlClient";
import React, { useState } from "react";

import {
  CloverCategories,
  CloverInventory,
  CloverItems,
  CloverRowItem,
  CloverRowItemModifier,
  CloverRowItemModifierGroup,
  CloverRowItemOptions,
  ItemOptionsEnum,
} from "@/generated/graphql";
import {
  useCloverCategoryStore,
  useCloverItemStore,
  useCloverModifierGroupStore,
  useCloverModifierStore,
} from "@/store/cloverStores";
import useGlobalStore from "@/store/global";
import useMenuPageStore from "@/store/menuStore";
import { extractErrorMessage } from "@/utils/utilFUncs";
import CategoryTable from "../tables/categoryTable";
import ItemTable from "../tables/ItemTable";
import ModifierGroupTable from "../tables/modifierGroupTable";
import ModifierTable from "../tables/modifierTable";

const CloverPullForm: React.FC = () => {
  // config
  // Global States
  const { categories, setCategories } = useCloverCategoryStore();
  const { items, setItems } = useCloverItemStore();
  const { modifierGroups, setModifierGroups } = useCloverModifierGroupStore();
  const { modifiers, setModifiers } = useCloverModifierStore();
  const { setToastData } = useGlobalStore();
  const { setIsShowCloverModal } = useMenuPageStore();
  // Local States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "Category" | "Items" | "Modifier Groups" | "Modifiers"
  >("Category");

  // API calls
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

  // Helper Functions

  const transformToClientItems = (
    cloverInventory: CloverInventory
  ): CloverRowItem[] => {
    const { categories, items, modifierGroups, modifiers } = cloverInventory;

    // Create maps for quick lookup
    const categoriesMap = new Map(categories.map((cat) => [cat.id, cat]));
    const modifierGroupsMap = new Map(
      modifierGroups.map((group) => [group.id, group])
    );
    const modifiersMap = new Map(modifiers.map((mod) => [mod.id, mod]));

    const clientItems: CloverRowItem[] = items.map((item) => {
      // Find categories for the item
      const itemCategories = Array.from(categoriesMap.values())
        .filter((category) => category.items.includes(item.id))
        .map((category) => ({
          name: category.name,
          status: category.status,
        }));

      // Find modifier groups for the item
      const itemModifierGroups = item.modifierGroups
        .map((groupId) => {
          const group = modifierGroupsMap.get(groupId);
          if (!group) return null; // Defensive check
          const groupModifiers = group.modifiers
            .map((modId) => {
              const mod = modifiersMap.get(modId);
              if (!mod) return null; // Defensive check
              return {
                name: mod.name,
                price: mod.price,
              };
            })
            .filter(Boolean) as CloverRowItemModifier[];

          return {
            name: group.name,
            minRequired: group.minRequired ?? 0,
            maxRequired: group.maxRequired ?? 1,
            modifiers: groupModifiers,
          };
        })
        .filter(Boolean) as CloverRowItemModifierGroup[];

      // Map item options to CloverRowItemOptions
      // const itemOptions: CloverRowItemOptions[] = [
      //   { type: ItemOptionsEnum.PopularItem, status: item["Popular Item"] },
      //   { type: ItemOptionsEnum.UpSellItem, status: item["UpSell Item"] },
      //   { type: ItemOptionsEnum.IsVegan, status: item.IsVegan },
      //   { type: ItemOptionsEnum.HasNuts, status: item.HasNuts },
      //   { type: ItemOptionsEnum.IsGlutenFree, status: item.IsGlutenFree },
      //   { type: ItemOptionsEnum.IsHalal, status: item.IsHalal },
      //   { type: ItemOptionsEnum.IsSpicy, status: item.IsSpicy },
      // ];
      const itemOptions: CloverRowItemOptions[] = [
        {
          type: ItemOptionsEnum.PopularItem,
          status: (item as any)["Popular Item"],
        },
        {
          type: ItemOptionsEnum.UpSellItem,
          status: (item as any)["UpSell Item"],
        },
        { type: ItemOptionsEnum.IsVegan, status: (item as any).IsVegan },
        { type: ItemOptionsEnum.HasNuts, status: (item as any).HasNuts },
        {
          type: ItemOptionsEnum.IsGlutenFree,
          status: (item as any).IsGlutenFree,
        },
        { type: ItemOptionsEnum.IsHalal, status: (item as any).IsHalal },
        { type: ItemOptionsEnum.IsSpicy, status: (item as any).IsSpicy },
      ];

      // Create ClientItem
      return {
        name: item.name,
        price: item.price,
        status: item.status,
        categories: itemCategories,
        modifierGroups: itemModifierGroups,
        options: itemOptions,
      };
    });

    return clientItems;
  };

  // Handler Functions
  const handleNextStep = () => {
    if (step === 1) {
      fetchData();
      setStep(2);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const clientItems = await transformToClientItems({
        categories: categories as CloverCategories[],
        items: items as CloverItems[],
        modifierGroups: modifierGroups as ModifierGroup[],
        modifiers: modifiers as Modifier[],
      });
      const res = await sdk.saveCloverData({
        rowItems: clientItems,
      });
      if (res && res.saveCloverData) {
        setToastData({
          message: "Menu Saved Successfully",
          type: "success",
        });
        setIsShowCloverModal(false);
      }
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
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

              <div className="flex space-x-4">
                <CButton
                  variant={ButtonType.Primary}
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 w-full"
                >
                  Preview/Edit Data
                </CButton>
                <CButton
                  variant={ButtonType.Primary}
                  onClick={() => {
                    // Transform and save data when Save is clicked
                    handleSubmit();
                  }}
                  className="mt-4 w-full"
                >
                  Save Data
                </CButton>
              </div>
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
                      ? "bg-primary text-white border-b-2 border-primary"
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
