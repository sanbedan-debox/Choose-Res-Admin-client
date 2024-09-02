import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { DataItemFormAddTable } from "@/components/common/addFormDropDown/interface";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import FormAddTable from "@/components/common/table/formTable";
import {
  Availability,
  formatAvailability,
  reverseFormatAvailability,
} from "@/components/common/timingAvailibility/interface";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import { AvailabilityInput, MenuTypeEnum } from "@/generated/graphql";
import { initAvailability } from "@/lib/commonConstants";
import { formatMenuType, menuTypeOptions } from "@/lib/menuBuilderConstants";
import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuMenuStore from "@/store/menumenu";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
} from "@/utils/utilFUncs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { RiEditCircleLine } from "react-icons/ri";
import Select from "react-select";

interface IFormInput {
  type: { value: string; label: string };
  name: string;
}

interface ListType {
  _id: string;
  name: string;
}

interface IModalState {
  showDeleteConfirmation: boolean;
  showAddNewModal: boolean;
  selectedId: string;
}

const AddMenuForm = () => {
  // Configs
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
    clearErrors,
  } = useForm<IFormInput>();

  // Global states
  const {
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    setIsAddMenuModalOpen,
    isFromUploadCSV,
    setIsAddCategoryModalOpen,
  } = useMenuOptionsStore();

  const { editMenuId, isEditMenu, isDuplicateMenu, setIsDuplicateMenu } =
    useMenuMenuStore();

  const { setToastData, setIsShowTaxSettings } = useGlobalStore();
  const { setEditCatsId, setIsEditCats } = useMenuCategoryStore();
  const { taxRate } = useAuthStore();

  // Modal states
  const initModalState: IModalState = {
    showDeleteConfirmation: false,
    showAddNewModal: false,
    selectedId: "",
  };

  const [modalStates, setModalStates] = useState<IModalState>(initModalState);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add Form states
  const [selectedList, setSelectedList] = useState<ListType[]>([]);
  const [masterList, setMasterList] = useState<ListType[]>([]);

  // Edit states
  const [menuData, setMenuData] = useState<{
    _id: string;
    name: string;
    type: { label: string; value: string };
    availability: Availability[];
    categories: { _id: string; name: string }[];
  } | null>(null);

  // Availability
  const [availability, setAvailability] =
    useState<Availability[]>(initAvailability);

  // API Calls
  useEffect(() => {
    // Fetch all the categories for this restaurant
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await sdk.getCategoriesForMenuDropdown();
        if (!response || !response.getCategories) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }

        const categories: ListType[] = response.getCategories.map((el) => ({
          _id: el._id.toString(),
          name: el.name.toString(),
        }));
        setMasterList(categories);

        // Update selected list
        let sl = [...selectedList];
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          let idx = selectedList.findIndex((e) => e._id === category._id);
          if (idx >= 0) {
            sl[idx].name = category.name;
          }
        }
        setSelectedList(sl);
      } catch (error) {
        const errMsg = extractErrorMessage(error);
        setToastData({ message: errMsg, type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshMenuBuilderData]);

  useEffect(() => {
    // Fetch menu details from id and set in the form
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await sdk.getMenu({ id: editMenuId ?? "" });
        if (!response || !response.getMenu) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }

        const menu = response.getMenu;

        // Format availability
        const formattedAvailability =
          (menu.availability?.length ?? 0) > 0
            ? reverseFormatAvailability(menu.availability ?? [])
            : initAvailability;

        setAvailability(formattedAvailability);

        // Set form values
        setValue(
          "name",
          isDuplicateMenu ? generateUniqueName(menu.name) : menu.name
        );
        setValue("type", {
          label: formatMenuType(menu.type),
          value: menu.type,
        });

        // Set selected list
        let selectedIds = menu.categories.map((e) => e._id._id.toString());
        let selected = masterList.filter((e) =>
          selectedIds.includes(e._id.toString())
        );

        setSelectedList(selected);
        // Set menu data if editing
        if (isEditMenu) {
          setMenuData({
            _id: menu._id.toString() ?? "",
            availability: formattedAvailability,
            name: menu.name,
            type: {
              label: formatMenuType(menu.type),
              value: menu.type,
            },
            categories: selected,
          });
        }
      } catch (error) {
        const errMsg = extractErrorMessage(error);
        setToastData({ message: errMsg, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (
      (isEditMenu || isDuplicateMenu) &&
      (editMenuId !== null || editMenuId !== "") &&
      masterList.length > 0
    ) {
      fetch();
    }
  }, [isEditMenu, editMenuId, isDuplicateMenu, masterList]);

  useEffect(() => {
    fetchRestoTiming();
  }, []);

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

  // Handler functions
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
      const prevSelectedMenuIds = menuData?.categories?.map((item) => item._id);
      const selectedItemsIds = selectedList.map((item) => item._id);
      const isMenuAdded = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds?.includes(id)
      );
      const formattedAvailability = formatAvailability(availability);

      const updateInput: {
        name?: string;
        type?: MenuTypeEnum;
        _id: string;
        availability: AvailabilityInput[];
      } = {
        _id: editMenuId || "",
        availability: formattedAvailability,
      };

      if (data.name !== menuData?.name) {
        updateInput.name = data.name;
      }

      if (!isEditMenu) {
        const res = await sdk.addMenu({
          input: {
            type: data.type.value as MenuTypeEnum,
            name: data.name,
            categories: selectedItemsIds,
            taxRateId: taxRate?.id || null,
            availability: formattedAvailability,
          },
        });

        if (res && res.addMenu) {
          setToastData({
            type: "success",
            message: "Menu Added Successfully",
          });
        }
      } else {
        if (isMenuAdded.length > 0) {
          const res = await sdk.addCategoriesToMenu({
            categoryId: isMenuAdded,
            menuId: editMenuId || "",
          });
          if (res && res.addCategoriesToMenu) {
            setToastData({
              type: "success",
              message: "Category Added Successfully",
            });
          }
        }

        const res = await sdk.updateMenu({
          input: updateInput,
        });
        if (res && res.updateMenu) {
          setToastData({
            type: "success",
            message: "Menu Updated Successfully",
          });
        }
      }
      setActionLoading(false);
      setIsAddMenuModalOpen(false);
      setRefreshMenuBuilderData(!refreshMenuBuilderData);
      setIsDuplicateMenu(false);
      setIsEditCats(false);
      setEditCatsId(null);
    } catch (error: any) {
      setActionLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleRemoveCategory = async () => {
    const isPresentInPrevItems = menuData?.categories?.some(
      (item) => item._id === modalStates.selectedId
    );

    if (isEditMenu && isPresentInPrevItems) {
      const res = await sdk.removeCategoryFromMenu({
        categoryId: modalStates.selectedId,
        menuId: editMenuId || "",
      });
      if (res && res.removeCategoryFromMenu) {
        setSelectedList((prevSelected) =>
          prevSelected.filter((item) => item._id !== modalStates.selectedId)
        );
        if (isPresentInPrevItems) {
          // Removed Category from menu data
          setMenuData((prevMenuData) =>
            prevMenuData
              ? {
                  ...prevMenuData,
                  categories: prevMenuData.categories.filter(
                    (item) => item._id !== modalStates.selectedId
                  ),
                }
              : prevMenuData
          );
        }

        setModalStates((prev) => ({
          ...prev,
          showDeleteConfirmation: false,
          selectedId: "",
        }));
      } else {
        setToastData({
          type: "error",
          message: "Something went wrong,Please try again later",
        });
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
  };

  const handleEditCategory = (id: string) => {
    setIsAddCategoryModalOpen(true);
    setIsEditCats(true);
    setEditCatsId(id);
  };

  const handleAddCategoriesToMenu = (idsList: string[]) => {
    // Set selected list
    if (masterList.length > 0) {
      let newSelections = masterList.filter((e) =>
        idsList.includes(e._id.toString())
      );

      setSelectedList((prev) => [...prev, ...newSelections]);
    }
    setModalStates((prev) => ({ ...prev, showAddNewModal: false }));
  };

  const handleSave = async (updatedData: DataItemFormAddTable[]) => {
    // format the updated data
    const formattedData = updatedData.map((item) => ({
      _id: item._id,
      name: item.name,
    }));
    // Call API to updated data

    try {
      const res = await sdk.bulkUpdateCategory({ input: formattedData });
      if (res && res.bulkUpdateCategory) {
        setSelectedList(formattedData as ListType[]);
        // Handle
        setToastData({
          message: "Modifier groups updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
  };

  // Table configs
  const listHeadings = [
    {
      title: "Actions",
      dataKey: "name",
      render: (row: ListType) => {
        return (
          <div className="flex space-x-2 justify-center">
            <IoIosCloseCircleOutline
              className="text-red-400 text-lg cursor-pointer"
              onClick={() => {
                setModalStates((prev) => ({
                  ...prev,
                  showDeleteConfirmation: true,
                  selectedId: row._id,
                }));
              }}
            />
            <MdArrowOutward
              className="text-primary cursor-pointer"
              onClick={() => {
                handleEditCategory(row._id);
              }}
            />
          </div>
        );
      },
    },
  ];

  const masterListHeadings = [
    {
      title: "Actions",
      dataKey: "name",
      render: (row: ListType) => {
        return (
          <div className="flex space-x-2 justify-center">
            <MdArrowOutward
              className="text-primary cursor-pointer"
              onClick={() => handleEditCategory(row._id)}
            />
          </div>
        );
      },
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
      {/* {loading && <Loader />} */}
      <form
        className="space-y-4 md:space-y-3 w-full"
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
            onChange={(e) => {
              clearErrors("name");
              setValue("name", e.target.value);
            }}
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
                classNames={{
                  option: (state) =>
                    `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                      state.isSelected ? "!bg-primary text-white" : ""
                    }  `,
                }}
                options={menuTypeOptions}
                isDisabled={isEditMenu}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select menu type"
                onChange={(selectedOption) => {
                  clearErrors("type");
                  field.onChange(selectedOption);
                }}
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

        {!isFromUploadCSV ? (
          <>
            <br />
            <div>
              <FormAddTable
                data={selectedList}
                headings={listHeadings}
                title="Categories"
                emptyCaption="Add Categories to your menu"
                emptyMessage="No Categories selected"
                buttonText="Add Categories"
                onAddClick={() =>
                  setModalStates((prev) => ({ ...prev, showAddNewModal: true }))
                }
                onSave={handleSave}
              />
              <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
                Select the categories and items you want to be in this menu.
              </p>
            </div>
            <br />
          </>
        ) : null}

        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
          Availibility
        </label>
        <div className="flex items-center mb-4">
          <button
            type="button"
            className="text-sm text-primary flex items-center cursor-pointer"
            onClick={async () => {
              await fetchRestoTiming();
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
        {!isFromUploadCSV ? (
          <>
            {!taxRate?.salesTax ? (
              <>
                <br />
                <div className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-start text-md">
                      Tax Rate
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {`It's mandatory to add a tax rate to make this menu available`}
                    </p>
                  </div>
                  <div>
                    <CButton
                      loading={actionLoading}
                      variant={ButtonType.Outlined}
                      type="button"
                      onClick={() => setIsShowTaxSettings(true)}
                      className="w-full"
                    >
                      <div className="flex justify-center items-center">
                        Add Tax Rate
                        <IoIosAddCircleOutline className="text-xl ml-1" />
                      </div>
                    </CButton>
                  </div>
                </div>
                <br />
              </>
            ) : (
              <>
                <br />
                <div className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white opacity-50 cursor-not-allowed">
                  <div>
                    <h3 className="font-semibold text-start text-md">
                      Tax Rate
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {`It's applied to this menu and all the items in it`}
                    </p>
                  </div>
                  <div>{taxRate?.salesTax} %</div>
                </div>
                <p className="text-gray-500 text-xs text-start">
                  To edit / update tax rate click{" "}
                  <span
                    onClick={() => setIsShowTaxSettings(true)}
                    className="text-primary cursor-pointer"
                  >
                    here
                  </span>
                </p>
                <br />
              </>
            )}
          </>
        ) : null}

        <CButton
          loading={actionLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          <div className="flex justify-center items-center">
            {isEditMenu ? "Update Menu" : "Add Menu"}
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
          setIsAddCategoryModalOpen(true);
        }}
        addHandler={handleAddCategoriesToMenu}
      />

      {/* Removal Modall */}
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
        comments="By clicking yes the selected category / categories will be removed from this menu. This action cannot be undone."
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
    </motion.div>
  );
};

export default AddMenuForm;
