import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
  roundOffPrice,
} from "@/utils/utilFUncs";
import { PriceTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import CountSelector from "@/components/common/countSelector/countSelector";
import { sdk } from "@/utils/graphqlClient";
import FormAddTable from "@/components/common/table/formTable";
import { FaTrash } from "react-icons/fa";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { MdArrowOutward } from "react-icons/md";
import useModGroupStore from "@/store/modifierGroup";
import useModStore from "@/store/modifiers";
import ReusableModal from "@/components/common/modal/modal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";

interface IFormInput {
  name: string;
  optional: boolean;
  pricingType: { value: string; label: string };
  maxSelections: number;
  minSelections: number;
  commonPrice: number;
  desc: string;
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

  const {
    fetchMenuDatas,
    setfetchMenuDatas,
    setisAddModifierGroupModalOpen,
    setisAddModifierModalOpen,
  } = useMenuOptionsStore();
  const {
    editModGroupId,
    isEditModGroup,
    setEditModGroupId,
    setisEditModGroup,
    isDuplicateModifierGroup,
  } = useModGroupStore();
  const [modifierssOption, setModifiersOption] = useState<any[]>([]);
  const [confirmationRemoval, setConfirmationRemoval] = useState(false);
  const [remmovingId, setRemovingId] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [changesMenu, setChangesMenu] = useState<any>([]);

  const { setEditModId, setisEditMod } = useModStore();

  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const PricingTypeOptions: any[] = [
    { value: PriceTypeEnum.FreeOfCharge, label: "Free of Charge" },
    { value: PriceTypeEnum.IndividualPrice, label: "Individual Price" },
    { value: PriceTypeEnum.SamePrice, label: "Same Price" },
  ];

  useEffect(() => {
    if (selectedItems.length > 0) {
      setModifiersOption((prevItemsOption) =>
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
        const items = await sdk.getModifiersforGroupDropDown();
        if (items && items.getModifiers) {
          const formattedItemsList = items.getModifiers.map((item) => ({
            _id: item?._id,
            name: item?.name?.value,
            price: item?.price?.value,
          }));
          const filteredItemsList = formattedItemsList.filter(
            (item) =>
              !selectedItems.some(
                (selectedItem) => selectedItem._id === item._id
              )
          );

          setModifiersOption(filteredItemsList);
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
  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);
  useEffect(() => {
    const fetchItemData = async () => {
      if (editModGroupId && (isEditModGroup || isDuplicateModifierGroup)) {
        try {
          const response = await sdk.getModifierGroup({ id: editModGroupId });
          const item = response.getModifierGroup;
          setChangesMenu(response.getModifierGroup);

          setValue("name", item.name.value);
          const nameDup = generateUniqueName(item?.name?.value);
          if (isDuplicateModifierGroup) {
            setValue("name", nameDup);
          }

          setValue("minSelections", item?.minSelections?.value);
          setValue("maxSelections", item.maxSelections?.value);

          setMinSelection(item?.minSelections?.value);
          setMaxSelection(item.maxSelections?.value);
          setValue("desc", item?.desc?.value || "");
          setValue("commonPrice", item?.price?.value || 0);
          setValue("optional", item.optional || false);
          const selectedPriceType = PricingTypeOptions.find(
            (option) => option.value === item?.pricingType
          );
          setValue(
            "pricingType",
            selectedPriceType || PriceTypeEnum.FreeOfCharge
          );
          const formateditemlist = item?.modifiers.map((el) => ({
            _id: el?.id,
            name: el?.name?.value ?? "",
            price: el?.price?.value ?? "",
          }));
          setSelectedItems(formateditemlist || []);
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
  }, [editModGroupId, setValue, setToastData]);

  const handleAddItem = () => {
    setisAddModifierModalOpen(true);
  };

  const handleAddItems = () => {
    setSelectedItems([]);
    setSelectedItems(tempSelectedItems);
    setIsModalOpen(false);
  };

  const handleItemClick = (item: any) => {
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [...prevSelected, item]
    );
  };

  const handleEditItem = (id: string) => {
    setisAddModifierModalOpen(true);
    setEditModId(id);
    setisEditMod(true);
  };
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => {
          setConfirmationRemoval(true);
          setRemovingId(rowData?._id);
        }}
      />
    </div>
  );
  const data = selectedItems.map((item) => ({
    ...item,
    actions: renderActions(item),
  }));

  const headings =
    watch("pricingType")?.value === PriceTypeEnum.IndividualPrice
      ? [
          { title: "Price", dataKey: "price" },
          { title: "Actions", dataKey: "name", render: renderActions },
        ]
      : [{ title: "Actions", dataKey: "name", render: renderActions }];

  const headingsDropdown =
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

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);

      if (!isDuplicateModifierGroup) {
        if (!isValidNameAlphabetic(data.name)) {
          setToastData({
            message:
              "Please use only alphabets and numbers while adding or updating name.",
            type: "error",
          });
          return;
        }
      }

      if (!data.commonPrice || data.commonPrice <= 0) {
        setToastData({
          message:
            "An Modifier Group cannot be added without price, please add a numerical value that is greater than zero to save and continue",
          type: "error",
        });
      }
      const parsedMaxSelection =
        parseFloat(data?.maxSelections?.toString()) || 0;
      const parsedMinSelection =
        parseFloat(data?.minSelections?.toString()) || 0;
      const parsedOptionalBoolean = data.optional ? true : false;
      parseFloat(data?.minSelections?.toString()) || 0;
      const prevSelectedMenuIds = await prevItemsbfrEdit.map(
        (item) => item._id
      );
      const selectedItemsIds = await selectedItems.map((item) => item._id);

      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;
      setBtnLoading(true);
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

      const updateInput: any = {
        _id: editModGroupId || "",
        desc: {
          value: data.desc || "",
        },
        pricingType: data.pricingType.value as PriceTypeEnum,

        price: {
          value: parsedPriceCommon || 0,
        },
      };
      let hasChanges = false;

      const addChange = (field: string, newValue: any) => {
        updateInput[field] = { value: newValue };
        hasChanges = true;
      };

      if (data.name !== changesMenu?.name?.value) {
        addChange("name", data.name);
        hasChanges = true;
      }

      if (data.maxSelections !== changesMenu?.maxSelections?.value) {
        addChange("maxSelections", data.maxSelections);
        hasChanges = true;
      }
      if (data.minSelections !== changesMenu?.minSelections?.value) {
        addChange("minSelections", data.minSelections);
        hasChanges = true;
      }

      if (data.optional !== changesMenu?.optional) {
        updateInput.optional = data.optional;
        hasChanges = true;
      }
      if (data.optional !== changesMenu?.optional) {
        updateInput.optional = data.optional;
        hasChanges = true;
      }

      // if (data?.commonPrice !== changesMenu?.price?.value) {
      //   updateInput.price.value = parsedPriceCommon || 0;
      //   hasChanges = true;
      // }

      if (!isEditModGroup) {
        await sdk.addModifierGroup({
          input: {
            price: {
              value: parsedPriceCommon || 0,
            },
            desc: {
              value: data.desc,
            },

            name: {
              value: data.name,
            },
            minSelections: {
              value: parsedMinSelection,
            },
            maxSelections: {
              value: parsedMaxSelection,
            },
            optional: parsedOptionalBoolean,
            pricingType: data.pricingType.value as PriceTypeEnum,
          },
          modifiers: selectedItemsIds,
        });
      } else {
        await sdk.updateModifierGroup({
          input: updateInput,
        });

        isMenuAdded &&
          (await sdk.addModifierToModifierGroup({
            modifierIds: addedMenuIds,
            modifierGroupId: editModGroupId || "",
          }));
      }
      setBtnLoading(false);
      setisAddModifierGroupModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);

      setisEditModGroup(false);
      setEditModGroupId(null);

      setToastData({
        type: "success",
        message: "Modifier Groups Added Successfully",
      });
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

  const handleMinCountChange = (count: number) => {
    setValue("minSelections", count);
  };

  const handleMaxCountChange = (count: number) => {
    setValue("maxSelections", count);
  };

  const handleRemoveModifiers = async () => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== remmovingId)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== remmovingId)
    );
    const isPresentInPrevItems = prevItemsbfrEdit.some(
      (item) => item._id === remmovingId
    );
    if (isEditModGroup && isPresentInPrevItems) {
      const res = await sdk.removeModifierFromModifierGroup({
        modifierId: remmovingId,
        modifierGroupId: editModGroupId || "",
      });
      if (res) {
        setprevItemsbfrEdit((prevSelected) =>
          prevSelected.filter((item) => item._id !== remmovingId)
        );
      }
    }
    setConfirmationRemoval(false);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (selectedItems.length > 0) {
      setModifiersOption((prevItemsOption) =>
        prevItemsOption.filter(
          (item) =>
            !selectedItems.some((selectedItem) => selectedItem._id === item._id)
        )
      );
    }
  }, [isModalOpen, selectedItems, fetchMenuDatas]);

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {!isEditModGroup ? "ADD Modifier Group" : "EDIT Modifier group"}
          </h2>
        </div>
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
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Turn on if you want to make this modifiers optional
            </p>

            {errors.optional && (
              <p className="text-red-500 text-sm text-start">
                {errors.optional.message}
              </p>
            )}
          </div>
          <div>
            <FormAddTable
              data={data}
              isShowImage
              headings={headings}
              title="Modifiers"
              emptyCaption="No Modifiers added,Add Now"
              emptyMessage="No Modifiers available"
              buttonText="Add Modifiers"
              onAddClick={handleAddClick}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Modifiers allow customers to customize an item (eg. Pepperoni,No
              Onions,Sprinkles)
            </p>
          </div>

          <CButton
            loading={btnLoading}
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
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={modifierssOption}
            tempSelectedItems={tempSelectedItems}
            addSelectedItemsButtonLabel="Add Selected Modifiers"
            createNewItemButtonLabel="Create New Modifier"
            handleItemClick={handleItemClick}
            handleAddItems={handleAddItems}
            headings={headingsDropdown}
            renderActions={renderActions}
            onClickCreatebtn={handleAddItem}
          />
        </div>
      </form>
      <ReusableModal
        isOpen={confirmationRemoval}
        onClose={() => {
          setConfirmationRemoval(false);
          setRemovingId("");
        }}
        title="Are you sure?"
        comments="By clicking yes the selected Modifier / Modifiers will be removed from this category. This action cannot be undone."
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
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
