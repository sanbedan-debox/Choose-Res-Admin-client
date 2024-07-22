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
import { extractErrorMessage, generateUniqueName } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoDuplicateOutline } from "react-icons/io5";

const Categories: React.FC = () => {
  const [cats, setCats] = useState<
    { name: string; desc: string; items: number; _id: string; status: string }[]
  >([]);
  const { setToastData } = useGlobalStore();
  const { setisAddCategoryModalOpen, fetchMenuDatas } = useMenuOptionsStore();
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const fetchCategories = async () => {
    try {
      setTableLoading(true);
      const response = await sdk.getCategories();
      if (response && response.getCategories) {
        setCats(
          response.getCategories.map((el) => ({
            desc: el.desc.value,
            items: el.items.length,
            name: el.name.value,
            _id: el._id,
            status: el.status,
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
    fetchCategories();
  }, [fetchMenuDatas, setToastData]);
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState("");
  const [duplicatedItem, setDuplicatedItem] = useState<{
    _id: string;
    name: { value: string };
    desc: { value: string };
    status: string;
    items: Array<{
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  const handleDuplicateItem = async (_id: string) => {
    try {
      const response = await sdk.getCategory({ id: _id });
      const item = response.getCategory;
      if (item) {
        await setDuplicatedItem({
          _id: item._id,
          name: item.name,
          desc: item.desc,
          status: item.status,
          items: item.items.map((i) => ({
            _id: i.id,
          })),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }
      setBtnLoading(true);
      if (response) {
        const selectedIds: string[] =
          duplicatedItem?.items.map((item) => item._id) || [];
        const newName = generateUniqueName(duplicatedItem?.name?.value || "");
        const res = await sdk.addCategory({
          input: {
            name: {
              value: newName,
            },
            desc: {
              value: duplicatedItem?.desc?.value || "",
            },
            items: selectedIds,
          },
        });
      }
      fetchCategories();

      // Handle response as needed
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

  const { seteditCatsId, setisEditCats } = useMenuCategoryStore();
  const handleEditCategory = (_id: string) => {
    setisAddCategoryModalOpen(true);
    seteditCatsId(_id);
    setisEditCats(true);
  };
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditCategory(rowData._id)}
      />
      <IoDuplicateOutline
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplicateItem(rowData._id)}
      />
    </div>
  );

  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption(
      "By clicking yes the selected Category / Categories will be deleted. This action cannot be undone."
    );
  };

  const headings = [
    { title: "Toggle Availibility", dataKey: "status", render: renderSwitch },
    { title: "Name", dataKey: "name" },
    // { title: "id", dataKey: "_id" },
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
  const [btnLoading, setBtnLoading] = useState(false);

  const handleStatusConfirmation = async () => {
    setBtnLoading(true);
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
    } finally {
      setBtnLoading(true);
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

export default Categories;
