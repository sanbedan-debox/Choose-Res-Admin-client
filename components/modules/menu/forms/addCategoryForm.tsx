import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import { FilterOperatorsEnum } from "@/generated/graphql";
import useMenuOptionsStore from "@/store/menuOptions";
import useMenuCategoryStore from "@/store/menuCategory";
import FormAddTable from "@/components/common/table/formTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReusableModal from "@/components/common/modal/modal";
import { MdArrowOutward } from "react-icons/md";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";

interface IFormInput {
  name: string;
  description: string;
  items: string[];
}

interface ItemsDropDownType {
  _id: string;
  name: string;
  price: number;
}

const AddCategoryForm = () => {
  const [btnLoading, setBtnLoading] = useState(false);
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

  const { setToastData } = useGlobalStore();
  const { fetchMenuDatas, setfetchMenuDatas, setisAddCategoryModalOpen } =
    useMenuOptionsStore();
  const { editCatsId, isEditCats, seteditCatsId, setisEditCats } =
    useMenuCategoryStore();
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<IFormInput>();

  useEffect(() => {
    const fetchItemData = async () => {
      if (editCatsId) {
        try {
          const response = await sdk.getCategory({ id: editCatsId });
          const item = response.getCategory;
          setValue("name", item.name.value);
          setValue("description", item.desc.value);
          setSelectedItems(item?.items);
          const formateditemlist = item?.items.map((el) => ({
            _id: el._id._id,
            name: el?.name?.value ?? "",
            price: el?.price?.value ?? "",
          }));
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

    fetchItemData();
  }, [editCatsId, setValue, setToastData]);

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      if (!isEditCats) {
        // ADD CATEGORIES/NEW CATEGORIES
        const res = await sdk.addCategory({
          input: {
            name: {
              value: data.name,
            },
            desc: {
              value: data.description,
            },
            items: selectedItemsIds,
          },
        });

        if (res?.addCategory) {
          setToastData({
            type: "success",
            message: "Category Added Successfully",
          });
          setBtnLoading(false);
          setisAddCategoryModalOpen(false);
          setfetchMenuDatas(!fetchMenuDatas);
        }
      } else {
        // EDIT CATEGORIES
        const res = await sdk.updateCategory({
          input: {
            _id: editCatsId || "",
            name: {
              value: data.name,
            },
            desc: {
              value: data.description,
            },
          },
        });

        if (res?.updateCategory) {
          if (prevItemsbfrEdit === selectedItems) {
            const res = await sdk.addItemToCategory({
              categoryId: editCatsId || "",
              itemId: selectedItemsIds[0],
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
      }
    } catch (error: any) {
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
        const items = await sdk.getItemsForCategoryDropdown({
          field: "status",
          operator: FilterOperatorsEnum.Any,
          value: "active",
        });
        if (items && items.getItems) {
          const formattedItemsList = items.getItems.map((item) => ({
            _id: item._id,
            name: item?.name?.value,
            price: item?.price?.value,
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

  const handleItemClick = (item: any) => {
    console.log(item);
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [...prevSelected, item]
    );
  };

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

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => handleRemoveItem(rowData._id)}
      />
      <MdArrowOutward
        className="text-primary cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
    </div>
  );

  const data = selectedItems.map((item) => ({
    ...item,
    actions: renderActions(item),
  }));

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );
  };

  const handleEditItem = (id: string) => {
    console.log(`Edit item with id ${id}`);
  };

  const headings = [
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];
  const headingsDropdown = [
    { title: "Price", dataKey: "price" },
    {
      title: "Actions",
      dataKey: "name",
      render: (item: { _id: string }) => (
        <div className="flex space-x-2 justify-center">
          <MdArrowOutward
            className="text-primary cursor-pointer"
            onClick={() => handleEditItem(item._id)}
          />
        </div>
      ),
    },
  ];

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
          {!isEditCats ? "ADD Category" : "EDIT Category"}
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new category.
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
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            id="name"
            className="input input-primary"
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-start">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            id="description"
            className="input input-primary"
            placeholder="Enter category description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm text-start">
              {errors.description.message}
            </p>
          )}
        </div>

        <FormAddTable
          data={data}
          headings={headings}
          title="Items"
          emptyMessage="No items available"
          buttonText="Add Items"
          onAddClick={handleAddClick}
        />

        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          Add Category
        </CButton>
      </form>

      <AddFormDropdown
        title="Add Items"
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
      />
    </motion.div>
  );
};

export default AddCategoryForm;
