import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { BsCopy } from "react-icons/bs";

import { MdOutlineEdit } from "react-icons/md";

const Categories: React.FC = () => {
  const [cats, setCats] = useState<
    { name: string; desc: string; items: number; _id: string; status: string }[]
  >([]);
  const { setToastData } = useGlobalStore();
  const { setisAddCategoryModalOpen, fetchMenuDatas } = useMenuOptionsStore();

  const [tableLoading, setTableLoading] = useState(false);
  const fetchCategories = async () => {
    try {
      setTableLoading(true);
      const response = await sdk.getCategories();
      if (response && response.getCategories) {
        setCats(
          response.getCategories.map(
            (el: {
              desc: string;
              name: string;
              _id: string;
              status: string;
              items: {
                name?: string | null;
                _id: {
                  __typename?: "Item";
                  _id: string;
                };
              }[];
            }) => ({
              desc: el.desc,
              items: el.items.length,
              name: el.name,
              _id: el._id,
              status: el.status,
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
    fetchCategories();
  }, [fetchMenuDatas, setToastData]);
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState("");

  const handleToggleSwitch = (rowData: { status: string; _id: string }) => {
    setShowStatusConfirmationModal(true);
    setSelectedItemId(rowData._id);

    setAvailableCaption(
      rowData.status === StatusEnum.Inactive
        ? "Turning of the category would turn on all the items of the category for the selected menu template. Click Yes to proceed."
        : "Turning of the category would turn off all the items of the category for the selected menu template. Click Yes to proceed."
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

  const { seteditCatsId, setisEditCats, setisDuplicateCats } =
    useMenuCategoryStore();

  const handleEditCategory = (_id: string) => {
    setisAddCategoryModalOpen(true);
    seteditCatsId(_id);
    setisEditCats(true);
    setisDuplicateCats(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setisAddCategoryModalOpen(true);
    seteditCatsId(_id);
    setisDuplicateCats(true);
    setisEditCats(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditCategory(rowData._id)}
      />

      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      />
    </div>
  );

  const headings = [
    { title: "Name", dataKey: "name" },
    // { title: "id", dataKey: "_id" },
    { title: "Desc", dataKey: "desc" },
    { title: "Items", dataKey: "items" },
    { title: "Toggle Status", dataKey: "status", render: renderSwitch },
    { title: "Actions", dataKey: "name", render: renderActions },
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
  const [btnLoading, setBtnLoading] = useState(false);

  const handleStatusConfirmation = async () => {
    setBtnLoading(true);
    setShowStatusConfirmationModal(false);
    try {
      const response = await sdk.changeCategoryStatus({ id: selectedItemId });
      if (response && response.changeCategoryStatus) {
        fetchCategories();
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

export default Categories;
