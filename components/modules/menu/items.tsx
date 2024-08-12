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
import { BsCopy } from "react-icons/bs";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";
import { IoDuplicateOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

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
          response.getItems.map(
            (el: {
              _id: string;
              name: string;
              desc: string;
              status: string;
              price: number;
            }) => ({
              _id: el._id,
              name: el.name,
              desc: el.desc,
              status: el.status,
              price: el.price,
            })
          )
        );
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setTableLoading(false);
    }
  };

  const { setEditItemId, setisEditItem, setisDuplicateItem } =
    useMenuItemsStore();

  const handleEditItem = (_id: string) => {
    setisAddItemModalOpen(true);
    setEditItemId(_id);
    setisEditItem(true);
    setisDuplicateItem(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setisAddItemModalOpen(true);
    setEditItemId(_id);
    setisDuplicateItem(true);
    setisEditItem(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuDatas, setToastData]);

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      {/* <FaTrash
        className="text-primary text-md cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      /> */}
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />

      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
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

  const renderSwitch = (rowData: { status: StatusEnum; _id: string }) => (
    <div className="">
      <CustomSwitch
        checked={rowData.status === StatusEnum.Active}
        onChange={() => handleToggleSwitch(rowData)}
        label={`Toggle switch for ${rowData._id}`}
      />
    </div>
  );

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Price", dataKey: "price" },
    {
      title: "Toggle Status",
      dataKey: "name",
      render: renderSwitch,
    },
    {
      title: "Actions",
      dataKey: "name",
      render: renderActions,
    },
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
    } catch (error) {
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
    } catch (error) {
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
