import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuItemsStore from "@/store/menuItems";
import useMenuOptionsStore from "@/store/menuOptions";

import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Items: React.FC = () => {
  const [items, setItems] = useState<
    { name: string; desc: string; status: string; price: number }[]
  >([]);

  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );

  const { setToastData } = useGlobalStore();
  const { setisAddItemModalOpen, fetchMenuDatas } = useMenuOptionsStore();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [tableLoading, setTableLoading] = useState(false);

  const fetchMenuItems = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getItems();
      if (response && response.getItems) {
        setItems(
          response.getItems.map((el) => ({
            _id: el._id,
            name: el.name.value,
            desc: el.desc.value,
            status: el.status,
            price: el.price.value,
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
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuDatas, setToastData]);

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
      <FaShieldAlt
        className="text-green-500 cursor-pointer"
        // onClick={() => console.log("Change Password", rowData._id)}
      />
    </div>
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
  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption(
      " By clicking yes the selected Item / Items will be deleted. This action cannot be undone."
    );
  };

  const { setEditItemId, setisEditItem } = useMenuItemsStore();

  const handleEditItem = (_id: string) => {
    setisAddItemModalOpen(true);
    setEditItemId(_id);
    setisEditItem(true);
  };

  const renderSwitch = (rowData: { status: StatusEnum; _id: string }) => (
    <div>
      <CustomSwitch
        checked={rowData.status === StatusEnum.Active}
        onChange={() => handleToggleSwitch(rowData)}
        label={`Toggle switch for ${rowData._id}`}
      />
    </div>
  );

  const headings = [
    { title: "Toggle Availibility", dataKey: "status", render: renderSwitch },
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Price", dataKey: "price" },
    // { title: "Description", dataKey: "desc" },
    { title: "Actions", dataKey: "name.value", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Item",
      onClick: () => setisAddItemModalOpen(true),
    },
  ];
  const [btnLoading, setBtnLoading] = useState(false);

  const handleStatusConfirmation = async () => {
    setBtnLoading(true);
    setShowStatusConfirmationModal(false);
    try {
      const response = await sdk.changeItemStatus({ id: selectedItemId });
      if (response && response.changeItemStatus) {
        fetchMenuItems();
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };
  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.deleteItem({ id: selectedItemId });
      if (response && response.deleteItem) {
        fetchMenuItems();
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
      setshowDeleteConfirmationModal(false);
    }
  };
  const handleStatusCloseConfirmationModal = () => {
    setShowStatusConfirmationModal(false);
    setSelectedItemId("");
  };
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedItemId("");
  };
  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={20}
        loading={tableLoading}
        headings={headings}
        data={items}
        mainActions={mainActions}
      />

      {/* STATUS CHANGE MODAL */}
      <ReusableModal
        isOpen={showStatusConfirmationModal}
        onClose={handleStatusCloseConfirmationModal}
        title="Are you sure ?"
        comments={availableCaption}
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
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
            loading={btnLoading}
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

export default Items;
