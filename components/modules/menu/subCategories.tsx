import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";

import React, { useEffect, useState } from "react";

const SubCategories: React.FC = () => {
  const [cats, setCats] = useState<
    { name: string; desc: string; items: number; _id: string; status: string }[]
  >([]);
  const { setToastData } = useGlobalStore();
  const { setisAddSubCategoryModalOpen, fetchMenuDatas } =
    useMenuOptionsStore();
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // const fetchCategories = async () => {
  //   try {
  //     setTableLoading(true);
  //     const response = await sdk.getCategories();
  //     if (response && response.getCategories) {
  //       setCats(
  //         response.getCategories.map((el) => ({
  //           desc: el.desc.value,
  //           items: el.items.length,
  //           name: el.name.value,
  //           _id: el._id,
  //           status: el.status,
  //         }))
  //       );
  //       setCategories(
  //         response.getCategories.map((el) => ({
  //           value: el._id,
  //           label: el.name.value,
  //         }))
  //       );
  //     }
  //   } catch (error: any) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setTableLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, [fetchMenuDatas, setToastData]);

  // const handleEditSubCategory = async (_id: string) => {
  //   setIsEdit(true);
  //   setSubCategoryId(_id);
  //   try {
  //     const response = await sdk.getSubCategory({ id: _id });
  //     if (response && response.getSubCategory) {
  //       const subCategory = response.getSubCategory;
  //       setSubCategoryName(subCategory.name);
  //       setSelectedCategories(
  //         subCategory.categories.map((cat: any) => ({
  //           value: cat._id,
  //           label: cat.name,
  //         }))
  //       );
  //     }
  //   } catch (error: any) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   }
  //   setisAddCategoryModalOpen(true);
  // };

  // const handleAddSubCategory = () => {
  //   setIsEdit(false);
  //   setSubCategoryId("");
  //   setSubCategoryName("");
  //   setSelectedCategories([]);
  //   setisAddSubCategoryModalOpen(true);
  // };

  // const handleSubmit = async () => {
  //   try {
  //     if (isEdit) {
  //       await sdk.updateSubCategory({
  //         id: subCategoryId,
  //         name: subCategoryName,
  //         categories: selectedCategories.map((cat) => cat.value),
  //       });
  //     } else {
  //       await sdk.addSubCategory({
  //         name: subCategoryName,
  //         categories: selectedCategories.map((cat) => cat.value),
  //       });
  //     }
  //     fetchCategories();
  //     setToastData({
  //       type: "success",
  //       message: `SubCategory ${isEdit ? "updated" : "added"} successfully.`,
  //     });
  //   } catch (error: any) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setisAddCategoryModalOpen(false);
  //   }
  // };

  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    // setSelectedItemId(_id);
    // setAvailableCaption(
    //   "By clicking yes the selected Category / Categories will be deleted. This action cannot be undone."
    // );
  };

  // const handleToggleSwitch = (rowData: { status: string; _id: string }) => {
  //   setShowStatusConfirmationModal(true);
  //   setSelectedItemId(rowData._id);

  //   setAvailableCaption(
  //     rowData.status === StatusEnum.Inactive
  //       ? "Turning of the category would turn on all the items of the category for the selected menu template. Click Yes to proceed."
  //       : "Turning of the category would turn off all the items of the category for the selected menu template. Click Yes to proceed."
  //   );
  // };

  // const renderSwitch = (rowData: { status: StatusEnum; _id: string }) => (
  //   <div>
  //     <CustomSwitch
  //       checked={rowData.status === StatusEnum.Active}
  //       onChange={() => handleToggleSwitch(rowData)}
  //       label={`Toggle switch for ${rowData._id}`}
  //     />
  //   </div>
  // );

  // const renderActions = (rowData: { _id: string }) => (
  //   <div className="flex space-x-2 justify-end">
  //     <MdOutlineEdit
  //       className="text-primary text-lg cursor-pointer"
  //       onClick={() => handleEditSubCategory(rowData._id)}
  //     />

  //     <BsCopy
  //       className="text-primary text-lg cursor-pointer"
  //       onClick={() => handleDuplcateCategory(rowData._id)}
  //     />
  //   </div>
  // );

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Items", dataKey: "items" },
    // { title: "Toggle Status", dataKey: "status", render: renderSwitch },
    // { title: "Actions", dataKey: "name.value", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add SubCategory",
      onClick: () => setisAddSubCategoryModalOpen(true),
    },
  ];

  // const handleStatusCloseConfirmationModal = () => {
  //   setShowStatusConfirmationModal(false);
  //   setSelectedItemId("");
  // };
  const [btnLoading, setBtnLoading] = useState(false);

  // const handleStatusConfirmation = async () => {
  //   setBtnLoading(true);
  //   setShowStatusConfirmationModal(false);
  //   try {
  //     const response = await sdk.changeCategoryStatus({ id: selectedItemId });
  //     if (response && response.changeCategoryStatus) {
  //       fetchCategories();
  //     }
  //   } catch (error: any) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setBtnLoading(true);
  //   }
  // };

  // const handleDeleteCloseConfirmationModal = () => {
  //   setshowDeleteConfirmationModal(false);
  //   setSelectedItemId("");
  // };
  // const handleDeleteConfirmation = async () => {
  //   setBtnLoading(true);
  //   setshowDeleteConfirmationModal(false);
  //   try {
  //     const response = await sdk.deleteCategory({ id: selectedItemId });
  //     if (response && response.deleteCategory) {
  //       fetchCategories();
  //     }
  //   } catch (error: any) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setBtnLoading(false);
  //   }
  // };

  return (
    <div className="py-2">
      <RoopTable
        loading={tableLoading}
        itemsPerPage={10}
        headings={headings}
        data={cats}
        mainActions={mainActions}
      />
      {/* <ReusableModal
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
            onClick={handleDeleteConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal> */}

      {/* <ReusableModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setisAddCategoryModalOpen(false)}
        title={isEdit ? "Edit SubCategory" : "Add SubCategory"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SubCategory Name
            </label>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <Select
              isMulti
              options={categories}
              value={selectedCategories}
              onChange={(selected) => setSelectedCategories(selected)}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <CButton
              loading={btnLoading}
              variant={ButtonType.Primary}
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Add"}
            </CButton>
          </div>
        </div>
      </ReusableModal> */}
    </div>
  );
};

export default SubCategories;
