import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import CBTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuMenuStore from "@/store/menumenu";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt, FaCopy } from "react-icons/fa";

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<
    {
      name: string;
      type: string;
      categories: number;
      status: string;
      _id: string;
    }[]
  >([]);
  const { setisAddMenuModalOpen, fetchMenuDatas } = useMenuOptionsStore();
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState("");
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const { setToastData } = useGlobalStore();
  const [tableLoading, setTableLoading] = useState(false);
  const { setEditMenuId, setisEditMenu } = useMenuMenuStore();

  const fetchAllMenus = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getMenuByRestaurant();
      if (response && response.getMenuByRestaurant) {
        setMenu(
          response.getMenuByRestaurant.map((el) => ({
            name: el.name.value,
            categories: el.categories.length,
            status: el.status,
            type: el.type.toString(),
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
      setTableLoading(false);
    }
  };
  useEffect(() => {
    fetchAllMenus();
  }, [fetchMenuDatas, setToastData]);

  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption(
      " By clicking yes the selected Menu / Menus will be deleted. This action cannot be undone."
    );
  };

  const handleEditMenu = (_id: string) => {
    setisAddMenuModalOpen(true);
    setEditMenuId(_id);
    setisEditMenu(true);
  };
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => handleEditMenu(rowData._id)}
      />
      <FaCopy
        className="text-green-500 cursor-pointer"
        onClick={() => console.log("Duplicate", rowData._id)}
      />
    </div>
  );

  const handleToggleSwitch = (rowData: { status: string; _id: string }) => {
    setShowStatusConfirmationModal(true);
    setSelectedItemId(rowData._id);
    setAvailableCaption(
      rowData.status === StatusEnum.Inactive
        ? "Turning of the Menu would turn on all the items of the Menu for the selected menu template. Click Yes to proceed."
        : "Turning of the Menu would turn off all the items of the Menu for the selected menu template. Click Yes to proceed."
    );
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
    { title: "Type", dataKey: "type" },
    { title: "Categories", dataKey: "categories" },
    { title: "Actions", dataKey: "name.value", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Menu",
      onClick: () => setisAddMenuModalOpen(true),
    },
  ];

  const handleStatusCloseConfirmationModal = () => {
    setShowStatusConfirmationModal(false);
    setSelectedItemId("");
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const handleStatusConfirmation = async () => {
    setBtnLoading(true);
    setShowStatusConfirmationModal(false);
    try {
      const response = await sdk.changeMenuStatus({ id: selectedItemId });
      if (response && response.changeMenuStatus) {
        fetchAllMenus();
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
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedItemId("");
  };

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    setshowDeleteConfirmationModal(false);
    try {
      const response = await sdk.deleteMenu({ id: selectedItemId });
      if (response && response.deleteMenu) {
        fetchAllMenus();
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

  return (
    <div className="py-2">
      <RoopTable
        loading={tableLoading}
        itemsPerPage={10}
        headings={headings}
        data={menu}
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
            loading={btnLoading}
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
        title="Are you sure?"
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

export default Menu;
