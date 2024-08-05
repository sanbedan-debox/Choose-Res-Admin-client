import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";

import ReusableModal from "@/components/common/modal/modal";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
} from "@/utils/utilFUncs";
import useSubCategoryStore from "@/store/subCategoryStore";
import useMenuOptionsStore from "@/store/menuOptions";

interface IFormInput {
  name: string;
  desc: string;
  categories: CategoryType;
}

interface CategoryType {
  value: string;
  label: string;
}

const AddSubCategoryForm = () => {
  const { setToastData } = useGlobalStore();
  const [isCategoriesEmpty, setIsCategoriesEmpty] = useState(false);

  const [categoriesOption, setCategoryOptions] = useState<CategoryType[]>([]);

  const [btnLoading, setBtnLoading] = useState(false);
  const {
    isEditSubCategory,
    seteditSubCategoryId,
    editSubCategoryId,
    setisDuplicateSubCategory,
    setisEditSubCategory,
    isDuplicateSubCategory,
  } = useSubCategoryStore();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();
  const {
    isAddSubCategoryModalOpen,
    setisAddSubCategoryModalOpen,
    setfetchMenuDatas,
    fetchMenuDatas,
  } = useMenuOptionsStore();
  const [changesSubCat, setChangesSubCat] = useState({});

  useEffect(() => {
    const fetchSubCategory = async () => {
      if (editSubCategoryId) {
        try {
          const response = await sdk.getSubCategory({ id: editSubCategoryId });
          const menu = response.getSubCategory;
          setChangesSubCat(response.getSubCategory);
          const nameDup = generateUniqueName(menu?.name);
          setValue("name", menu.name);
          if (isDuplicateSubCategory) {
            setValue("name", nameDup);
          }
          setValue("desc", menu?.desc);
          const selectedSubCatType = categoriesOption.find(
            (option) => option.value === menu?.category?._id
          );
          console.log(selectedSubCatType);
          if (selectedSubCatType) {
            setValue("categories", selectedSubCatType);
          }
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          setToastData({
            type: "error",
            message: errorMessage,
          });
        }
      }
    };
    if (categoriesOption.length > 0) {
      fetchSubCategory();
    }
  }, [editSubCategoryId, setValue, setToastData, categoriesOption]);

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);

      if (!isEditSubCategory) {
        await sdk.AddSubCategory({
          input: {
            name: data.name,
            category: data.categories.value,
            desc: data.desc,
          },
        });
        setToastData({
          type: "success",
          message: "Sub-Category Added Successfully",
        });
      } else {
        const res = await sdk.UpdateSubCategory({
          input: {
            id: editSubCategoryId || "",
            name: data.name,
            desc: data.desc,
          },
        });
        setToastData({
          type: "success",
          message: "Sub-Category Updated Successfully",
        });
        setisAddSubCategoryModalOpen(false);
        setBtnLoading(false);
      }

      setBtnLoading(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisDuplicateSubCategory(false);
      setisEditSubCategory(false);

      setisAddSubCategoryModalOpen(false);
    } catch (error: any) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sdk.getCategories();
        if (response && response.getCategories) {
          const formattedCategories = response.getCategories.map((cat) => ({
            value: cat._id,
            label: cat.name.value,
          }));
          setCategoryOptions(formattedCategories);
          setIsCategoriesEmpty(formattedCategories.length === 0);
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

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {isCategoriesEmpty ? (
        <p className="text-red-500 text-lg">
          You need at least one category to create a subcategory.
        </p>
      ) : (
        <>
          <form
            className="space-y-4 md:space-y-3 w-full max-w-2xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-left text-gray-700"
              >
                Name
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
              <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                Description
              </label>
              <textarea
                {...register("desc", { required: "Description is required" })}
                id="desc"
                className="input input-primary"
                placeholder="Enter sub-category description"
              />
              {errors.desc && (
                <p className="text-red-500 text-sm text-start">
                  {errors.desc.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label
                htmlFor="categories"
                className="block mb-2 text-sm font-medium text-left text-gray-700"
              >
                Category
              </label>
              <Controller
                name="categories"
                control={control}
                rules={{ required: "At least one category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoriesOption}
                    isDisabled={isEditSubCategory}
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
              className="w-full mt-8"
            >
              <div className="flex justify-center items-center">
                {isEditSubCategory ? "Save Subcategory" : "Add Subcategory"}
              </div>
            </CButton>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default AddSubCategoryForm;
