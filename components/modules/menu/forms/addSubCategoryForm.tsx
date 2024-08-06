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
}

interface CategoryType {
  value: string;
  label: string;
}

const AddSubCategoryForm = () => {
  const { setToastData } = useGlobalStore();

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
          setChangesMenu(response.getSubCategory);
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          setToastData({
            type: "error",
            message: errorMessage,
          });
        }
      }
    };
    fetchSubCategory();
  }, [editSubCategoryId, setValue, setToastData, categoriesOption]);
  const [changesMenu, setChangesMenu] = useState<any>({});

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      const updateInput: any = {
        id: editSubCategoryId || "",
      };

      if (data.name !== changesMenu?.name) {
        updateInput.name = data.name;
      }
      if (data.desc !== changesMenu?.desc) {
        updateInput.desc = data.desc;
      }
      if (!isEditSubCategory) {
        await sdk.AddSubCategory({
          input: {
            name: data.name,
            desc: data.desc,
          },
        });
        setToastData({
          type: "success",
          message: "Sub-Category Added Successfully",
        });
      } else {
        const res = await sdk.UpdateSubCategory({
          input: updateInput,
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

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
};

export default AddSubCategoryForm;
