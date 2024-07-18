import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { FilterOperatorsEnum, MenuTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import FormAddTable from "@/components/common/table/formTable";
import { FaTrash } from "react-icons/fa";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { MdArrowOutward } from "react-icons/md";
import useMenuMenuStore from "@/store/menumenu";

interface IFormInput {
  type: { value: string; label: string };
  name: string;
}

interface ItemsDropDownType {
  _id: string;
  name: string;
  length: number;
}

const menuTypeOptions: any[] = [
  { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
  { value: MenuTypeEnum.DineIn, label: "Dine In" },
  { value: MenuTypeEnum.Catering, label: "Catering" },
];
const AddMenuForm = () => {
  const { fetchMenuDatas, setfetchMenuDatas, setisAddMenuModalOpen } =
    useMenuOptionsStore();

  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [itemsOption, setItemsOption] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);
  const { editMenuId, isEditMenu } = useMenuMenuStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();

  useEffect(() => {
    const fetchMenuData = async () => {
      if (editMenuId) {
        try {
          console.log(editMenuId);
          const response = await sdk.getMenusByType({ id: editMenuId });
          const menu = response.getMenusByType;
          setValue("name", menu[0].name.value);
          const selectedMenuType = menuTypeOptions.find(
            (option) => option.value === menu[0]?.type
          );
          setValue("type", selectedMenuType);

          const formateditemlist = menu[0]?.categories.map((el) => ({
            _id: el._id._id,
            name: el?.name?.value ?? "",
            length: 0,
          }));
          setSelectedItems(menu[0].categories);
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

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      if (!isEditMenu) {
        await sdk.addMenu({
          input: {
            type: data.type.value as MenuTypeEnum,
            name: {
              value: data.name,
            },
            categories: selectedItemsIds,
          },
        });
      } else {
        //Edit Menu
        const res = await sdk.updateMenu({
          input: {
            _id: editMenuId || "",
            type: data.type.value as MenuTypeEnum,
            name: {
              value: data.name,
            },
          },
        });

        console.log(prevItemsbfrEdit, selectedItems);
        if (prevItemsbfrEdit === selectedItems) {
          const res = await sdk.addCategoryToMenu({
            menuId: editMenuId || "",
            categoryId: selectedItemsIds,
          });
        }

        setToastData({
          type: "success",
          message: "Category Updated Successfully",
        });
        setBtnLoading(false);
        setisAddCategoryModalOpen(false);
        setfetchMenuDatas(!fetchMenuDatas);
      }

      setToastData({
        type: "success",
        message: "Menu Added Successfully",
      });
      setBtnLoading(false);
      setisAddMenuModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
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
            items: cats?.items?.length,
          }));
          setItemsOption(formattedItemsList);
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
  }, [fetchMenuDatas, setToastData]);

  const handleRemoveCategory = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );
  };
  const handleEditCategory = (id: string) => {
    console.log(`Edit item with id ${id}`);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => handleRemoveCategory(rowData._id)}
      />
      <MdArrowOutward
        className="text-primary cursor-pointer"
        onClick={() => handleEditCategory(rowData._id)}
      />
    </div>
  );
  const data = selectedItems.map((item) => ({
    ...item,
    actions: renderActions(item),
  }));

  const handleAddItems = () => {
    setSelectedItems([]);
    setSelectedItems(tempSelectedItems);
    setIsModalOpen(false);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = itemsOption.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headingsDropdown = [
    { title: "Items", dataKey: "items" },
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
    console.log(item);
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [...prevSelected, item]
    );
  };
  const { setisAddCategoryModalOpen } = useMenuOptionsStore();
  const handelCreateCategory = () => {
    setisAddCategoryModalOpen(true);
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
          Add a new menu
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
          {errors.type && (
            <p className="text-red-500 text-sm text-start">
              {errors.type.message}
            </p>
          )}
        </div>

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
            placeholder="Enter menu name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>
        <FormAddTable
          data={data}
          headings={headings}
          title="Categories"
          emptyMessage="No Categories selected"
          buttonText="Add Categories"
          onAddClick={handleAddClick}
        />

        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          Add Menu
        </CButton>
      </form>
      <AddFormDropdown
        title="Add Categories"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        filteredItems={filteredItems}
        tempSelectedItems={tempSelectedItems}
        handleItemClick={handleItemClick}
        handleAddItems={handleAddItems}
        headings={headingsDropdown}
        renderActions={renderActions}
        createNewItemButtonLabel="Create new category"
        addSelectedItemsButtonLabel="Add selected categories"
        onClickCreatebtn={handelCreateCategory}
      />
    </motion.div>
  );
};

export default AddMenuForm;
