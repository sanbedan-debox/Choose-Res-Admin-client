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
import { FaEdit, FaShieldAlt, FaTrash } from "react-icons/fa";

interface IFormInput {
  type: { value: string; label: string };
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

  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);

      await sdk.addMenu({
        input: {
          type: data.type.value as MenuTypeEnum,
          name: {
            value: data.name,
          },
        },
      });

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
        const res = await sdk.getCategoriesForMenuDropdown({
          field: "status",
          operator: FilterOperatorsEnum.Any,
          value: "active",
        });
        console.log(res);
        // if (res && res.getCategories) {
        //   const formattedItemsList = res.getItems.map((item) => ({
        //     value: item._id,
        //     label: item?.name?.value,
        //   }));
        //   // setItemsOption(formattedItemsList);
        // }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };
    fetch();
  }, [fetchMenuDatas]);
  const data = [
    {
      id: "1",
      name: "Kerala Style Fish Curry",
      desc: "A delicious fish curry",
      price: "$15.99",
      image: "/path-to-image1.png",
      status: "Available",
    },
    {
      id: "2",
      name: "Goat Mandi",
      desc: "A tasty goat dish",
      price: "$39.99",
      image: "/path-to-image2.png",
      status: "Available",
    },
  ];

  const renderActions = (rowData: { id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => handleDeleteItem(rowData.id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => handleEditItem(rowData.id)}
      />
      <FaShieldAlt
        className="text-green-500 cursor-pointer"
        onClick={() => console.log("Change Password", rowData.id)}
      />
    </div>
  );

  const headings = [
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];

  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  const handleDeleteItem = (id: string) => {
    console.log(`Delete item with id ${id}`);
  };

  const handleEditItem = (id: string) => {
    console.log(`Edit item with id ${id}`);
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
          Add Menu
        </CButton>
      </form>
    </motion.div>
  );
};

export default AddMenuForm;
