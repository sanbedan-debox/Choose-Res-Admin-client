import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import CBTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuStore from "@/store/menu";
import useRestaurantsStore from "@/store/restaurant";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Categories: React.FC = () => {
  const [cats, setCats] = useState<
    { name: string; desc: string; items: number; _id: string }[]
  >([]);
  const { setToastData } = useGlobalStore();
  const { setisAddCategoryModalOpen, fetchMenuDatas } = useMenuStore();
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const fetchCategories = async () => {
    // setLoading(true);
    try {
      const response = await sdk.getCategories();
      if (response && response.getCategories) {
        // const formattedRestaurant = response.getAllMenus.map((res) => ({
        //   ...res,
        // }));
        // setMenu(formattedRestaurant);
        setCats(
          response.getCategories.map((el) => ({
            desc: el.desc.value,
            items: el.items.length,
            name: el.name.value,
            _id: el._id,
          }))
        );
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [fetchMenuDatas, setToastData]);
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );

  const handleToggleSwitch = (rowData: { status: string; _id: string }) => {
    setShowStatusConfirmationModal(true);
    setSelectedItemId(rowData._id);

    setAvailableCaption(
      rowData.status === StatusEnum.Inactive
        ? "are you sure you want to activate the item?"
        : "are you sure you want to block the item?"
    );
  };

  const renderSwitch = (rowData: { status: StatusEnum; _id: string }) => (
    <div>
      <CustomSwitch
        checked={rowData.status !== StatusEnum.Inactive}
        onChange={() => handleToggleSwitch(rowData)}
        label={`Toggle switch for ${rowData._id}`}
      />
    </div>
  );
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => console.log("Edit", rowData._id)}
      />
      <FaShieldAlt
        className="text-green-500 cursor-pointer"
        onClick={() => console.log("Change Password", rowData._id)}
      />
    </div>
  );

  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption("are you sure you want to delete this item?");
  };

  const headings = [
    { title: "Toggle Availibility", dataKey: "status", render: renderSwitch },
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Items", dataKey: "items" },
    { title: "Actions", dataKey: "name.value", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Category",
      onClick: () => setisAddCategoryModalOpen(true),
    },
  ];
  const handleStatusCloseConfirmationModal = () => {
    setShowStatusConfirmationModal(false);
    setSelectedItemId("");
  };
  const handleStatusConfirmation = async () => {
    setShowStatusConfirmationModal(false);
    try {
      const response = await sdk.changeCategoryStatus({ id: selectedItemId });
      if (response && response.changeCategoryStatus) {
        fetchCategories();
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedItemId("");
  };
  const handleDeleteConfirmation = async () => {
    setshowDeleteConfirmationModal(false);
    try {
      const response = await sdk.deleteCategory({ id: selectedItemId });
      if (response && response.deleteCategory) {
        fetchCategories();
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={10}
        headings={headings}
        data={cats}
        // data={menuItems}
        // showAvailableSwitch
        // actions={renderActions}
        mainActions={mainActions}
      />

      {/* Status confirmation modal */}
      <ReusableModal
        isOpen={showStatusConfirmationModal}
        onClose={handleStatusCloseConfirmationModal}
        title="Are you sure ?"
        comments={availableCaption}
      >
        <div className="flex justify-end space-x-4">
          <CButton
            variant={ButtonType.Primary}
            // className=""
            onClick={handleStatusConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>

      {/* DELETE ITEM MODAL */}
      <ReusableModal
        isOpen={showDeleteConfirmationModal}
        onClose={handleDeleteCloseConfirmationModal}
        title="Are you sure ?"
        comments={availableCaption}
      >
        <div className="flex justify-end space-x-4">
          <CButton
            variant={ButtonType.Primary}
            // className=""
            onClick={handleDeleteConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default Categories;
