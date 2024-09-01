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
import Loader from "@/components/loader";
import {
  AvailabilityInput,
  MenuTypeEnum,
  StatusEnum,
  UpdateCategoryInput,
} from "@/generated/graphql";
import { initAvailability } from "@/lib/commonConstants";
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

interface ListType {
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

interface IModalState {
  showDeleteConfirmation: boolean;
  showAddNewModal: boolean;
  selectedId: string;
  showConfirmationModal: boolean;
}

const AddCategoryForm = () => {
  // Config
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    control,
  } = useForm<IFormInput>();

  // Global States
  const {
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    setIsAddCategoryModalOpen,
    setIsAddItemModalOpen,
  } = useMenuOptionsStore();

  const {
    editCatsId,
    isEditCats,
    isDuplicateCats,
    setIsDuplicateCats,
    setIsEditCats,
  } = useMenuCategoryStore();

  const { setEditItemId, setIsEditItem } = useMenuItemsStore();

  const { setToastData } = useGlobalStore();

  // Modal States
  const initModalState: IModalState = {
    showDeleteConfirmation: false,
    showAddNewModal: false,
    selectedId: "",
    showConfirmationModal: false,
  };

  const [modalStates, setModalStates] = useState<IModalState>(initModalState);

  // Add Form states
  const [selectedList, setSelectedList] = useState<ListType[]>([]);
  const [masterList, setMasterList] = useState<ListType[]>([]);

