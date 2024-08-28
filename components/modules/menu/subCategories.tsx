import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useSubCategoryStore from "@/store/subCategoryStore";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";

import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

const SubCategories: React.FC = () => {
  const [cats, setCats] = useState<
    { name: string; desc: string; _id: string }[]
  >([]);
  const { setToastData } = useGlobalStore();
  const { setisAddSubCategoryModalOpen, refreshMenuBuilderData } =
    useMenuOptionsStore();
  const [tableLoading, setTableLoading] = useState(false);
  const { setisEditSubCategory, seteditSubCategoryId } = useSubCategoryStore();
  const fetchCategories = async () => {
    try {
      setTableLoading(true);
      const response = await sdk.getSubCategories();
      if (response && response.getSubCategories) {
        setCats(
          response.getSubCategories.map(
            (el: { desc: string; name: string; _id: string }) => ({
              desc: el.desc,
              name: el.name,
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
    fetchCategories();
  }, [refreshMenuBuilderData, setToastData]);

  const handleEditSubCategory = async (_id: string) => {
    setisEditSubCategory(true);
    seteditSubCategoryId(_id);
    // try {
    //   const response = await sdk.getSubCategory({ id: _id });
    //   if (response && response.getSubCategory) {
    //     const subCategory = response.getSubCategory;
    //     setSubCategoryName(subCategory.name);
    //     setSelectedCategories(
    //       subCategory.categories.map((cat) => ({
    //         value: cat._id,
    //         label: cat.name,
    //       }))
    //     );
    //   }
    // } catch (error) {
    //   const errorMessage = extractErrorMessage(error);
    //   setToastData({
    //     type: "error",
    //     message: errorMessage,
    //   });
    // }
    setisAddSubCategoryModalOpen(true);
  };

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
  //   } catch (error) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setIsAddCategoryModalOpen(false);
  //   }
  // };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditSubCategory(rowData._id)}
      />
      {/* 
      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      /> */}
    </div>
  );

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Actions", dataKey: "name", render: renderActions },
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
  //   } catch (error) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setBtnLoading(true);
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

     
      {/* <ReusableModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
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
