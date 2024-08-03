import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
} from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import {
  AvailabilityInput,
  Day,
  FilterOperatorsEnum,
  MenuTypeEnum,
  StatusEnum,
} from "@/generated/graphql";
import useMenuOptionsStore from "@/store/menuOptions";
import useMenuCategoryStore from "@/store/menuCategory";
import FormAddTable from "@/components/common/table/formTable";
import { MdArrowOutward } from "react-icons/md";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import useMenuItemsStore from "@/store/menuItems";
import ReusableModal from "@/components/common/modal/modal";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import moment from "moment";
import {
  Availability,
  formatAvailability,
  reverseFormatAvailability,
} from "@/components/common/timingAvailibility/interface";

interface IFormInput {
  name: string;
  description: string;
  items: string[];
}

interface ItemsDropDownType {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const AddCategoryForm = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [itemsOption, setItemsOption] = useState<ItemsDropDownType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState<ItemsDropDownType[]>([]);
  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const [confirmationRemoval, setConfirmationRemoval] = useState(false);
  const [removingId, setRemovingId] = useState<string>("");
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);

  const [changesMenu, setChangesMenu] = useState<any>([]);
  const { setEditItemId, setisEditItem } = useMenuItemsStore();

  const { setToastData } = useGlobalStore();
  const {
    fetchMenuDatas,
    setfetchMenuDatas,
    setisAddCategoryModalOpen,
    setisAddItemModalOpen,
  } = useMenuOptionsStore();
  const {
    editCatsId,
    isEditCats,
    isDuplicateCats,
    setisDuplicateCats,
    setisEditCats,
  } = useMenuCategoryStore();
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<IFormInput>();

  const [visibilities, setVisibilities] = useState<
    {
      menuType: MenuTypeEnum;
      status: StatusEnum;
    }[]
  >([]);

  const [incomingvisibilities, setIncomingVisibilities] = useState<
    {
      menuType: MenuTypeEnum;
      status: StatusEnum;
    }[]
  >([]);

  const [useRestaurantTimings, setUseRestaurantTimings] = useState(true);
  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setUseRestaurantTimings(isChecked);

    if (isChecked) {
      try {
        const response = await sdk.getRestaurantDetails();
        const restaurantAvailibility =
          response.getRestaurantDetails?.availability;
        if (restaurantAvailibility) {
          const originalAvailability = reverseFormatAvailability(
            restaurantAvailibility
          );
          setAvailability(originalAvailability);
        }
      } catch (error) {
        setToastData({
          type: "error",
          message: "Failed to get Restaurant availibility",
        });
      }
    } else {
      setAvailability([
        { day: Day.Sunday, hours: [], active: false },
        { day: Day.Monday, hours: [], active: false },
        { day: Day.Tuesday, hours: [], active: false },
        { day: Day.Wednesday, hours: [], active: false },
        { day: Day.Thursday, hours: [], active: false },
        { day: Day.Friday, hours: [], active: false },
        { day: Day.Saturday, hours: [], active: false },
      ]);
    }
  };
  const [availability, setAvailability] = useState<Availability[]>([
    { day: Day.Sunday, hours: [], active: false },
    { day: Day.Monday, hours: [], active: false },
    { day: Day.Tuesday, hours: [], active: false },
    { day: Day.Wednesday, hours: [], active: false },
    { day: Day.Thursday, hours: [], active: false },
    { day: Day.Friday, hours: [], active: false },
    { day: Day.Saturday, hours: [], active: false },
  ]);
  const fetchMenuData = async () => {
    try {
      const response = await sdk.getMenuByRestaurant();
      const menuItems = response.getMenuByRestaurant.map((menu) => ({
        name: menu.name.value,
        type: menu.type,
      }));

      const updatedVisibilities = menuItems.map((menu) => ({
        menuType: menu.type,
        status: StatusEnum.Inactive as StatusEnum,
      }));

      setVisibilities(updatedVisibilities);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const fetchItemData = async () => {
    if (editCatsId && (isEditCats || isDuplicateCats)) {
      try {
        const response = await sdk.getCategory({ id: editCatsId });
        const item = response.getCategory;
        setChangesMenu(response.getCategory);
        setValue("name", item.name.value);
        const nameDup = generateUniqueName(item?.name?.value);
        if (isDuplicateCats) {
          setValue("name", nameDup);
        }
        setValue("description", item.desc.value);
        const formateditemlist = item?.items.map((el) => ({
          _id: el.id,
          name: el?.name?.value ?? "",
          price: el?.price?.value ?? "",
          image: el?.image ?? "",
        }));

        setVisibilities(item.visibility);
        if (item?.availability) {
          const originalAvailability = reverseFormatAvailability(
            item?.availability
          );
          setAvailability(originalAvailability);
        }
        setIncomingVisibilities(item.visibility);
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
  useEffect(() => {
    fetchMenuData();

    fetchItemData();
  }, [editCatsId, setValue, setToastData]);

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

  const onSubmit = async (data: IFormInput) => {
    try {
      if (!isDuplicateCats) {
        if (!isValidNameAlphabetic(data.name)) {
          setToastData({
            message:
              "Please use only alphabets and numbers while adding or updating name.",
            type: "error",
          });
          return;
        }
      }
      const formattedAvailability = formatAvailability(availability);

      const updateInput: any = {
        _id: editCatsId || "",
        availability: formattedAvailability,
        visibility: visibilities,
      };

      let hasChanges = false;
      const addChange = (field: string, newValue: any) => {
        updateInput[field] = { value: newValue };
        hasChanges = true;
      };

      if (data.name !== changesMenu?.name?.value) {
        addChange("name", data.name);
      }

      if (data.description !== changesMenu?.desc?.value) {
        addChange("desc", data.description);
      }

      setBtnLoading(true);
      const prevSelectedMenuIds = prevItemsbfrEdit.map((item) => item._id);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;

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
            visibility: visibilities,
            availability: formattedAvailability,
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
          setisDuplicateCats(false);
          setisEditCats(false);
          setEditItemId(null);
        }
      } else {
        // EDIT CATEGORIES

        await sdk.updateCategory({
          input: updateInput,
        });

        isMenuAdded &&
          (await sdk.addItemToCategory({
            itemId: addedMenuIds,
            categoryId: editCatsId || "",
          }));

        setBtnLoading(false);
        setisDuplicateCats(false);
        setisEditCats(false);
        setisAddCategoryModalOpen(false);
        setfetchMenuDatas(!fetchMenuDatas);
        setEditItemId(null);
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
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
            _id: item._id || "",
            name: item?.name?.value || "",
            price: item?.price?.value || 0,
            image: item?.image || "",
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

  const handleItemClick = (item: ItemsDropDownType) => {
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

  const renderActions = (rowData: ItemsDropDownType) => (
    <div className="flex space-x-2 justify-center items-center">
      {/* <FaTrash */}
      <IoIosCloseCircleOutline
        className="text-red-400 text-lg cursor-pointer"
        onClick={() => {
          setConfirmationRemoval(true);
          setRemovingId(rowData?._id);
        }}
      />
      <MdArrowOutward
        className="text-primary  cursor-pointer"
        onClick={() => handleEditItem(rowData?._id)}
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

  const handleEditItem = (id: string) => {
    setisAddItemModalOpen(true);
    setEditItemId(id);
    setisEditItem(true);
  };

  const handleAddItem = () => {
    setisAddItemModalOpen(true);
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
          <IoIosCloseCircleOutline
            className="text-primary cursor-pointer"
            onClick={() => handleEditItem(item._id)}
          />
        </div>
      ),
    },
  ];

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

    if (isEditCats && isPresentInPrevItems) {
      const res = await sdk.removeItemFromCategory({
        categoryId: editCatsId || "",
        itemId: removingId,
      });

      setprevItemsbfrEdit((prevSelected) =>
        prevSelected.filter((item) => item._id !== removingId)
      );
    }
    setConfirmationRemoval(false);
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
            Display Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            id="name"
            className="input input-primary"
            placeholder="Enter category name"
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            This is the name your customer will see
          </p>
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
        <div>
          <FormAddTable
            data={data}
            isShowImage
            headings={headings}
            title="Items"
            emptyCaption="Add Items to the Category to activate it"
            emptyMessage="No items available"
            buttonText="Add Items"
            onAddClick={handleAddClick}
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            The Items on your category (eg. Pizza,Burger,Chocolate Cake).
          </p>
        </div>
        {visibilities.length > 0 && (
          <div className="mb-1">
            <label
              htmlFor="visibilityOptions"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Visibility Options
            </label>
            <div className="grid grid-cols-1 gap-4">
              {visibilities?.map((visibility, index) => (
                <CustomSwitchCard
                  key={index}
                  label={visibility.menuType}
                  title={visibility.menuType}
                  caption={`Do you want to activate for this type ${visibility.menuType}?`}
                  switchChecked={visibility.status === StatusEnum.Active}
                  onSwitchChange={() => {
                    const updatedVisibilities = visibilities.map((vib) =>
                      vib.menuType === visibility.menuType
                        ? {
                            ...vib,
                            status:
                              vib.status === StatusEnum.Active
                                ? StatusEnum.Inactive
                                : StatusEnum.Active,
                          }
                        : vib
                    );
                    setVisibilities(updatedVisibilities);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
          Availibility
        </label>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useRestaurantTimings"
            checked={useRestaurantTimings}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="useRestaurantTimings">
            Use Restaurant Timings for this Item
          </label>
        </div>

        <AvailabilityComponent
          availability={availability}
          setAvailability={setAvailability}
        />
        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          <div className="flex justify-center items-center ">
            {isEditCats ? "Update Category" : "Add Category"}
            {!isEditCats ? (
              <IoIosAddCircleOutline className="text-xl ml-1" />
            ) : (
              <RiEditCircleLine className="text-xl ml-1" />
            )}
          </div>
        </CButton>
      </form>

      <AddFormDropdown
        title="Add Items"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={itemsOption}
        tempSelectedItems={tempSelectedItems}
        handleItemClick={handleItemClick}
        handleAddItems={handleAddItems}
        headings={headingsDropdown}
        renderActions={renderActions}
        onClickCreatebtn={handleAddItem}
      />

      <ReusableModal
        isOpen={confirmationRemoval}
        onClose={() => {
          setConfirmationRemoval(false);
          setRemovingId("");
        }}
        title="Are you sure?"
        comments="By clicking yes the selected Item / items will be removed from this category. This action cannot be undone."
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

export default AddCategoryForm;
