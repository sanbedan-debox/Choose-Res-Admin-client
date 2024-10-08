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
import { MdOutlineEdit } from "react-icons/md";

const Items: React.FC = () => {
  const [items, setItems] = useState<
    { name: string; desc: string; status: string; price: number }[]
  >([]);

  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);

  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );

  const { setToastData } = useGlobalStore();
  const { setIsAddItemModalOpen, refreshMenuBuilderData } =
    useMenuOptionsStore();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [tableLoading, setTableLoading] = useState(false);

  const fetchMenuItems = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getItems();
      if (response && response.getItems) {
        setItems(
          response.getItems.map((el: any) => ({
            _id: el._id,
            name: el.name,
            desc: el.desc,
            status: el.status,
            price: el.price,
          }))
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

  const { setEditItemId, setIsEditItem, setIsDuplicateItem } =
    useMenuItemsStore();

  const handleEditItem = (_id: string) => {
    setIsAddItemModalOpen(true);
    setEditItemId(_id);
    setIsEditItem(true);
    setIsDuplicateItem(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setIsAddItemModalOpen(true);
    setEditItemId(_id);
    setIsDuplicateItem(true);
    setIsEditItem(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, [refreshMenuBuilderData, setToastData]);

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
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
      onClick: () => setIsAddItemModalOpen(true),
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

  const handleStatusCloseConfirmationModal = () => {
    setShowStatusConfirmationModal(false);
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
    </div>
  );
};

export default Items;
