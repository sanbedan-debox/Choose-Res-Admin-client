import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { PriceTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useMenuItemsStore from "@/store/menuItems";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import CountSelector from "@/components/common/countSelector/countSelector";
import { sdk } from "@/utils/graphqlClient";
import FormAddTable from "@/components/common/table/formTable";
import { FaTrash } from "react-icons/fa";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { MdArrowOutward } from "react-icons/md";

interface IFormInput {
  name: string;
  optional: boolean;
  pricingType: PriceTypeEnum;
  maxSelections: number;
  minSelections: number;
}

const AddModifierGroupForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>();
  interface ItemsDropDownType {
    _id: string;
    name: string;
    price: number;
  }

  const { fetchMenuDatas, setfetchMenuDatas, setisAddItemModalOpen } =
    useMenuOptionsStore();
  const { editItemId, isEditItem, setEditItemId, setisEditItem } =
    useMenuItemsStore();
  const [modifierssOption, setModifiersOption] = useState<any[]>([]);

  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);
  const PricingTypeOptions: any[] = [
    { value: PriceTypeEnum.FreeOfCharge, label: "Free of Charge" },
    { value: PriceTypeEnum.IndividualPrice, label: "Individual Price" },
    { value: PriceTypeEnum.SamePrice, label: "Same Price" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const items = await sdk.getModifiersforGroupDropDown();
        if (items && items.getModifiers) {
          const formattedItemsList = items.getModifiers.map((item) => ({
            _id: item._id,
            name: item?.name?.value,
            price: item?.price?.value,
          }));
          setModifiersOption(formattedItemsList);
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

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = modifierssOption.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    setisAddItemModalOpen(true);
  };

  const handleAddItems = () => {
    setSelectedItems([]);
    setSelectedItems(tempSelectedItems);
    setIsModalOpen(false);
  };

  const handleItemClick = (item: any) => {
    console.log(item);
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [...prevSelected, item]
    );
  };
  const handleEditItem = (id: string) => {
    console.log(`Edit item with id ${id}`);
    setisAddItemModalOpen(true);
    setEditItemId(id);
    setisEditItem(true);
  };

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

  //   useEffect(() => {
  //     const fetchItemData = async () => {
  //       if (editItemId) {
  //         try {
  //           const response = await sdk.getItem({ id: editItemId });
  //           const item = response.getItem;
  //           setValue("name", item.name.value);
  //           setValue("desc", item.desc.value);
  //
  //         } catch (error) {
  //           const errorMessage = extractErrorMessage(error);
  //           setToastData({
  //             type: "error",
  //             message: errorMessage,
  //           });
  //         }
  //       }
  //     };

  //     fetchItemData();
  //   }, [editItemId, setValue, setToastData]);

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      // !isEditItem
      //   ? // ADD ITEM API
      //     await sdk.addItem({
      //       input: {

      //       }
      //     })
      //   : // EDIT/UPDATE ITEM API
      //     await sdk.updateItem({
      //       input: {
      //         _id: editItemId || "",
      //         name: {
      //           value: data.name,
      //         },

      //         // availability: [],
      //       },
      //     });
      setBtnLoading(false);
      setisAddItemModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisEditItem(false);
      setEditItemId(null);
      setToastData({
        type: "success",
        message: "Item Added Successfully",
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const handleMinCountChange = (count: number) => {
    setValue("minSelections", count);
  };

  const handleMaxCountChange = (count: number) => {
    setValue("maxSelections", count);
  };
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const data = selectedItems.map((item) => ({
    ...item,
    actions: renderActions(item),
  }));
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => handleRemoveItem(rowData._id)}
      />
    </div>
  );

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );
  };

  const headings = [
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];

  const handleAddClick = () => {
    setIsModalOpen(true);
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
        // onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {!isEditItem ? "ADD Modifier Group" : "EDIT Modifier group"}
          </h2>
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="mb-1">
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
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm text-start">
                {errors.name.message}
              </p>
            )}
          </div>
          <CountSelector
            title="Minimum"
            initialValue={0}
            onCountChange={handleMinCountChange}
          />

          <CountSelector
            title="Maximum"
            initialValue={1}
            onCountChange={handleMaxCountChange}
            showLimit
          />
          <div className="">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Type
            </label>
            <Controller
              name="pricingType"
              control={control}
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="type"
                  options={PricingTypeOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select Pricing type"
                />
              )}
            />
            {errors.pricingType && (
              <p className="text-red-500 text-sm text-start">
                {errors.pricingType.message}
              </p>
            )}
          </div>

          <div className="mb-1">
            <label
              htmlFor="optional"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              optional
            </label>

            <CustomSwitchCard
              label="optional"
              title="optional"
              caption="If its checked ,you can use this modifer will become optional"
              switchChecked={watch("optional")}
              onSwitchChange={() => setValue("optional", !watch("optional"))}
            />

            {errors.optional && (
              <p className="text-red-500 text-sm text-start">
                {errors.optional.message}
              </p>
            )}
          </div>

          <FormAddTable
            data={data}
            isShowImage
            headings={headings}
            title="Modifiers"
            emptyMessage="No Modifiers available"
            buttonText="Add Modifiers"
            onAddClick={handleAddClick}
          />

          <CButton
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Item
          </CButton>

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
            onClickCreatebtn={handleAddItem}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default AddModifierGroupForm;
