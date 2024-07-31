import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
} from "@/utils/utilFUncs";
import { FilterOperatorsEnum, MenuTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import FormAddTable from "@/components/common/table/formTable";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { MdArrowOutward } from "react-icons/md";
import useMenuMenuStore from "@/store/menumenu";
import useMenuCategoryStore from "@/store/menuCategory";
import ReusableModal from "@/components/common/modal/modal";
import useRestaurantsStore from "@/store/restaurant";
import useAuthStore from "@/store/auth";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";

interface IFormInput {
  type: { value: string; label: string };
  name: string;
}

interface ItemsDropDownType {
  _id: string;
  name: string;
}

const menuTypeOptions: any[] = [
  { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
  { value: MenuTypeEnum.DineIn, label: "Dine In" },
  { value: MenuTypeEnum.Catering, label: "Catering" },
];

const AddMenuForm = () => {
  const { fetchMenuDatas, setfetchMenuDatas, setisAddMenuModalOpen } =
    useMenuOptionsStore();
  const [confirmationRemoval, setConfirmationRemoval] = useState(false);
  const [removingId, setRemovingId] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [itemsOption, setItemsOption] = useState<ItemsDropDownType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ItemsDropDownType[]>([]);
  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);
  const [changesMenu, setChangesMenu] = useState<any>([]);
  const {
    editMenuId,
    isEditMenu,
    isDuplicateMenu,
    setEditMenuId,
    setisDuplicateMenu,
    setisEditMenu,
  } = useMenuMenuStore();
  const { seteditCatsId, setisEditCats } = useMenuCategoryStore();
  const { setisAddCategoryModalOpen } = useMenuOptionsStore();
  const { setisShowTaxSettings } = useGlobalStore();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();
  const { taxRate } = useAuthStore();
  useEffect(() => {
    console.log(taxRate);
  }, [taxRate]);

  const onSubmit = async (data: IFormInput) => {
    try {
      if (!isDuplicateMenu) {
        if (!isValidNameAlphabetic(data.name)) {
          setToastData({
            message:
              "Please use only alphabets and numbers while adding or updating name.",
            type: "error",
          });
          return;
        }
      }

      setBtnLoading(true);
      const prevSelectedMenuIds = prevItemsbfrEdit.map((item) => item._id);
      const selectedItemsIds = selectedItems.map((item) => item._id);

      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;

      const updateInput: any = {
        _id: editMenuId || "",
        taxRateId: taxRate?.id || "",
      };
      const selectedMenuType = menuTypeOptions.find(
        (option) => option.value === changesMenu[0]?.type
      );
      if (data.type.value !== selectedMenuType?.value) {
        updateInput.type = data.type.value as MenuTypeEnum;
      }

      if (data.name !== changesMenu[0]?.name.value) {
        updateInput.name = {
          value: data.name,
        };
      }

      if (!isEditMenu) {
        await sdk.addMenu({
          input: {
            type: data.type.value as MenuTypeEnum,
            name: {
              value: data.name,
            },
            categories: selectedItemsIds,
            taxRateId: taxRate?.id || "",
          },
        });
      } else {
        const res = await sdk.updateMenu({
          input: updateInput,
        });

        isMenuAdded &&
          (await sdk.addCategoryToMenu({
            categoryId: addedMenuIds,
            menuId: editMenuId || "",
          }));

        setToastData({
          type: "success",
          message: "Category Updated Successfully",
        });
        setisAddMenuModalOpen(false);
        setBtnLoading(false);
      }

      setToastData({
        type: "success",
        message: "Menu Added Successfully",
      });
      setBtnLoading(false);
      setisAddMenuModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisDuplicateMenu(false);
      setisEditCats(false);
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
    if (selectedItems.length > 0) {
      setItemsOption((prevItemsOption) =>
        prevItemsOption.filter(
          (item) =>
            !selectedItems.some((selectedItem) => selectedItem._id === item._id)
        )
      );
    }
  }, [isModalOpen, selectedItems, fetchMenuDatas, tempSelectedItems]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const categories = await sdk.getCategoriesForMenuDropdown({
          field: "status",
          operator: FilterOperatorsEnum.Any,
          value: "",
        });
        if (categories && categories.getCategories) {
          const formattedItemsList = categories.getCategories.map((cats) => ({
            _id: cats._id,
            name: cats?.name?.value,
          }));
          const filteredItemsList = formattedItemsList.filter(
            (item) =>
              !selectedItems.some(
                (selectedItem) => selectedItem._id === item._id
              )
          );

          setItemsOption(filteredItemsList);
        }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };
    fetch();
  }, [fetchMenuDatas, setToastData, selectedItems]);

  const handleRemoveCategory = async () => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== removingId)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== removingId)
    );

    const isPresentInPrevItems = prevItemsbfrEdit.some(
      (item) => item._id === removingId
    );

    if (isEditMenu && isPresentInPrevItems) {
      const res = await sdk.removeCategoryFromMenu({
        categoryId: removingId,
        menuId: editMenuId || "",
      });
      if (res) {
        setprevItemsbfrEdit((prevSelected) =>
          prevSelected.filter((item) => item._id !== removingId)
        );
      }
    }
    setConfirmationRemoval(false);
  };

  const handleEditCategory = (id: string) => {
    setisAddCategoryModalOpen(true);
    setisEditCats(true);
    seteditCatsId(id);
  };

  const renderActions = (rowData: ItemsDropDownType) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => {
          setConfirmationRemoval(true);
          setRemovingId(rowData?._id);
        }}
      />
      <MdArrowOutward
        className="text-primary cursor-pointer"
        onClick={() => {
          handleEditCategory(rowData?._id);
        }}
      />
    </div>
  );

  const data = selectedItems.map((item) => ({
    _id: item._id,
    name: item.name,
    actions: renderActions(item),
  }));

  const handleAddItems = () => {
    setSelectedItems([]);
    setSelectedItems(tempSelectedItems);
    setIsModalOpen(false);
  };

  const headingsDropdown = [
    {
      title: "Actions",
      dataKey: "name",
      render: (item: { _id: string }) => (
        <div className="flex space-x-2 justify-center">
          <MdArrowOutward
            className="text-primary cursor-pointer"
            onClick={() => handleEditCategory(item._id)}
          />
        </div>
      ),
    },
  ];

  const headings = [
    { title: "Items", dataKey: "items" },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleItemClick = (item: any) => {
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [...prevSelected, item]
    );
  };

  const handelCreateCategory = () => {
    setisAddCategoryModalOpen(true);
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      if (editMenuId) {
        try {
          const response = await sdk.getMenusByType({ id: editMenuId });
          const menu = response.getMenusByType;
          setChangesMenu(response.getMenusByType);
          const nameDup = generateUniqueName(menu[0]?.name?.value);
          setValue("name", menu[0].name.value);
          if (isDuplicateMenu) {
            setValue("name", nameDup);
          }
          const selectedMenuType = menuTypeOptions.find(
            (option) => option.value === menu[0]?.type
          );
          setValue("type", selectedMenuType);

          const formateditemlist = menu[0]?.categories.map((el) => ({
            _id: el._id._id,
            name: el?.name?.value ?? "",
            length: 0,
          }));
          setSelectedItems(formateditemlist);
          setTempSelectedItems(formateditemlist);
          setprevItemsbfrEdit(formateditemlist);
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          setToastData({
            type: "error",
            message: errorMessage,
          });
        }
      }
    };

    fetchMenuData();
  }, [editMenuId, setValue, setToastData]);

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
          {isEditMenu ? "Edit Menu" : " Add a new menu"}
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new menu.
        </p>
      </div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Display Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            id="name"
            className="input input-primary"
            placeholder="Enter menu name"
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            This is the name your customer will see.
          </p>
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Type
          </label>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="type"
                options={menuTypeOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select menu type"
              />
            )}
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            Select what kind of menu you want this to be.
          </p>
          {errors.type && (
            <p className="text-red-500 text-sm text-start">
              {errors.type.message}
            </p>
          )}
        </div>
        <div>
          <FormAddTable
            data={data}
            headings={headings}
            title="Categories"
            emptyCaption="Add Categories to your menu"
            emptyMessage="No Categories selected"
            buttonText="Add Categories"
            onAddClick={handleAddClick}
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            Select the categories and items you want to be in this menu.
          </p>
        </div>
        {!taxRate?.salesTax ? (
          <div
            className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white cursor-pointer"
            onClick={() => setisShowTaxSettings(true)}
          >
            <div>
              <h3 className=" font-semibold text-start text-md">
                Tax Rate was not found
              </h3>
              <p className="text-gray-600 text-sm">
                Please add tax rate to apply for this item
              </p>
            </div>
            <FaArrowRight className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div
            className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white cursor-pointer"
            onClick={() => setisShowTaxSettings(true)}
          >
            <div>
              <h3 className=" font-semibold text-start text-md">Tax Rate</h3>
              <p className="text-gray-600 text-sm">
                The Menu will be having an tax rate of, To add new click here.
              </p>
            </div>
            <span>{taxRate?.salesTax} %</span>
          </div>
        )}

        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          <div className="flex justify-center items-center">
            {isEditMenu ? "Save Menu" : "Add Menu"}
            {!isEditMenu ? (
              <IoIosAddCircleOutline className="text-xl ml-1" />
            ) : (
              <RiEditCircleLine className="text-xl ml-1" />
            )}
          </div>
        </CButton>
      </form>
      <AddFormDropdown
        title="Add Categories"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={itemsOption}
        tempSelectedItems={tempSelectedItems}
        handleItemClick={handleItemClick}
        handleAddItems={handleAddItems}
        headings={headingsDropdown}
        renderActions={renderActions}
        createNewItemButtonLabel="Create new category"
        addSelectedItemsButtonLabel="Add selected categories"
        onClickCreatebtn={handelCreateCategory}
      />
      <ReusableModal
        isOpen={confirmationRemoval}
        onClose={() => {
          setConfirmationRemoval(false);
          setRemovingId("");
        }}
        title="Are you sure?"
        comments="By clicking yes the selected category / categories will be removed from this menu. This action cannot be undone."
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            onClick={() => handleRemoveCategory()}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddMenuForm;
