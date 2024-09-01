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
  ItemOptionsEnum,
  MenuTypeEnum,
  PriceTypeEnum,
  StatusEnum,
  UpdateItemInput,
} from "@/generated/graphql";
import { initAvailability } from "@/lib/commonConstants";
import useGlobalStore from "@/store/global";
import useMenuItemsStore from "@/store/menuItems";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
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
  desc: string;
  image: string;
  price: number;
  limit: number;
  status: boolean;
  subCategory: {
    value: string;
    label: string;
  } | null;
}

interface IOption {
  type: string;
  _id: string;
  status: boolean;
  displayName: string;
  desc: string;
}

interface IFormSubCatInput {
  name: string;
  desc: string;
}

interface ListType {
  _id: string;
  name: string;
}

interface IModalState {
  showDeleteConfirmation: boolean;
  showAddNewModal: boolean;
  selectedId: string;
  showConfirmationModal: boolean;
}
type ChangeItem = {
  _id: string;
  name?: string;
};

const AddItemForm = () => {
  // Config
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
    getValues,
  } = useForm<IFormInput>({});

  const {
    handleSubmit: handleAddSubSubmit,
    formState: { errors: subCateErrors },
    register: subCateRegister,
    // getValues,
  } = useForm<IFormSubCatInput>({});

  const formatOptions = (
    opts: {
      type: string;
      _id: string;
      displayName: string;
      desc: string;
    }[]
  ): IOption[] => {
    return opts.map((option) => ({
      type: option.type,
      displayName: option.displayName,
      desc: option.desc,
      status: false,
      _id: option._id,
    }));
  };

  // Global States
  const {
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    setIsAddItemModalOpen,
    setIsAddModifierGroupModalOpen,
  } = useMenuOptionsStore();
  const {
    editItemId,
    isEditItem,
    setEditItemId,
    setIsDuplicateItem,
    setIsEditItem,
    isDuplicateItem,
  } = useMenuItemsStore();

  const { setToastData } = useGlobalStore();

  const { setEditModGroupId, setIsEditModGroup } = useModGroupStore();

  // Modal States
  const initModalState: IModalState = {
    showDeleteConfirmation: false,
    showAddNewModal: false,
    selectedId: "",
    showConfirmationModal: false,
  };

  const [modalStates, setModalStates] = useState<IModalState>(initModalState);

  // Add Form States
  const [selectedList, setSelectedList] = useState<ListType[]>([]);
  const [masterList, setMasterList] = useState<ListType[]>([]);

  // Local States
  const [itemData, setItemData] = useState<{
    _id: string;
    name: string;
    desc: string;
    price: number;
    orderLimit: number;
    status: string;
    modifierGroup: {
      id: string;
      name: string;
      pricingType: PriceTypeEnum;
    }[];
  } | null>(null);

  const [showAddsubCategory, setIsShowAddsubCategory] =
    useState<boolean>(false);
  const [options, setOptions] = useState<IOption[]>([]);

  const [useRestaurantTimings, setUseRestaurantTimings] = useState(
    isEditItem ? false : true
  );

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionloading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Availability
  const [availability, setAvailability] =
    useState<Availability[]>(initAvailability);

  const [subCategories, setSubCategories] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [mainSubCategories, setMainSubCategories] = useState<
    {
      _id: string | null;
      name: string;
      desc: string;
    }[]
  >([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<{
    id: string | null;
    name: string;
    desc: string;
  } | null>(null);

  // Visibility & PricingOption States
  const [visibilities, setVisibilities] = useState<
    {
      menuType: MenuTypeEnum;
      status: StatusEnum;
    }[]
  >([]);
  const [pricingOptions, setPricingOptions] = useState<
    {
      menuType: MenuTypeEnum;
      price: number;
    }[]
  >([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await sdk.getModifierGroupsforItemsDropDown();
        if (!response || !response.getModifierGroups) {
          setToastData({
            message:
              "Something went wrong while fetching the menu details, please try again!",
            type: "error",
          });
          return;
        }
        const modifierGroups: ListType[] = response.getModifierGroups.map(
          (el) => ({
            _id: el._id.toString(),
            name: el.name.toString(),
          })
        );
        setMasterList(modifierGroups);

        // Update selected list
        let sl = [...selectedList];
        for (let i = 0; i < modifierGroups.length; i++) {
          const category = modifierGroups[i];
          let idx = sl.findIndex((e) => e._id === category._id);
          if (idx >= 0) {
            sl[idx].name = category.name;
          }
        }
        console.log("selected List", sl);
        setSelectedList(sl);

        // if (items && items.getModifierGroups) {
        //   const formattedItemsList = items.getModifierGroups.map(
        //     (item: { _id: string; name: string }) => ({
        //       _id: item._id || "",
        //       name: item?.name || "",
        //     })
        //   );
        //   // const filteredItemsList = formattedItemsList.filter(
        //   //   (item) =>
        //   //     !selectedList.some(
        //   //       (selectedItem) => selectedItem._id === item._id
        //   //     )
        //   // );
        //   setMasterList(formattedItemsList);
        //   console.log("Masters Fetched", formattedItemsList);
        // }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };
    fetch();
  }, [refreshMenuBuilderData]);

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

        setPricingOptions(
          Array.from(uniqueType).map((e) => ({
            menuType: e,
            price: parseFloat(watch("price").toString()),
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

  useEffect(() => {
    const fetchData = async () => {
      const fetchItemData = async () => {
        if (editItemId && (isEditItem || isDuplicateItem)) {
          try {
            const response = await sdk.getItem({ id: editItemId });
            if (response && response.getItem) {
              const {
                name,
                desc,
                status,
                price,
                orderLimit,
                visibility,
                priceOptions,
                availability,
                image,
                modifierGroup,
                options,
                subCategory,
              } = response.getItem;

              setItemData({
                _id: editItemId ?? "",
                name,
                desc: desc ?? "",
                price,
                status,
                orderLimit: orderLimit ?? 0,
                modifierGroup,
              });

              setValue(
                "name",
                isDuplicateItem ? generateUniqueName(name) : name
              );
              if (orderLimit) {
                setValue("limit", orderLimit);
              }
              if (availability) {
                const originalAvailability =
                  reverseFormatAvailability(availability);
                setAvailability(originalAvailability);
              }

              setValue("desc", desc??"");
              setValue("status", status === StatusEnum.Active ? true : false);
              setValue("price", price);

              setVisibilities(visibility);
              setPricingOptions(priceOptions);

              setPreviewUrl(image || "");
              const formattedOptions: IOption[] = options.map(
                (it: {
                  _id: string;
                  desc: string;
                  displayName: string;
                  status: boolean;
                  type: ItemOptionsEnum;
                }) => ({
                  _id: it._id,
                  desc: it.desc,
                  displayName: it.displayName,
                  status: it.status,
                  type: it.type,
                })
              );
              setOptions(formattedOptions);

              if (subCategory !== null) {
                setSelectedSubCategories({
                  desc: subCategory?.desc ?? "",
                  name: subCategory?.name ?? "",
                  id: subCategory?.id ?? null,
                });
                setValue("subCategory", {
                  label: subCategory?.name ?? "",
                  value: subCategory?.name ?? "",
                });
              }
              let selectedIds = modifierGroup.map((e) => e.id.toString());
              console.log(masterList);
              let selected = masterList.filter((e) =>
                selectedIds.includes(e._id.toString())
              );
              console.log("HHHH", selected);
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

      try {
        await setRestroTimings();

        const optsResp = await sdk.getAllItemOptions();
        if (optsResp && optsResp.getAllItemOptions.length > 0) {
          setOptions(formatOptions(optsResp.getAllItemOptions));
        }

        await fetchMenuData();
        await fetchItemData();
      } catch (error) {
        setToastData({
          type: "error",
          message: extractErrorMessage(error),
        });
      }
    };

    if ((editItemId !== null || editItemId !== "") && masterList.length > 0) {
      fetchData();
    }

    fetchData(); // Call the async function
  }, [editItemId, setValue, setToastData, masterList]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await sdk.getSubCategories();
        if (data && data.getSubCategories) {
          setMainSubCategories(
            data.getSubCategories.map((cat: any) => ({
              _id: cat._id.toString(),
              name: cat.name,
              desc: cat.desc,
            }))
          );
          const formattedSubCategories = data.getSubCategories.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }));
          setSubCategories(formattedSubCategories);
        }
      } catch (error) {
        setToastData({
          type: "error",
          message: extractErrorMessage(error),
        });
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (visibilities.length === 1) {
      const updatedVisibilities = visibilities.map((vib) => ({
        menuType: vib.menuType,
        status: watch("status") ? StatusEnum.Active : StatusEnum.Inactive,
      }));
      setVisibilities(updatedVisibilities);
    }
  }, [watch("status")]);

  // Helper functions
  const setRestroTimings = async () => {
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
        message: extractErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    if (!isEditItem) {
      if (pricingOptions.length > 0) {
        setPricingOptions((prevPricingOptions) =>
          prevPricingOptions.map((option) => ({
            ...option,
            price: parseFloat(watch("price").toString()),
          }))
        );
      }
    }
  }, [watch("price")]);

  // Handler Functions
  const onSubmit = async (data: IFormInput) => {
    setActionloading(true);
    try {
      if (!isValidNameAlphabetic(data?.name)) {
        setToastData({
          message:
            "Please use only alphabets and numbers while adding or updating name.",
          type: "error",
        });
        return;
      }
      const isHalal = options.some(
        (option) => option.type === ItemOptionsEnum.IsHalal && option.status
      );
      const isVegan = options.some(
        (option) => option.type === ItemOptionsEnum.IsVegan && option.status
      );

      if (isHalal && isVegan) {
        setToastData({
          message: "An item cannot be Halal and Vegan at the same time",
          type: "error",
        });
        return;
      }

      if (!data.price || data.price <= 0) {
        setToastData({
          message:
            "An item cannot be added without price, please add a numerical value that is greater than zero to save and continue",
          type: "error",
        });
      }

      const statusSub = data.status ? StatusEnum.Active : StatusEnum.Inactive;
      const formattedAvailability = formatAvailability(availability);
      const parsedPrice = roundOffPrice(parseFloat(data.price.toString()));
      const parsedLimit = parseFloat(data.limit.toString());

      let updateInput: {
        _id: string;
        options: IOption[];
        priceOptions: {
          menuType: MenuTypeEnum;
          price: number;
        }[];
        subCategory: {
          id: string | null;
          name: string;
          desc: string;
        } | null;

        visibility: {
          menuType: MenuTypeEnum;
          status: StatusEnum;
        }[];
        availability: AvailabilityInput[];
        name?: string;
        desc?: string;
        price?: number;
        orderLimit?: number;
        status?: StatusEnum;
      } = {
        _id: editItemId || "",
        options: options,
        priceOptions: pricingOptions,
        subCategory: selectedSubCategories,

        visibility: visibilities,
        availability: formattedAvailability,
      };
      let hasChanges = false;
      const imgUrl = await handleLogoUpload();

      if (data.name !== itemData?.name) {
        updateInput.name = data.name;
        hasChanges = true;
      }

      if (data.desc !== itemData?.desc) {
        updateInput.desc = data.desc;
        hasChanges = true;
      }

      if (data.price !== itemData?.price) {
        updateInput.price = parsedPrice;
        hasChanges = true;
      }
      if (data.limit !== itemData?.orderLimit) {
        // addChange("orderLimit", parsedLimit);
        updateInput.orderLimit = parsedLimit;
      }

      if (data.status !== (itemData?.status === StatusEnum.Active)) {
        updateInput.status = data.status
          ? StatusEnum.Active
          : StatusEnum.Inactive;
        hasChanges = true;
      }

      const prevSelectedMenuIds = itemData?.modifierGroup?.map(
        (item: any) => item.id
      );

      const selectedItemsIds = selectedList.map((item) => item._id);
      const isModAdded = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds?.includes(id)
      );

      setActionloading(true);
      if (!isEditItem) {
        const imgUrl = await handleLogoUpload();

        await sdk.addItem({
          input: {
            name: data.name,
            desc: data.desc,
            image: imgUrl,
            price: parsedPrice,
            status: statusSub,
            orderLimit: parsedLimit,

            options: options.map((e) => ({
              _id: e._id,
              desc: e.desc,
              displayName: e.displayName,
              status: e.status,
              type: e.type as ItemOptionsEnum,
            })),
            availability: formattedAvailability,
            visibility: visibilities,
            subCategory: selectedSubCategories,
            priceOptions: pricingOptions,
          },
          modifierGroups: selectedItemsIds,
        });
        setActionloading(false);
        setIsAddItemModalOpen(false);
        setIsDuplicateItem(false);
        setRefreshMenuBuilderData(!refreshMenuBuilderData);
        setEditItemId(null);
        setToastData({
          type: "success",
          message: "Item Added Successfully",
        });
      } else {
        // EDIT/UPDATE ITEM API
        if (isModAdded.length > 0) {
          const res = await sdk.addModifierGroupsToItem({
            modifierGroupId: isModAdded,
            itemId: editItemId || "",
          });
          if (res && res.addModifierGroupsToItem) {
            setToastData({
              type: "success",
              message: "Modifier Groups Added Successfully",
            });
          }
        }
        const res = await sdk.updateItem({
          input: updateInput as UpdateItemInput,
        });

        setActionloading(false);
        setIsAddItemModalOpen(false);
        setRefreshMenuBuilderData(!refreshMenuBuilderData);
        setIsEditItem(false);
        setEditItemId(null);
        setIsDuplicateItem(false);
        setEditItemId(null);

        setToastData({
          type: "success",
          message: "Item Updated Successfully",
        });
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setActionloading(false);
    }
  };
  const onSubSubmit = async (data: IFormSubCatInput) => {
    const index = subCategories.findIndex((e) => e.label === data.name);

    if (index >= 0) {
      setToastData({
        type: "error",
        message: `Sub category with ${data.name} is already added, please try again!`,
      });
      return;
    }

    try {
      await sdk.AddSubCategory({
        input: {
          name: data.name,
          desc: data.desc,
        },
      });

      setToastData({
        type: "success",
        message: "Sub-Category Added Successfully",
      });

      const newSubCategory = { label: data.name, value: data.name };

      setSubCategories((prev) => [...prev, newSubCategory]);

      setSelectedSubCategories({
        id: null,
        desc: data.desc,
        name: data.name,
      });

      setValue("subCategory", newSubCategory);

      setMainSubCategories((prev) => [
        ...prev,
        { _id: null, category: null, name: data.name, desc: data.desc },
      ]);

      setIsShowAddsubCategory(false);
    } catch (error) {
      setToastData({
        type: "error",
        message:
          "An error occurred while adding the sub-category. Please try again.",
      });
    }
  };

  const handleLogoUpload = async () => {
    if (logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);
      formData.append("upload_preset", "⁠item-images");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
        { method: "POST", body: formData }
      ).then((r) => r.json());

      const cloudinaryUrl = response?.secure_url;
      setPreviewUrl(cloudinaryUrl);

      return cloudinaryUrl;
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setLogoFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleConfirmation = async () => {
    setValue("status", !watch("status"));
    const updatedVisibilities = visibilities.map((vib) => ({
      menuType: vib.menuType,
      status: watch("status") ? StatusEnum.Active : StatusEnum.Inactive,
    }));
    setVisibilities(updatedVisibilities);
    setModalStates((prev) => ({
      ...prev,
      showConfirmationModal: false,
    }));
  };
  const handleRejection = async () => {
    setValue("status", !watch("status"));
    setModalStates((prev) => ({
      ...prev,
      showConfirmationModal: false,
      selectedId: "",
    }));
  };

  const handlePriceChange = (newPrice: string, index: number) => {
    const updatedPricingOptions = [...pricingOptions];
    updatedPricingOptions[index].price = roundOffPrice(
      parseFloat(newPrice.toString())
    );
    setPricingOptions(updatedPricingOptions);
  };

  const resetToBasePrice = () => {
    const updatedOptions = pricingOptions.map((option) => ({
      ...option,
      price: getValues("price"),
    }));
    setPricingOptions(updatedOptions);
  };

  const handleRemoveCategory = async () => {
    setSelectedList((prevSelected) =>
      prevSelected.filter((item) => item._id !== modalStates.selectedId)
    );

    const isPresentInPrevItems = itemData?.modifierGroup?.some(
      (item: any) => item._id === modalStates.selectedId
    );
    if (isEditItem && isPresentInPrevItems) {
      const res = await sdk.removeModifierGroupFromItem({
        itemId: editItemId || "",
        modifierGroupId: modalStates.selectedId,
      });

      if (res) {
        // Update itemData by removing the modifier group with selectedId
        setItemData((prevItemData) =>
          prevItemData
            ? {
                ...prevItemData,
                modifierGroup: prevItemData.modifierGroup.filter(
                  (item) => item.id !== modalStates.selectedId
                ),
              }
            : prevItemData
        );
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
    setModalStates((prev) => ({
      ...prev,
      showDeleteConfirmation: false,
      selectedId: "",
    }));
    // modalStates.showDeleteConfirmation(false);
  };

  const handleAddModifierGroups = (idsList: string[]) => {
    if (masterList.length > 0) {
      let newSelections = masterList.filter((e) =>
        idsList.includes(e._id.toString())
      );

      setSelectedList((prev) => [...prev, ...newSelections]);
    }
    setModalStates((prev) => ({ ...prev, showAddNewModal: false }));
  };

  const handleEditItem = (id: string) => {
    setIsAddModifierGroupModalOpen(true);
    setEditModGroupId(id);
    setIsEditModGroup(true);
  };

  const handleSave = async (updatedData: DataItemFormAddTable[]) => {
    // Create a map for quick lookup
    const selectedItemsMap = new Map(
      selectedList.map((item) => [item._id, item])
    );

    // Determine which items have been changed
    const changedData: ChangeItem[] = updatedData.reduce(
      (acc: ChangeItem[], item) => {
        const selectedItem = selectedItemsMap.get(item._id);
        if (selectedItem) {
          const changes: ChangeItem = { _id: item._id };

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
      const res = await sdk.bulkUpdateModifierGroups({ input: changedData });
      if (res && res.bulkUpdateModifierGroups) {
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
    {
      title: "Actions",
      dataKey: "name",
      render: (rowData: ListType) => {
        return (
          <div className="flex space-x-2 justify-center">
            <IoIosCloseCircleOutline
              className="text-red-400 text-lg cursor-pointer"
              onClick={() => {
                setModalStates((prev) => ({
                  ...prev,
                  showDeleteConfirmation: true,
                  selectedId: rowData?._id,
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

  const handleToggleSwitch = () => {
    if (visibilities.length > 1) {
      setModalStates((prev) => ({ ...prev, showConfirmationModal: true }));
    } else {
      setValue("status", !watch("status"));
      const updatedVisibilities = visibilities.map((vib) => ({
        menuType: vib.menuType,
        status: StatusEnum.Inactive,
      }));
      setVisibilities(updatedVisibilities);
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
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-full mx-auto p-6 w-full bg-white rounded-md "
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
              This is the name the customer will see
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

          <div className="mb-1">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Base Price
            </label>
            <input
              type="number"
              {...register("price", {
                required: "Base Price is required",
              })}
              id="price"
              className="input input-primary"
              placeholder="Enter item price"
              style={{
                appearance: "textfield",
              }}
              inputMode="decimal"
              step="0.01"
              onWheel={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "-" || e.key === "+") {
                  e.preventDefault();
                }
              }}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Item prices will be rounded off the nearest whole number like
              12.22 then it will be converted to 12.49 and 12.77 will be
              converted to 12.99.
            </p>
            {errors.price && (
              <p className="text-red-500 text-sm text-start">
                {errors.price.message}
              </p>
            )}
          </div>
          {pricingOptions.length > 1 && (
            <div className="mb-1">
              <div className="flex justify-between items-center">
                <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                  Pricing Options
                </label>
                <button
                  type="button"
                  onClick={resetToBasePrice}
                  className="text-primary hover:underline text-sm"
                >
                  Reset to Base Price
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {pricingOptions?.map((option, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white"
                  >
                    <div>
                      <h3 className="font-semibold text-start text-md">
                        {option?.menuType}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        You can Modify the price for this menu that the
                        customers will see
                      </p>
                    </div>
                    <input
                      type="number"
                      value={option?.price || ""}
                      onChange={(e) => handlePriceChange(e.target.value, index)}
                      className="input input-primary w-20"
                      placeholder="Enter item price"
                      style={{ appearance: "textfield" }}
                      inputMode="decimal"
                      step="0.01"
                      onWheel={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if (e.key === "e" || e.key === "-" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-1">
            <label className="block mb-2 text-lg font-medium text-left text-gray-700">
              Photo
            </label>
            <div className="">
              {previewUrl ? (
                <div className="flex items-center justify-between hover:bg-primary hover:bg-opacity-5 px-4 rounded-md">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                  Item Picture (Optional)
                  <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
                    <input
                      type="file"
                      {...register("image")}
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6 mx-auto"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">
                          Drag and drop a logo or{" "}
                          <span className="text-primary">browse file</span>
                        </p>
                      </div>
                    </label>
                  </div>
                </label>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              This is the image your customer will see
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
          <div>
            <label
              htmlFor="Options"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Options
            </label>
            <div className="mb-1 grid grid-cols-2 gap-4">
              {options.map((option) => {
                return (
                  <CustomSwitchCard
                    key={option._id}
                    label={option.type}
                    title={option.displayName}
                    caption={option.desc}
                    switchChecked={option.status}
                    onSwitchChange={() => {
                      setOptions((prev) =>
                        prev.map((opt) =>
                          opt.type === (option.type as ItemOptionsEnum)
                            ? { ...opt, status: !opt.status }
                            : opt
                        )
                      );
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="mb-1">
            <label
              htmlFor="itemLimit"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Item Limit
            </label>
            <input
              type="number"
              {...register("limit", {})}
              id="itemLimit"
              className="input input-primary"
              placeholder="Enter item limit"
              style={{
                appearance: "textfield",
              }}
              inputMode="decimal"
              step="0.01"
              onWheel={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "-" || e.key === "+") {
                  e.preventDefault();
                }
              }}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Enter the maximum number of time this Item can be purchased by the
              customers,If the limit has been crossed the Item will become
              incactive and you can activate it again with the same or different
              limit
            </p>
            {errors.price && (
              <p className="text-red-500 text-sm text-start">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Sub Category
            </label>
            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="subCategory"
                  isClearable
                  options={subCategories}
                  onChange={(e) => {
                    const index = mainSubCategories.findIndex(
                      (el) => el.name === e?.label
                    );
                    if (index >= 0) {
                      let item = mainSubCategories[index];
                      setSelectedSubCategories({
                        desc: item?.desc ?? "",
                        name: item?.name ?? "",
                        id: item?._id ?? null,
                      });
                      setValue("subCategory", {
                        label: item?.name ?? "",
                        value: item?.name ?? "",
                      });
                    } else {
                      setSelectedSubCategories(null);
                      setValue("subCategory", null);
                    }
                  }}
                  isDisabled={subCategories.length <= 0}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select sub-category"
                />
              )}
            />
            <p className="text-gray-500 mt-1 text-xs text-start">
              To add a new sub-category click{" "}
              <span
                onClick={() => setIsShowAddsubCategory(true)}
                className="text-primary cursor-pointer"
              >
                here
              </span>
            </p>
          </div>
          <div>
            <FormAddTable
              data={selectedList}
              headings={listHeadings}
              title="Modifier Groups"
              emptyCaption="You can add Modifier Group for items here"
              emptyMessage="No Modifier Groups available"
              buttonText="Add Modifier Groups"
              onAddClick={() =>
                setModalStates((prev) => ({ ...prev, showAddNewModal: true }))
              }
              onSave={handleSave}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Modifier Groups allow your customer to customize an item
            </p>
          </div>

          <div>
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
          </div>

          <CButton
            loading={actionLoading}
            variant={ButtonType.Primary}
            type="submit"
          >
            <div className="flex justify-center items-center">
              {isEditItem ? "Update Item" : "Add Item"}
              {!isEditItem ? (
                <IoIosAddCircleOutline className="text-xl ml-1" />
              ) : (
                <RiEditCircleLine className="text-xl ml-1" />
              )}
            </div>
          </CButton>
        </div>
      </form>
      <AddFormDropdown
        title="Add Modifier Groups"
        isOpen={modalStates.showAddNewModal}
        onClose={() =>
          setModalStates((prev) => ({ ...prev, showAddNewModal: false }))
        }
        data={masterList.filter(
          (e) => !selectedList.map((el) => el._id).includes(e._id)
        )}
        createLabel="Create New Modifier group"
        addLabel="Add Selected Modifier Groups"
        headings={masterListHeadings}
        createClickHandler={() => {
          setIsAddModifierGroupModalOpen(true);
        }}
        addHandler={handleAddModifierGroups}
      />

      {/* Confirmation removal Modal */}
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
        comments="By clicking yes the selected Modifier Group / modifier Groups will be removed from this Item. This action cannot be undone."
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

      {/* Status Change Modal */}
      <ReusableModal
        title="Confirm Status Change"
        comments="Do you want to change the visibility for All the menus"
        isOpen={modalStates.showConfirmationModal}
        onClose={() =>
          setModalStates((prev) => ({ ...prev, showConfirmationModal: false }))
        }
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

      {/* AddSubCategory Modal */}
      <ReusableModal
        title="Add Sub Category"
        isOpen={showAddsubCategory}
        onClose={() => setIsShowAddsubCategory(false)}
      >
        <form onSubmit={handleAddSubSubmit(onSubSubmit)}>
          <div className="mb-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Display Name
            </label>
            <input
              type="text"
              {...subCateRegister("name", { required: "Name is required" })}
              id="name"
              className="input input-primary"
              placeholder="Enter item name"
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              This is the name the customer will see
            </p>
            {subCateErrors.name && (
              <p className="text-red-500 text-sm text-start">
                {subCateErrors.name.message}
              </p>
            )}
          </div>

          <div className="mb-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Description
            </label>
            <textarea
              {...subCateRegister("desc", {
                required: "Description is required",
              })}
              id="desc"
              className="input input-primary"
              placeholder="Enter item description"
            />
            {subCateErrors.desc && (
              <p className="text-red-500 text-sm text-start">
                {subCateErrors.desc.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <CButton
              className="w-full mt-2"
              variant={ButtonType.Primary}
              type="submit"
            >
              Add
            </CButton>
          </div>
        </form>
      </ReusableModal>
    </motion.div>
  );
};

export default AddItemForm;
