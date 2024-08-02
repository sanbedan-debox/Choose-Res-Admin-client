import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";

import ReusableModal from "@/components/common/modal/modal";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useSubCategoryStore from "@/store/subCategoryStore";

interface IFormInput {
  name: string;
  categories: { value: string; label: string }[];
}

interface CategoryType {
  _id: string;
  name: string;
}

const AddSubCategoryForm = () => {
  const { setToastData } = useGlobalStore();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [btnLoading, setBtnLoading] = useState(false);
  const { isEditSubCategory, seteditSubCategoryId, editSubCategoryId } =
    useSubCategoryStore();
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm<IFormInput>();

  //   const onSubmit = async (data: IFormInput) => {
  //     try {
  //       if (!isValidNameAlphabetic(data.name)) {
  //         setToastData({
  //           message:
  //             "Please use only alphabets and numbers for the subcategory name.",
  //           type: "error",
  //         });
  //         return;
  //       }

  //       setBtnLoading(true);

  //       const categoryIds = data.categories.map((cat) => cat.value);

  //       if (isEdit) {
  //         await sdk.updateSubCategory({
  //           input: {
  //             _id: subCategoryId,
  //             name: data.name,
  //             categoryIds,
  //           },
  //         });
  //         setToastData({
  //           type: "success",
  //           message: "Subcategory updated successfully",
  //         });
  //       } else {
  //         await sdk.addSubCategory({
  //           input: {
  //             name: data.name,
  //             categoryIds,
  //           },
  //         });
  //         setToastData({
  //           type: "success",
  //           message: "Subcategory added successfully",
  //         });
  //       }

  //       setBtnLoading(false);
  //       setIsModalOpen(false);
  //     } catch (error: any) {
  //       setBtnLoading(false);
  //       const errorMessage = extractErrorMessage(error);
  //       setToastData({
  //         type: "error",
  //         message: errorMessage,
  //       });
  //     }
  //   };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sdk.getCategories();
        if (response && response.getCategories) {
          const formattedCategories = response.getCategories.map((cat) => ({
            _id: cat._id,
            name: cat.name.value,
          }));
          setCategories(formattedCategories);
        }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetchCategories();
  }, []);

  //   useEffect(() => {
  //     const fetchSubCategoryData = async () => {
  //       if (isEdit && subCategoryId) {
  //         try {
  //           const response = await sdk.getSubCategory({ id: subCategoryId });
  //           if (response.getSubCategory) {
  //             const subCategory = response.getSubCategory;
  //             setValue("name", subCategory.name);
  //             const selectedCats = subCategory.categories.map((cat) => ({
  //               value: cat._id,
  //               label: cat.name.value,
  //             }));
  //             setValue("categories", selectedCats);
  //           }
  //         } catch (error: any) {
  //           const errorMessage = extractErrorMessage(error);
  //           setToastData({
  //             type: "error",
  //             message: errorMessage,
  //           });
  //         }
  //       }
  //     };

  //     fetchSubCategoryData();
  //   }, [isEdit, subCategoryId, setValue, setToastData]);

  const handleRemoveCategory = async () => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((item) => item._id !== editSubCategoryId)
    );

    // if (isEdit) {
    //   try {
    //     await sdk.removeSubCategory({ id: subCategoryId });
    //     setToastData({
    //       type: "success",
    //       message: "Subcategory removed successfully",
    //     });
    //   } catch (error: any) {
    //     const errorMessage = extractErrorMessage(error);
    //     setToastData({
    //       type: "error",
    //       message: errorMessage,
    //     });
    //   }
    // }

    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-5 text-center">
        <h1 className="font-display max-w-2xl font-semibold text-2xl">
          {isEditSubCategory ? "Edit Subcategory" : "Add a new subcategory"}
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new subcategory.
        </p>
      </div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Subcategory Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            id="name"
            className="input input-primary"
            placeholder="Enter subcategory name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="categories"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Categories
          </label>
          <Controller
            name="categories"
            control={control}
            rules={{ required: "At least one category is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select categories"
              />
            )}
          />
          {errors.categories && (
            <p className="text-red-500 text-sm text-start">
              {errors.categories.message}
            </p>
          )}
        </div>
        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          <div className="flex justify-center items-center">
            {isEditSubCategory ? "Save Subcategory" : "Add Subcategory"}
          </div>
        </CButton>
      </form>
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Are you sure?"
        comments="By clicking yes the selected subcategory will be removed. This action cannot be undone."
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            onClick={handleRemoveCategory}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddSubCategoryForm;
