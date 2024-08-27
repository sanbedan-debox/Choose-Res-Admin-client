import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import { MenuTypeEnum, StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuMenuStore from "@/store/menumenu";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { BsCopy } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

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
  const { setisAddMenuModalOpen, refreshMenuBuilderData, setIsFromUploadCSV } =
    useMenuOptionsStore();
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState("");

  const { setToastData } = useGlobalStore();
  const [tableLoading, setTableLoading] = useState(false);
  const { setEditMenuId, setisEditMenu, setisDuplicateMenu } =
    useMenuMenuStore();

  const fetchAllMenus = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getAllMenus();
      if (response && response.getAllMenus) {
        setMenu(
          response.getAllMenus.map(
            (el: {
              name: string;
              status: string;
              type: MenuTypeEnum;
              _id: string;
              categories: {
                name?: string | null;
              }[];
            }) => ({
              name: el.name,
              categories: el.categories.length,
              status: el.status,
              type: el.type.toString(),
              _id: el._id,
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
  useEffect(() => {
    fetchAllMenus();
  }, [refreshMenuBuilderData, setToastData]);

  const handleEditMenu = (_id: string) => {
    setisAddMenuModalOpen(true);
    setIsFromUploadCSV(false);
    setEditMenuId(_id);
    setisEditMenu(true);
    setisDuplicateMenu(false);
  };

  const handleDuplcateMenu = (_id: string) => {
    setisAddMenuModalOpen(true);
    setIsFromUploadCSV(false);
    setEditMenuId(_id);
    setisDuplicateMenu(true);
    setisEditMenu(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditMenu(rowData._id)}
      />

      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateMenu(rowData._id)}
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

  const formatType = (type: MenuTypeEnum): string => {
    switch (type) {
      case MenuTypeEnum.Catering:
        return "Catering";
      case MenuTypeEnum.DineIn:
        return "Dine In";
      case MenuTypeEnum.OnlineOrdering:
        return "Online Ordering";

      default:
        return "";
    }
  };

  const headings = [
    { title: "Name", dataKey: "name" },
    {
      title: "Type",
      dataKey: "type",
      render: (rowData: { type: MenuTypeEnum }) => {
        return <p>{formatType(rowData.type)}</p>;
      },
    },
    { title: "Categories", dataKey: "categories" },
    { title: "Toggle Status", dataKey: "status", render: renderSwitch },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Menu",
      onClick: () => {
        setisAddMenuModalOpen(true);
        setIsFromUploadCSV(false);
      },
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
    </div>
  );
};

export default Menu;
