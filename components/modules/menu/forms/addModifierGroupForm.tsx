import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { DataItemFormAddTable } from "@/components/common/addFormDropDown/interface";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CountSelector from "@/components/common/countSelector/countSelector";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import ReusableModal from "@/components/common/modal/modal";
import FormAddTable from "@/components/common/table/formTable";
import Loader from "@/components/loader";
import { PriceTypeEnum } from "@/generated/graphql";
import { PricingTypeOptions } from "@/lib/menuBuilderConstants";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import useModStore from "@/store/modifiers";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
  roundOffPrice,
} from "@/utils/utilFUncs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { RiEditCircleLine } from "react-icons/ri";
import Select from "react-select";

interface IFormInput {
  name: string;
  optional: boolean;
  multiSelect: boolean;
  pricingType: { label: string; value: string };
  maxSelections: number;
  minSelections: number;
  commonPrice: number;
  desc: string;
}
interface ListType {
  _id: string;
  name: string;
  price: number;
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

const AddModifierGroupForm = () => {
  // Config
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>({
    defaultValues: {
      maxSelections: 1,
      minSelections: 0,
    },
  });

  // Global States
  const {
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    setIsAddModifierGroupModalOpen,
    setIsAddModifierModalOpen,
  } = useMenuOptionsStore();

  const {
    editModGroupId,
    isEditModGroup,
    setEditModGroupId,
    setIsEditModGroup,
    isDuplicateModifierGroup,
    setMaxSelectionsCount,
    setMinSelectionsCount,
    setModifiersLength,
  } = useModGroupStore();

  const { setToastData } = useGlobalStore();

  const { setEditModId, setIsEditMod } = useModStore();

  // Modal States
  const initModalState: IModalState = {
    showDeleteConfirmation: false,
    showAddNewModal: false,
    selectedId: "",
    showConfirmationModal: false,
  };

  const [modalStates, setModalStates] = useState<IModalState>(initModalState);

  // Local States
  const [masterList, setMasterList] = useState<ListType[]>([]);
  const [selectedList, setSelectedList] = useState<ListType[]>([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [modifierData, setModifierData] = useState<{
    _id: string;
    name: string;
    price: number;
    modifiers: { id: string; name: string; price: number }[];
    maxSelections: number;
    minSelections: number;
    desc: string;
    pricingType: PriceTypeEnum;
    optional: boolean;
    multiSelect: boolean;
  } | null>(null);

  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);

  // Api Call
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        const response = await sdk.getModifiersforGroupDropDown();
        if (!response || !response.getModifiers) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }

        const categories: ListType[] = response.getModifiers.map((el) => ({
          _id: el._id.toString(),
          name: el.name.toString(),
          price: el.price,
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
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshMenuBuilderData]);

  useEffect(() => {
    const fetchItemData = async () => {
      if (editModGroupId && (isEditModGroup || isDuplicateModifierGroup)) {
        try {
          const response = await sdk.getModifierGroup({ id: editModGroupId });
          if (response && response.getModifierGroup) {
            const {
              name,
              maxSelections,
              modifiers,
              minSelections,
              desc,
              price,
              pricingType,
              optional,
              multiSelect,
            } = response.getModifierGroup;

            setModifierData({
              _id: editModGroupId,
              name,
              maxSelections,
              minSelections,
              desc,
              price,
              pricingType,
              optional,
              multiSelect,
              modifiers,
            });

            setValue(
              "name",
              isDuplicateModifierGroup ? generateUniqueName(name) : name
            );

            setValue("minSelections", minSelections);
            setValue("maxSelections", maxSelections);

            setMinSelection(minSelections);
            setMaxSelection(maxSelections);
            setValue("desc", desc || "");
            setValue("commonPrice", price ?? 0);
            setValue("optional", optional ?? false);
            setValue("multiSelect", multiSelect ?? false);
            const selectedPriceType = PricingTypeOptions.find(
              (option) => option.value === pricingType
            );
            setValue(
              "pricingType",
              selectedPriceType || PriceTypeEnum.FreeOfCharge
            );

            // Set selected list
            let selectedIds = modifiers.map((e) => e.id.toString());
            let selected = masterList.filter((e) =>
              selectedIds.includes(e._id.toString())
            );

            setMaxSelectionsCount(maxSelections);
            setMinSelectionsCount(minSelections);
            setModifiersLength(selected.length || 0);
            setSelectedList(selected);
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

    fetchItemData();
  }, [editModGroupId, isEditModGroup, isDuplicateModifierGroup, masterList]);

  // Helper Functions

  useEffect(() => {
    setModifiersLength(selectedList.length || 0);
  }, [selectedList, watch("minSelections"), watch("maxSelections")]);

  // Handler Functions

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

      if (
        data.pricingType?.value === PriceTypeEnum.SamePrice &&
        (!data.commonPrice || data.commonPrice <= 0)
      ) {
        setToastData({
          message:
            "An Modifier Group cannot be added without price, please add a numerical value that is greater than zero to save and continue",
          type: "error",
        });
        return;
      }

      if (data?.desc?.length <= 20 || data?.desc?.length >= 120) {
        setToastData({
          message:
            "Modifier Group Description should be between 20 to 120 characters",
          type: "error",
        });
        return;
      }
      const parsedMaxSelection =
        parseFloat(data?.maxSelections?.toString()) || 0;
      const parsedMinSelection =
        parseFloat(data?.minSelections?.toString()) || 0;
      const parsedOptionalBoolean = data.optional ? true : false;
      const parsedMultiSelectBoolean = data.multiSelect ? true : false;
      parseFloat(data?.minSelections?.toString()) || 0;

      const prevSelectedMenuIds = modifierData?.modifiers?.map(
        (item) => item.id
      );

      if (parsedMaxSelection < parsedMinSelection) {
        setToastData({
          type: "error",
          message: `Maximum Selections can never be less than Minimum Selection`,
        });
        return;
      }

      const selectedItemsIds = selectedList.map((item) => item._id);
      const isMenuAdded = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds?.includes(id)
      );

      if (selectedItemsIds.length === 0) {
        setToastData({
          type: "error",
          message: "At least one modifier must be selected.",
        });
        return;
      }

      const parsedPriceCommon = roundOffPrice(
        parseFloat(data?.commonPrice?.toString())
      );

      const updateInput: {
        _id: string;
        desc: string;
        pricingType: PriceTypeEnum;
        price: number;
        minSelections: number;
        maxSelections: number;
        optional?: boolean;
        multiSelect?: boolean;
        name?: string;
      } = {
        _id: editModGroupId || "",
        desc: data.desc || "",

        pricingType: data.pricingType?.value as PriceTypeEnum,

        price: parsedPriceCommon || 0,

        minSelections: parsedMinSelection || 0,

        maxSelections: parsedMaxSelection || 0,
        optional: data.optional,
        multiSelect: data.multiSelect,
      };
      let hasChanges = false;

      if (data.name !== modifierData?.name) {
        updateInput.name = data.name;
        hasChanges = true;
      }

      if (data.optional !== modifierData?.optional) {
        updateInput.optional = data.optional;
        hasChanges = true;
      }
      if (data.multiSelect !== modifierData?.multiSelect) {
        updateInput.multiSelect = data.multiSelect;
        hasChanges = true;
      }

      if (!isEditModGroup) {
        await sdk.addModifierGroup({
          input: {
            price: parsedPriceCommon || 0,

            desc: data.desc,

            name: data.name,

            minSelections: parsedMinSelection,

            maxSelections: parsedMaxSelection,

            optional: parsedOptionalBoolean,
            multiSelect: parsedMultiSelectBoolean,
            pricingType: data.pricingType?.value as PriceTypeEnum,
          },
          modifiers: selectedItemsIds,
        });
        setToastData({
          type: "success",
          message: "Modifier Groups Added Successfully",
        });
      } else {
        if (isMenuAdded.length > 0) {
          const res = await sdk.addModifierToGroup({
            modifierIds: isMenuAdded,
            modifierGroupId: editModGroupId || "",
          });
          if (res && res.addModifierToGroup) {
            setToastData({
              message: "Modifers Added Successfully",
              type: "success",
            });
          }
        }

        const res = await sdk.updateModifierGroup({
          input: updateInput,
        });
        if (res && res.updateModifierGroup) {
          setToastData({
            message: "Modifer Groups Updated succesfully",
            type: "success",
          });
        }
      }

      setToastData({
        type: "success",
        message: "Modifier Groups Updated Successfully",
      });
      setIsAddModifierGroupModalOpen(false);
      setRefreshMenuBuilderData(!refreshMenuBuilderData);

      setIsEditModGroup(false);
      setEditModGroupId(null);
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

  const handleAddModifiers = (idsList: string[]) => {
    // Set selected list
    if (masterList.length > 0) {
      let newSelections = masterList.filter((e) =>
        idsList.includes(e._id.toString())
      );

      setSelectedList((prev) => [...prev, ...newSelections]);
    }
    setModalStates((prev) => ({ ...prev, showAddNewModal: false }));
  };

  const handleEditItem = (id: string) => {
    setIsAddModifierModalOpen(true);
    setEditModId(id);
    setIsEditMod(true);
  };

  const handleMinCountChange = (count: number) => {
    setValue("minSelections", count);
    setMinSelectionsCount(count);
  };

  const handleMaxCountChange = (count: number) => {
    setValue("maxSelections", count);
    setMaxSelectionsCount(count);
  };

  const handleRemoveModifiers = async () => {
    try {
      const isPresentInPrevItems = modifierData?.modifiers?.some(
        (item) => item.id === modalStates.selectedId
      );
      if (isEditModGroup && isPresentInPrevItems) {
        const res = await sdk.removeModifierFromGroup({
          modifierGroupId: editModGroupId ?? "",
          modifierId: modalStates.selectedId,
        });
        if (res && res.removeModifierFromGroup) {
          // Update modifierData by removing the modifier with selectedId
          setModifierData((prevModifierData) =>
            prevModifierData
              ? {
                  ...prevModifierData,
                  modifiers: prevModifierData.modifiers.filter(
                    (item) => item.id !== modalStates.selectedId
                  ),
                }
              : prevModifierData
          );
          setSelectedList((prevSelected) =>
            prevSelected.filter((item) => item._id !== modalStates.selectedId)
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

    // Log the formatted data
    console.log("Formatted Data:", changedData);

    // Call the API with the formatted data
    try {
      const res = await sdk.bulkUpdateModifiers({ input: changedData });
      if (res && res.bulkUpdateModifiers) {
        // Update the state with the new data
        setSelectedList(updatedData as ListType[]);

        // Show success toast
        setToastData({
          message: "Modifiers updated successfully",
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

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
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

  const listHeadings =
    watch("pricingType")?.value === PriceTypeEnum.IndividualPrice
      ? [
          { title: "Price", dataKey: "price" },
          { title: "Actions", dataKey: "name", render: renderActions },
        ]
      : [{ title: "Actions", dataKey: "name", render: renderActions }];

  const masterListHeadings =
    watch("pricingType")?.value === PriceTypeEnum.IndividualPrice
      ? [
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
        ]
      : [
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
        onSubmit={handleSubmit(onSubmit)}
        className=" mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="mb-1">
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
              placeholder="Enter item name"
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              This is the name your customer will say.
            </p>
            {errors.name && (
              <p className="text-red-500 text-sm text-start">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="mb-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Description
            </label>
            <textarea
              {...register("desc", { required: "Description is required" })}
              id="desc"
              className="input input-primary"
              placeholder="Enter item description"
            />
            {errors.desc && (
              <p className="text-red-500 text-sm text-start">
                {errors.desc.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <CountSelector
              title="Minimum"
              initialValue={minSelection}
              onCountChange={handleMinCountChange}
            />
            <div className="flex flex-col">
              <CountSelector
                title="Maximum"
                initialValue={maxSelection}
                onCountChange={handleMaxCountChange}
              />
              <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
                Select the Minimum number of modifiers a customer must select
                from this modifer group when ordering and the maximum number of
                modifiers they can select
              </p>
            </div>
          </div>
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
                  classNames={{
                    option: (state) =>
                      `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                        state.isSelected ? "!bg-primary text-white" : ""
                      }  `,
                  }}
                  {...field}
                  id="type"
                  options={PricingTypeOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select Pricing type"
                />
              )}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Select how you want to charge your customers for the modifiers
              they are selecting.
            </p>
            {errors.pricingType && (
              <p className="text-red-500 text-sm text-start">
                {errors.pricingType.message}
              </p>
            )}
          </div>
          {watch("pricingType")?.value === PriceTypeEnum.SamePrice && (
            <div className="">
              <label
                htmlFor="commonPrice"
                className="block mb-2 text-sm font-medium text-left text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                {...register("commonPrice", {
                  required: "Common Price is required",
                })}
                id="commonPrice"
                className="input input-primary"
                placeholder="Enter common price"
              />
              {errors.commonPrice && (
                <p className="text-red-500 text-sm text-start">
                  {errors.commonPrice.message}
                </p>
              )}
            </div>
          )}

          <div className="">
            <CustomSwitchCard
              label="Optional"
              title="Optional"
              caption="If its checked ,you can use this modifer will become optional"
              switchChecked={watch("optional")}
              onSwitchChange={() => setValue("optional", !watch("optional"))}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Turn on if you want to make this modifiers optional
            </p>

            {errors.optional && (
              <p className="text-red-500 text-sm text-start">
                {errors.optional.message}
              </p>
            )}
          </div>

          <div className="">
            <CustomSwitchCard
              label="multiselect"
              title="Multi-Select"
              caption="If its checked, customers can select any item more than once"
              switchChecked={watch("multiSelect")}
              onSwitchChange={() =>
                setValue("multiSelect", !watch("multiSelect"))
              }
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Turn on if you want customers to select any item more than once
            </p>

            {errors.multiSelect && (
              <p className="text-red-500 text-sm text-start">
                {errors.multiSelect.message}
              </p>
            )}
          </div>

          <div>
            <FormAddTable
              data={selectedList}
              headings={listHeadings}
              title="Modifiers"
              emptyCaption="No Modifiers added,Add Now"
              emptyMessage="No Modifiers available"
              buttonText="Add Modifiers"
              onAddClick={() =>
                setModalStates((prev) => ({ ...prev, showAddNewModal: true }))
              }
              onSave={handleSave}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Modifiers allow customers to customize an item (eg. Pepperoni,No
              Onions,Sprinkles)
            </p>
          </div>

          <CButton
            loading={actionLoading}
            variant={ButtonType.Primary}
            type="submit"
          >
            <div className="flex justify-center items-center">
              {isEditModGroup ? "Edit Modifer Group" : "Add Modifier Group"}
              {!isEditModGroup ? (
                <IoIosAddCircleOutline className="text-xl ml-1" />
              ) : (
                <RiEditCircleLine className="text-xl ml-1" />
              )}
            </div>
          </CButton>

          <AddFormDropdown
            title="Add Modifers"
            isOpen={modalStates.showAddNewModal}
            onClose={() =>
              setModalStates((prev) => ({ ...prev, showAddNewModal: false }))
            }
            data={masterList.filter(
              (e) => !selectedList.map((el) => el._id).includes(e._id)
            )}
            addLabel="Add Selected Modifiers"
            createLabel="Create New Modifier"
            addHandler={handleAddModifiers}
            headings={masterListHeadings}
            createClickHandler={() => {
              setIsAddModifierModalOpen(true);
            }}
          />
        </div>
      </form>

      {/* REMOVING MODIFIERS MODAL */}
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
        comments="By clicking yes the selected Modifier / Modifiers will be removed from this category. This action cannot be undone."
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={actionLoading}
            variant={ButtonType.Primary}
            onClick={() => handleRemoveModifiers()}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddModifierGroupForm;