  // Local States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [categoryData, setCategoryData] = useState<{
    _id: string;
    name: string;
    description: string;
    status: string;
    items: {
      _id: string;
      name: string;
      price: number;
      image: string;
      status: StatusEnum;
    }[];
  } | null>(null);

  // Availability
  const [availability, setAvailability] =
    useState<Availability[]>(initAvailability);

  // Visibility States
  const [visibilities, setVisibilities] = useState<
    {
      menuType: MenuTypeEnum;
      status: StatusEnum;
    }[]
  >([]);

  // API calls
  useEffect(() => {
    const fetchData = async () => {
      await fetchRestoTiming();
      await fetchMenuData();
      await fetchCategoryData();
    };
    fetchData();
  }, [editCatsId, isEditCats, isDuplicateCats, masterList]);

  useEffect(() => {
    // Fetch all the items for this restaurant
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await sdk.getItemsForCategoryDropdown();
        if (!response || !response.getItems) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }

        const items: ListType[] = response.getItems.map((el) => ({
          _id: el._id.toString(),
          name: el.name.toString(),
          image: el.image?.toString() ?? "",
          price: el.price,
          status: el.status as StatusEnum,
        }));

        // Update selected list
        let sl = [...selectedList];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          let idx = selectedList.findIndex((e) => e._id === item._id);
          if (idx >= 0) {
            sl[idx].name = item.name;
            sl[idx].image = item.image;
            sl[idx].price = item.price;
            sl[idx].status = item.status;
          }
        }
        setSelectedList(sl);
        setMasterList(items);
      } catch (error) {
        const errMsg = extractErrorMessage(error);
        setToastData({ message: errMsg, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [refreshMenuBuilderData]);

  // fetch Menu data for visibilities
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
      setToastData({
        type: "error",
        message: extractErrorMessage(error),
      });
    }
  };

  // Fetch category details from id and set in the form
  const fetchCategoryData = async () => {
    if (editCatsId && (isEditCats || isDuplicateCats)) {
      setLoading(true);
      try {
        const response = await sdk.getCategory({ id: editCatsId });

        if (!response || !response.getCategory) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }

        const category = response.getCategory;

        const formattedAvailability =
          (category.availability?.length ?? 0) > 0
            ? reverseFormatAvailability(category.availability ?? [])
            : initAvailability;
        setAvailability(formattedAvailability);

        setValue(
          "name",
          isDuplicateCats ? generateUniqueName(category.name) : category.name
        );

        setValue("description", category.desc ?? "");

        let selectedIds = category.items.map((e) => e._id._id.toString());
        let selected = masterList.filter((e) =>
          selectedIds.includes(e._id.toString())
        );
        setSelectedList(selected);

        setValue(
          "status",
          category.status === StatusEnum.Active ? true : false
        );
        setVisibilities(category.visibility);
        setCategoryData({
          _id: category._id,
          name: category.name,
          description: category.desc ?? "",
          status: category.status,
          items: selected,
        });
      } catch (error) {
        setToastData({
          type: "error",
          message: extractErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper functions
  const fetchRestoTiming = async () => {
    setLoading(true);
    try {
      const response = await sdk.restaurantTimings();
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
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: IFormInput) => {
    setActionLoading(true);
    try {
      if (!isValidNameAlphabetic(data.name)) {
        setToastData({
          message:
            "Please use only alphabets and numbers while adding or updating name.",
          type: "error",
        });
        return;
      }

      const formattedAvailability = formatAvailability(availability);

      const updateInput: {
        _id: string;
        availability?: AvailabilityInput[];
        visibility?: {
          menuType: MenuTypeEnum;
          status: StatusEnum;
        }[];
        name?: string;
        desc?: String;
        status?: StatusEnum;
      } = {
        _id: editCatsId || "",
        availability: formattedAvailability,
        visibility: visibilities,
      };

      let hasChanges = false;

      if (data.name !== categoryData?.name) {
        updateInput.name = data.name;
        hasChanges = true;
      }

      if (data.description !== categoryData?.description) {
        updateInput.desc = data.description;
        hasChanges = true;
      }

      setActionLoading(true);
      const prevSelectedMenuIds = categoryData?.items?.map((item) => item._id);
      const selectedItemsIds = selectedList.map((item) => item._id);
      const addedItemsList = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds?.includes(id)
      );

      const statusSub = data.status ? StatusEnum.Active : StatusEnum.Inactive;

      //CHECK IF ITEM IS ACTIVE OR NOT
      const isAnyItemActive = selectedList.some(
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

      if (statusSub !== categoryData?.status) {
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
          setActionLoading(false);
          setIsAddCategoryModalOpen(false);
          setRefreshMenuBuilderData(!refreshMenuBuilderData);
          setIsDuplicateCats(false);
          setIsEditCats(false);
          setEditItemId(null);
        }
      } else {
        // EDIT CATEGORIES
        if (addedItemsList.length > 0) {
          const res = await sdk.addItemsToCategory({
            itemId: addedItemsList,
            categoryId: editCatsId || "",
          });
          if (res && res.addItemsToCategory) {
            setToastData({
              type: "success",
              message: "Item Added Succesfully",
            });
          }
        }

        if (hasChanges) {
          const resupdate = await sdk.updateCategory({
            input: updateInput as UpdateCategoryInput,
          });

          if (resupdate && resupdate.updateCategory)
            setToastData({
              type: "success",
              message: "Category Updated Successfully",
            });
        }
        setActionLoading(false);
        setIsDuplicateCats(false);
        setIsEditCats(false);
        setIsAddCategoryModalOpen(false);
        setRefreshMenuBuilderData(!refreshMenuBuilderData);
        setEditItemId(null);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handler Functions

  const handleAddItems = (idsList: string[]) => {
    if (masterList.length > 0) {
      let newSelections = masterList.filter((e) =>
        idsList.includes(e._id.toString())
      );

      setSelectedList((prev) => [...prev, ...newSelections]);
    }
    setModalStates((prev) => ({ ...prev, showAddNewModal: false }));
  };

  const handleToggleSwitch = () => {
    if (visibilities.length > 1) {
      setModalStates((prev) => ({
        ...prev,
        showConfirmationModal: true,
      }));
    } else {
      const isAnyItemActive = selectedList.some(
        (item) => item.status === StatusEnum.Active
      );
      if (getValues("status") === true) {
        setValue("status", !getValues("status"));
      } else {
        if (isAnyItemActive) {
          setValue("status", !getValues("status"));
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
    setModalStates((prev) => ({
      ...prev,
      showConfirmationModal: false,
    }));
  };

  useEffect(() => {
    if (visibilities.length === 1) {
      const updatedVisibilities = visibilities.map((vib) => ({
        menuType: vib.menuType,
        status: getValues("status") ? StatusEnum.Active : StatusEnum.Inactive,
      }));
      setVisibilities(updatedVisibilities);
    }
  }, [getValues("status")]);

  const handleConfirmation = async () => {
    setValue("status", !getValues("status"));
    const updatedVisibilities = visibilities.map((vib) => ({
      menuType: vib.menuType,
      status: getValues("status") ? StatusEnum.Active : StatusEnum.Inactive,
    }));
    setVisibilities(updatedVisibilities);
    setModalStates((prev) => ({
      ...prev,
      showConfirmationModal: false,
    }));
  };
  const handleRejection = async () => {
    setValue("status", !getValues("status"));
    setModalStates((prev) => ({
      ...prev,
      showConfirmationModal: false,
    }));
  };
  const handleAddClick = () => {
    setModalStates((prev) => ({
      ...prev,
      showAddNewModal: true,
    }));
  };

  const handleEditItem = (id: string) => {
    setIsAddItemModalOpen(true);
    setEditItemId(id);
    setIsEditItem(true);
  };

  const handleRemoveCategory = async () => {
    try {
      const isPresentInPrevItems = categoryData?.items?.some(
        (item) => item._id === modalStates.selectedId
      );

      if (isEditCats && isPresentInPrevItems) {
        const res = await sdk.removeItemFromCategory({
          itemId: modalStates.selectedId,
          categoryId: editCatsId ?? "",
        });
        if (res && res.removeItemFromCategory) {
          setSelectedList((prevSelected) =>
            prevSelected.filter((item) => item._id !== modalStates.selectedId)
          );

          setCategoryData((prevCategoryData) =>
            prevCategoryData
              ? {
                  ...prevCategoryData,
                  items: prevCategoryData.items.filter(
                    (item) => item._id !== modalStates.selectedId
                  ),
                }
              : prevCategoryData
          );
          setModalStates((prev) => ({
            ...prev,
            showDeleteConfirmation: false,
            selectedId: "",
          }));
        }
      } else {
        setSelectedList((prevSelected) =>
          prevSelected.filter((item) => item._id !== modalStates.selectedId)
        );
        setModalStates((prev) => ({
          ...prev,
          showDeleteConfirmation: false,
          selectedId: "",
        }));
      }
    } catch (error) {
      setToastData({
        type: "error",
        message: extractErrorMessage(error),
      });
    }
  };

  const handleSave = async (updatedData: DataItemFormAddTable[]) => {
    const selectedItemsMap = new Map(
      selectedList.map((item) => [item._id, item])
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

    try {
      const res = await sdk.bulkUpdateItem({ input: changedData });
      if (res && res.bulkUpdateItem) {
        // Update the state with the new data
        setSelectedList(updatedData as ListType[]);

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

  // Table Configs
  const listHeadings = [
    { title: "Price", dataKey: "price" },
    {
      title: "Actions",
      dataKey: "name",
      render: (rowData: ListType) => {
        return (
          <div className="flex space-x-2 justify-center items-center">
            {/* <FaTrash */}
            <IoIosCloseCircleOutline
              className="text-red-400 text-lg cursor-pointer"
              onClick={() => {
                setModalStates((prev) => ({
                  ...prev,
                  showDeleteConfirmation: true,
                  selectedId: rowData._id,
                }));
              }}
            />
            <MdArrowOutward
              className="text-primary  cursor-pointer"
              onClick={() => handleEditItem(rowData?._id)}
            />
          </div>
        );
      },
    },
  ];

  const masterListHeadings = [
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
      className="z-10 w-full min-h-full max-w-4xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {loading && <Loader />}
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
            data={selectedList}
            isShowImage
            headings={listHeadings}
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
            switchChecked={getValues("status")}
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
              fetchRestoTiming();
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
          loading={actionLoading}
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
        title="Add Categories"
        isOpen={modalStates.showAddNewModal}
        onClose={() =>
          setModalStates((prev) => ({ ...prev, showAddNewModal: false }))
        }
        data={masterList.filter(
          (e) => !selectedList.map((el) => el._id).includes(e._id)
        )}
        headings={masterListHeadings}
        createLabel="Create new category"
        addLabel="Add selected categories"
        createClickHandler={() => {
          setIsAddItemModalOpen(true);
        }}
        addHandler={handleAddItems}
      />
      <ReusableModal
        isOpen={modalStates.showDeleteConfirmation}
        onClose={() => {
          setModalStates((prev) => ({
            ...prev,
            showDeleteConfirmation: false,
            selectedId: "",
          }));
        }}
        title="Are you sure?"
        comments="By clicking yes the selected Item / items will be removed from this category. This action cannot be undone."
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={actionLoading}
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
        isOpen={modalStates.showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        width="md"
      >
        <div className="flex justify-end mt-4 space-x-4">
          <CButton
            loading={actionLoading}
            variant={ButtonType.Outlined}
            onClick={handleRejection}
          >
            No
          </CButton>
          <CButton
            loading={actionLoading}
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
