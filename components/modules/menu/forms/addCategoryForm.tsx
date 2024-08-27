import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { DataItemFormAddTable } from "@/components/common/addFormDropDown/interface";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import ReusableModal from "@/components/common/modal/modal";
import FormAddTable from "@/components/common/table/formTable";
import {
  Availability,
  formatAvailability,
  reverseFormatAvailability,
} from "@/components/common/timingAvailibility/interface";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import { Day, MenuTypeEnum, StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuItemsStore from "@/store/menuItems";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
  roundOffPrice,
} from "@/utils/utilFUncs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { RiEditCircleLine } from "react-icons/ri";

interface IFormInput {
  name: string;
  description: string;
  items: string[];
  status: boolean;
}

interface ItemsDropDownType {
  _id: string;
  name: string;
  price: number;
  image: string;
  status: StatusEnum;
}

type ChangeItem = {
  _id: string;
  name?: string;
  price?: number;
};

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
    watch,
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

  const [useRestaurantTimings, setUseRestaurantTimings] = useState(
    isEditCats ? false : true
  );
  const setTimings = async () => {
    try {
      const response = await sdk.restaurantDetails();
      if (response && response.restaurantDetails) {
        const { availability } = response.restaurantDetails;
        if (availability) {
          const originalAvailability = reverseFormatAvailability(availability);
          setAvailability(originalAvailability);
        }
      }
    } catch (error) {
      setToastData({
        type: "error",
        message: "Failed to get Restaurant availibility",
      });
    }
  };

  useEffect(() => {
    setTimings();
  }, [useRestaurantTimings]);

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
      const response = await sdk.getAllMenus();

      if (response && response.getAllMenus) {
        const menuItems = response.getAllMenus.map(
          (menu: { name: string; type: MenuTypeEnum }) => ({
            name: menu.name,
            type: menu.type,
          })
        );

        let uniqueType = new Set<MenuTypeEnum>();

        menuItems.map((e) => uniqueType.add(e.type));

        setVisibilities(
          Array.from(uniqueType).map((e) => ({
            menuType: e,
            status: StatusEnum.Inactive,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const fetchCategoryData = async () => {
    if (editCatsId && (isEditCats || isDuplicateCats)) {
      try {
        const response = await sdk.getCategory({ id: editCatsId });

        if (response && response.getCategory) {
          const { name, desc, items, status, visibility, availability } =
            response.getCategory;

          setChangesMenu(response.getCategory);
          setValue("name", name);
          const nameDup = generateUniqueName(name);
          if (isDuplicateCats) {
            setValue("name", nameDup);
          }
          setValue("description", desc);
          const formateditemlist = items.map((el) => ({
            _id: el.id,
            name: el?.name ?? "",
            price: el?.price ?? "",
            image: el?.image ?? "",
            status: el?.status,
          }));
          setValue("status", status === StatusEnum.Active ? true : false);
          setVisibilities(visibility);
          if (availability) {
            const originalAvailability =
              reverseFormatAvailability(availability);
            setAvailability(originalAvailability);
          }
          setIncomingVisibilities(visibility);
          setSelectedItems(formateditemlist);
          setTempSelectedItems(formateditemlist);
          setprevItemsbfrEdit(formateditemlist);
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
  useEffect(() => {
    const fetchData = async () => {
      await setTimings();
      await fetchMenuData();
      await fetchCategoryData();
    };
    fetchData();
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

      if (data?.description?.length <= 20 || data?.description?.length >= 120) {
        setToastData({
          message:
            "Modifier Description should be between 60 to 120 characters",
          type: "error",
        });
        return;
      }

      const formattedAvailability = formatAvailability(availability);

      const updateInput: any = {
        _id: editCatsId || "",
        availability: formattedAvailability,
        visibility: visibilities,
      };

      let hasChanges = false;

      if (data.name !== changesMenu?.name) {
        updateInput.name = data.name;
        hasChanges = true;
      }

      if (data.description !== changesMenu?.desc) {
        updateInput.desc = data.description;
        hasChanges = true;
      }

      setBtnLoading(true);
      const prevSelectedMenuIds = prevItemsbfrEdit.map((item) => item._id);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;
      const statusSub = data.status ? StatusEnum.Active : StatusEnum.Inactive;
      const isAnyItemActive = selectedItems.some(
        (item) => item.status === StatusEnum.Active
      );
      if (statusSub === StatusEnum.Active && !isAnyItemActive) {
        setToastData({
          message:
            "You must have atleast one active item to make this category active",
          type: "error",
        });
        return;
      }
      if (statusSub !== changesMenu?.status) {
        updateInput.status = statusSub;
        hasChanges = true;
      }

      if (!isEditCats) {
        // ADD CATEGORIES/NEW CATEGORIES
        const res = await sdk.addCategory({
          input: {
            name: data.name,
            desc: data.description,
            status: statusSub,
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
        isMenuAdded &&
          (await sdk.addItemsToCategory({
            itemId: addedMenuIds,
            categoryId: editCatsId || "",
          }));
        if (hasChanges) {
          const resupdate = await sdk.updateCategory({
            input: updateInput,
          });
          if (resupdate.updateCategory)
            setToastData({
              type: "success",
              message: "Category Updated Successfully",
            });
        }
        setBtnLoading(false);
        setisDuplicateCats(false);
        setisEditCats(false);
        setisAddCategoryModalOpen(false);
        setfetchMenuDatas(!fetchMenuDatas);
        setEditItemId(null);
      }
    } catch (error) {
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
        const items = await sdk.getItemsForCategoryDropdown();
        if (items && items.getItems) {
          const formattedItemsList = items.getItems.map(
            (item: {
              _id: string;
              name: string;
              price: number;
              image?: string | null;
              status?: StatusEnum;
            }) => ({
              _id: item._id ?? "",
              name: item?.name ?? "",
              price: item?.price ?? 0,
              image: item?.image ?? "",
              status: item.status ?? StatusEnum.Inactive,
            })
          );
          const filteredItemsList = formattedItemsList.filter(
            (item) =>
              !selectedItems.some(
                (selectedItem) => selectedItem._id === item._id
              )
          );

          setItemsOption(filteredItemsList);
        }
      } catch (error) {
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleToggleSwitch = () => {
    if (visibilities.length > 1) {
      if (watch("status")) {
        // setValue("status", !watch("status"));
        setShowConfirmationModal(true);
      } else {
        setShowConfirmationModal(true);
      }
    } else {
      const isAnyItemActive = selectedItems.some(
        (item) => item.status === StatusEnum.Active
      );
      if (watch("status") === true) {
        setValue("status", !watch("status"));
      } else {
        if (isAnyItemActive) {
          setValue("status", !watch("status"));
          const updatedVisibilities = visibilities.map((vib) => ({
            menuType: vib.menuType,
            status: StatusEnum.Inactive,
          }));
          setVisibilities(updatedVisibilities);
        } else {
          setToastData({
            message:
              "You must have atleast one active item to make this category active",
            type: "error",
          });
        }
      }
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (visibilities.length === 1) {
      const updatedVisibilities = visibilities.map((vib) => ({
        menuType: vib.menuType,
        status: watch("status") ? StatusEnum.Active : StatusEnum.Inactive,
      }));
      setVisibilities(updatedVisibilities);
    }
  }, [watch("status")]);

  const handleConfirmation = async () => {
    setValue("status", !watch("status"));
    const updatedVisibilities = visibilities.map((vib) => ({
      menuType: vib.menuType,
      status: watch("status") ? StatusEnum.Active : StatusEnum.Inactive,
    }));
    setVisibilities(updatedVisibilities);
    setShowConfirmationModal(false);
  };
  const handleRejection = async () => {
    setValue("status", !watch("status"));
    setShowConfirmationModal(false);
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
          <MdArrowOutward
            className="text-primary cursor-pointer"
            onClick={() => handleEditItem(item._id)}
          />
        </div>
      ),
    },
  ];

  const handleRemoveCategory = async () => {
    try {
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
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleSave = async (updatedData: DataItemFormAddTable[]) => {
    const selectedItemsMap = new Map(
      selectedItems.map((item) => [item._id, item])
    );

    const changedData: ChangeItem[] = updatedData.reduce(
      (acc: ChangeItem[], item) => {
        const selectedItem = selectedItemsMap.get(item._id);
        if (selectedItem) {
          // Check for changes in price or name
          const changes: ChangeItem = { _id: item._id };
          if (selectedItem.price !== item.price) {
            changes.price = roundOffPrice(parseFloat(item.price.toString()));
          }
          if (selectedItem.name !== item.name) {
            changes.name = item.name;
          }
          if (Object.keys(changes).length > 1) {
            acc.push(changes);
          }
        }
        return acc;
      },
      []
    );
    // Log the formatted data
    console.log("Formatted Data:", changedData);

    // Call the API with the formatted data
    try {
      const res = await sdk.bulkUpdateItem({ input: changedData });
      if (res && res.bulkUpdateItem) {
        // Update the state with the new data
        setSelectedItems(updatedData as ItemsDropDownType[]);

        // Show success toast
        setToastData({
          message: "Modifier groups updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      // Show error toast
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-4xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <form
        className="space-y-4 md:space-y-3 w-full "
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
            onSave={handleSave}
          />
          <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
            The Items on your category (eg. Pizza,Burger,Chocolate Cake).
          </p>
        </div>
        <div className="mb-1">
          <CustomSwitchCard
            label="Status"
            title="Status"
            caption="If its checked ,you can use this item in Categories and Menus"
            switchChecked={watch("status")}
            // onSwitchChange={() => setValue("status", !watch("status"))}
            onSwitchChange={() => handleToggleSwitch()}
          />

          {errors.status && (
            <p className="text-red-500 text-sm text-start">
              {errors.status.message}
            </p>
          )}
        </div>
        {visibilities.length > 1 && (
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
          <button
            type="button"
            className="text-sm text-primary flex items-center cursor-pointer"
            onClick={async () => {
              setUseRestaurantTimings(!useRestaurantTimings);
            }}
          >
            <span className=" hover:underline">
              Use Restaurant Timings for this Item
            </span>
          </button>
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
      {/* STATUS CONFIRMATION */}
      <ReusableModal
        title="Confirm Status Change"
        comments="Do you want to change the visibility for All the menus"
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        width="md"
      >
        <div className="flex justify-end mt-4 space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Outlined}
            onClick={handleRejection}
          >
            No
          </CButton>
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            onClick={handleConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddCategoryForm;
