import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import {
  extractErrorMessage,
  generateUniqueName,
  isValidNameAlphabetic,
  roundOffPrice,
} from "@/utils/utilFUncs";
import {
  AvailabilityInput,
  Day,
  MenuTypeEnum,
  StatusEnum,
} from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useMenuItemsStore from "@/store/menuItems";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import AvailabilityForm from "@/components/common/availibility/availibility";
import { DateTime } from "luxon";
import FormAddTable from "@/components/common/table/formTable";
import { FaTrash } from "react-icons/fa";
import AddFormDropdown from "@/components/common/addFormDropDown/addFormDropdown";
import { MdArrowOutward } from "react-icons/md";
import useModGroupStore from "@/store/modifierGroup";
import ReusableModal from "@/components/common/modal/modal";
import useAuthStore from "@/store/auth";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import moment from "moment";
interface IFormInput {
  name: string;
  desc: string;
  image: string;
  price: number;
  status: boolean;
  applySalesTax: boolean;
  popularItem: boolean;
  upSellItem: boolean;
  isSpicy: boolean;
  hasNuts: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isVegan: boolean;
}

interface ItemsDropDownType {
  _id: string;
  name: string;
}

const AddItemForm = () => {
  const { setisShowTaxSettings } = useGlobalStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
    getValues,
  } = useForm<IFormInput>({});
  const [changesMenu, setChangesMenu] = useState<any>([]);
  const { taxRate } = useAuthStore();

  const {
    fetchMenuDatas,
    setfetchMenuDatas,
    setisAddItemModalOpen,
    setisAddModifierGroupModalOpen,
  } = useMenuOptionsStore();
  const {
    editItemId,
    isEditItem,
    setEditItemId,
    setisEditItem,
    setisDuplicateItem,
    isDuplicateItem,
  } = useMenuItemsStore();
  const [confirmationRemoval, setConfirmationRemoval] = useState(false);
  const [remmovingId, setRemovingId] = useState<string>("");
  const { setEditModGroupId, setisEditModGroup } = useModGroupStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ItemsDropDownType[]>([]);
  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const [itemsOption, setItemsOption] = useState<ItemsDropDownType[]>([]);

  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  interface Availability {
    day: Day;
    hours: {
      start: { label: string; value: string };
      end: { label: string; value: string };
    }[];
    active: boolean;
  }

  const [availability, setAvailability] = useState<Availability[]>([
    { day: Day.Sunday, hours: [], active: false },
    { day: Day.Monday, hours: [], active: false },
    { day: Day.Tuesday, hours: [], active: false },
    { day: Day.Wednesday, hours: [], active: false },
    { day: Day.Thursday, hours: [], active: false },
    { day: Day.Friday, hours: [], active: false },
    { day: Day.Saturday, hours: [], active: false },
  ]);
  const formatAvailability = (
    availability: Availability[]
  ): AvailabilityInput[] => {
    const dayMap: { [key: string]: Day } = {
      Sunday: Day.Sunday,
      Monday: Day.Monday,
      Tuesday: Day.Tuesday,
      Wednesday: Day.Wednesday,
      Thursday: Day.Thursday,
      Friday: Day.Friday,
      Saturday: Day.Saturday,
    };

    return availability.map((item) => ({
      day: dayMap[item.day],
      hours: item.hours.map((hour) => ({
        start: new Date(hour.start.value).toISOString(),
        end: new Date(hour.end.value).toISOString(),
      })),
      active: item.active,
    }));
  };
  const [visibilities, setVisibilities] = useState<
    {
      menuType: MenuTypeEnum;
      status: StatusEnum;
    }[]
  >([]);
  const [pricingOptions, setPricingOptions] = useState<
    {
      menuType: MenuTypeEnum;
      price: {
        value: number;
      };
    }[]
  >([]);

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

      const updatedPricings = menuItems.map((menu) => ({
        menuType: menu.type,
        price: {
          value: parseFloat(watch("price").toString()),
        },
      }));

      setVisibilities(updatedVisibilities);
      console.log("Fetch Menus", pricingOptions);

      setPricingOptions(updatedPricings);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };
  useEffect(() => {
    if (!isEditItem) {
      if (pricingOptions.length > 0) {
        setPricingOptions((prevPricingOptions) =>
          prevPricingOptions.map((option) => ({
            ...option,
            price: {
              value: parseFloat(watch("price").toString()),
            },
          }))
        );
      }
    }
  }, [watch("price")]);

  const reverseFormatAvailability = (
    formattedAvailability: FormattedAvailability[]
  ): Availability[] => {
    const timeMap = new Map<string, string>(
      timeOptions.map((option) => [option.value, option.label])
    );

    return formattedAvailability.map((item) => ({
      day: item.day,
      hours: item.hours.map((hour) => ({
        start: {
          label: timeMap.get(hour.start) || "",
          value: hour.start,
        },
        end: {
          label: timeMap.get(hour.end) || "",
          value: hour.end,
        },
      })),
      active: item.active,
    }));
  };
  const fetchItemData = async () => {
    if (editItemId) {
      try {
        const response = await sdk.getItem({ id: editItemId });
        const item = response.getItem;
        setChangesMenu(response.getItem);
        const nameDup = generateUniqueName(item?.name?.value);
        setValue("name", item.name.value);
        if (isDuplicateItem) {
          setValue("name", nameDup);
        }
        setValue("desc", item.desc.value);
        setValue("status", item.status === StatusEnum.Active ? true : false);
        setValue("price", item.price.value);
        setValue("applySalesTax", item.applySalesTax);
        setValue("popularItem", item.popularItem);
        setValue("upSellItem", item.upSellItem);
        setValue("isSpicy", item.isSpicy);
        setValue("hasNuts", item.hasNuts);
        setValue("isGlutenFree", item.isGlutenFree);
        setValue("isHalal", item.isHalal);
        setValue("isVegan", item.isVegan);
        const formattedVisibilities = item.visibility.map((visibility) => ({
          menuType: visibility.menuType,
          status: visibility.status as StatusEnum,
        }));
        if (formattedVisibilities.length > 0) {
          setVisibilities(formattedVisibilities);
        }
        const formattedPricingOption = item.priceOptions.map((price) => ({
          menuType: price.menuType,
          price: {
            value: price.price.value,
          },
        }));
        if (formattedPricingOption.length > 0) {
          setPricingOptions(formattedPricingOption);
        }

        const formateditemlist = item?.modifierGroup.map((el) => ({
          _id: el?.id,
          name: el?.name?.value ?? "",
        }));
        setSelectedItems(formateditemlist);
        setTempSelectedItems(formateditemlist);
        setprevItemsbfrEdit(formateditemlist);

        setPreviewUrl(item.image || "");
        if (item?.availability) {
          const originalAvailability = reverseFormatAvailability(
            item?.availability
          );
          setAvailability(originalAvailability);
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
    fetchMenuData();
    fetchItemData();
  }, [editItemId, setValue, setToastData]);

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      if (!isDuplicateItem) {
        if (!isValidNameAlphabetic(data?.name)) {
          setToastData({
            message:
              "Please use only alphabets and numbers while adding or updating name.",
            type: "error",
          });
          return;
        }
      }
      if (!data.price || data.price <= 0) {
        setToastData({
          message:
            "An item cannot be added without pricing, please add a numerical value that is greater than zero to save and continue",
          type: "error",
        });
      }

      const statusSub = data.status ? StatusEnum.Active : StatusEnum.Inactive;
      let updateInput: any = {
        _id: editItemId || "",
        priceOptions: pricingOptions,
        visibility: visibilities,
      };
      let hasChanges = false;
      const imgUrl = await handleLogoUpload();

      const addChange = (field: string, newValue: any) => {
        updateInput[field] = { value: newValue };
        hasChanges = true;
      };

      if (data.name !== changesMenu?.name?.value) {
        addChange("name", data.name);
      }

      if (data.desc !== changesMenu?.desc?.value) {
        addChange("desc", data.desc);
      }

      if (data.image !== changesMenu?.image?.value) {
        updateInput.image = data.image;
        hasChanges = true;
      }

      if (data.price !== changesMenu?.price?.value) {
        addChange("price", data.price);
      }

      if (data.status !== (changesMenu?.status === StatusEnum.Active)) {
        updateInput.status = data.status;
        hasChanges = true;
      }

      if (data.applySalesTax !== changesMenu?.applySalesTax) {
        updateInput.applySalesTax = data.applySalesTax;
        hasChanges = true;
      }

      if (data.popularItem !== changesMenu?.popularItem) {
        updateInput.popularItem = data.popularItem;
        hasChanges = true;
      }

      if (data.upSellItem !== changesMenu?.upSellItem) {
        updateInput.upSellItem = data.upSellItem;
        hasChanges = true;
      }

      if (data.isSpicy !== changesMenu?.isSpicy) {
        updateInput.isSpicy = data.isSpicy;
        hasChanges = true;
      }

      if (data.hasNuts !== changesMenu?.hasNuts) {
        updateInput.hasNuts = data.hasNuts;
        hasChanges = true;
      }

      if (data.isGlutenFree !== changesMenu?.isGlutenFree) {
        updateInput.isGlutenFree = data.isGlutenFree;
        hasChanges = true;
      }

      if (data.isHalal !== changesMenu?.isHalal) {
        updateInput.isHalal = data.isHalal;
        hasChanges = true;
      }

      if (data.isVegan !== changesMenu?.isVegan) {
        updateInput.isVegan = data.isVegan;
        hasChanges = true;
      }

      if (data.image !== changesMenu?.image) {
        updateInput.image = imgUrl || "";
        hasChanges = true;
      }

      const parsedPrice = roundOffPrice(parseFloat(data.price.toString()));

      const prevSelectedMenuIds = prevItemsbfrEdit.map((item) => item._id);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;
      const formattedAvailability = formatAvailability(availability);

      setBtnLoading(true);
      if (!isEditItem) {
        const imgUrl = await handleLogoUpload();

        await sdk.addItem({
          input: {
            name: {
              value: data.name,
            },
            desc: {
              value: data.desc,
            },
            image: imgUrl,
            price: {
              value: parsedPrice,
            },
            status: statusSub,
            applySalesTax: data.applySalesTax ? true : false,
            popularItem: data.popularItem ? true : false,
            upSellItem: data.upSellItem ? true : false,
            hasNuts: data.hasNuts ? true : false,
            isGlutenFree: data.isGlutenFree ? true : false,
            isHalal: data.isHalal ? true : false,
            isVegan: data.isVegan ? true : false,
            isSpicy: data.isSpicy ? true : false,
            availability: formattedAvailability,
            visibility: visibilities,
            priceOptions: pricingOptions,
          },
          modifierGroups: selectedItemsIds,
        });
        setBtnLoading(false);
        setisAddItemModalOpen(false);
        setisDuplicateItem(false);
        setfetchMenuDatas(!fetchMenuDatas);
      } else {
        // EDIT/UPDATE ITEM API
        await sdk.updateItem({
          input: updateInput,
        });
        isMenuAdded &&
          (await sdk.addModifierGroupToItem({
            modifierGroupId: addedMenuIds[0],
            itemId: editItemId || "",
          }));

        setBtnLoading(false);
        setisAddItemModalOpen(false);
        setfetchMenuDatas(!fetchMenuDatas);
        setisEditItem(false);
        setEditItemId(null);
        setisDuplicateItem(false);

        setToastData({
          type: "success",
          message: "Item Added Successfully",
        });
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
  const timeOptions: TimeOption[] = Array.from({ length: 24 * 2 }, (_, i) => {
    const time = moment()
      .startOf("day")
      .add(30 * i, "minutes");
    return {
      label: time.format("hh:mm A"),
      value: time.toISOString(),
    };
  });

  type TimeOption = {
    label: string;
    value: string;
  };
  type FormattedAvailability = {
    day: Day;
    hours: {
      start: string;
      end: string;
    }[];
    active: boolean;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const items = await sdk.getModifierGroupsforItemsDropDown();
        if (items && items.getModifierGroups) {
          const formattedItemsList = items.getModifierGroups.map((item) => ({
            _id: item._id || "",
            name: item?.name?.value || "",
            length: item?.modifiers?.length || 0,
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

  const headings = [
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "name", render: renderActions },
  ];

  const data = selectedItems.map((item) => ({
    ...item,
    actions: renderActions(item),
  }));

  const handleRemoveCategory = async () => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== remmovingId)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== remmovingId)
    );

    const isPresentInPrevItems = prevItemsbfrEdit.some(
      (item) => item._id === remmovingId
    );

    if (isEditItem && isPresentInPrevItems) {
      try {
        const res = await sdk.removeModifierGroupFromItem({
          modifierGroupId: remmovingId,
          itemId: editItemId || "",
        });

        setprevItemsbfrEdit((prevSelected) =>
          prevSelected.filter((item) => item._id !== remmovingId)
        );
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    }
    setConfirmationRemoval(false);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleItemClick = (item: any) => {
    setTempSelectedItems((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem._id === item._id)
        ? prevSelected.filter((i) => i._id !== item._id)
        : [item]
    );
  };

  const handleAddItems = () => {
    setSelectedItems([]);
    setSelectedItems(tempSelectedItems);
    setIsModalOpen(false);
  };
  const handleCreateModifierGroup = () => {
    setisAddModifierGroupModalOpen(true);
  };

  const handleEditItem = (id: string) => {
    setisAddModifierGroupModalOpen(true);
    setEditModGroupId(id);
    setisEditModGroup(true);
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

  const handleToggleSwitch = () => {
    if (visibilities.length > 1) {
      if (watch("status")) {
        // setValue("status", !watch("status"));
        setShowConfirmationModal(true);
      } else {
        setShowConfirmationModal(true);
      }
    } else {
      setValue("status", !watch("status"));
      const updatedVisibilities = visibilities.map((vib) => ({
        menuType: vib.menuType,
        status: StatusEnum.Inactive,
      }));
      setVisibilities(updatedVisibilities);
    }
  };
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

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

  const handlePriceChange = (newPrice: string, index: number) => {
    const updatedPricingOptions = [...pricingOptions];
    updatedPricingOptions[index].price.value = roundOffPrice(
      parseFloat(newPrice.toString())
    );
    setPricingOptions(updatedPricingOptions);
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
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {!isEditItem ? "ADD ITEM" : "EDIT ITEM"}
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
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Enter a valid price (e.g., 7.99)",
                },
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
          {pricingOptions.length > 0 && (
            <div className="mb-1">
              <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                Pricing Options
              </label>
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
                      value={option?.price?.value || ""}
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
                          <span className="text-blue-600">browse file</span>
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
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Status
            </label>

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
          <div>
            <label
              htmlFor="Options"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Options
            </label>
            <div className="mb-1 grid grid-cols-2 gap-4">
              {!taxRate ? (
                <div
                  className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white cursor-pointer"
                  onClick={() => setisShowTaxSettings(true)}
                >
                  <div>
                    <h3 className=" font-semibold text-start text-md">
                      Tax Rate was not found
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Please add tax rate to apply for this item
                    </p>
                  </div>
                </div>
              ) : (
                <CustomSwitchCard
                  label="sales Tax"
                  title="Apply Sales Tax"
                  caption="This item is subject to sales tax."
                  switchChecked={watch("applySalesTax")}
                  onSwitchChange={() =>
                    setValue("applySalesTax", !watch("applySalesTax"))
                  }
                />
              )}
              <CustomSwitchCard
                label="is it a popular item"
                title="Popular Item"
                caption="Mark this item as popular."
                switchChecked={watch("popularItem")}
                onSwitchChange={() =>
                  setValue("popularItem", !watch("popularItem"))
                }
              />
              <CustomSwitchCard
                label="do you want to up-sell it"
                title="Up-sell Item"
                caption="Suggest this item to customers."
                switchChecked={watch("upSellItem")}
                onSwitchChange={() =>
                  setValue("upSellItem", !watch("upSellItem"))
                }
              />
              <CustomSwitchCard
                label="does this item contain nuts"
                title="Contains Nuts"
                caption="This item contains nuts."
                switchChecked={watch("hasNuts")}
                onSwitchChange={() => setValue("hasNuts", !watch("hasNuts"))}
              />
              <CustomSwitchCard
                label="is the item gluten-free"
                title="Gluten-Free"
                caption="This item is gluten-free."
                switchChecked={watch("isGlutenFree")}
                onSwitchChange={() =>
                  setValue("isGlutenFree", !watch("isGlutenFree"))
                }
              />
              <CustomSwitchCard
                label="is it halal"
                title="Halal"
                caption="This item is halal."
                switchChecked={watch("isHalal")}
                onSwitchChange={() => setValue("isHalal", !watch("isHalal"))}
              />
              <CustomSwitchCard
                label="is it vegan"
                title="Vegan"
                caption="This item is vegan."
                switchChecked={watch("isVegan")}
                onSwitchChange={() => setValue("isVegan", !watch("isVegan"))}
              />
              <CustomSwitchCard
                label="is it spicy"
                title="Spicy"
                caption="This item is spicy."
                switchChecked={watch("isSpicy")}
                onSwitchChange={() => setValue("isSpicy", !watch("isSpicy"))}
              />
            </div>
          </div>
          <div>
            <FormAddTable
              data={data}
              headings={headings}
              title="Modifier Groups"
              emptyCaption="You can add Modifier Group for items here"
              emptyMessage="No Modifier Groups available"
              buttonText="Add Modifier Groups"
              onAddClick={handleAddClick}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Modifier Groups allow your customer to customize an item
            </p>
          </div>

          <AvailabilityComponent
            availability={availability}
            setAvailability={setAvailability}
          />

          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
          >
            <div className="flex justify-center items-center">
              {isEditItem ? "Save Item" : "Add Item"}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={itemsOption}
        tempSelectedItems={tempSelectedItems}
        handleItemClick={handleItemClick}
        handleAddItems={handleAddItems}
        createNewItemButtonLabel="Create New Modifier group"
        addSelectedItemsButtonLabel="Add Selected Modifier Groups"
        headings={headingsDropdown}
        renderActions={renderActions}
        onClickCreatebtn={handleCreateModifierGroup}
      />
      <ReusableModal
        isOpen={confirmationRemoval}
        onClose={() => {
          setConfirmationRemoval(false);
          setRemovingId("");
        }}
        title="Are you sure?"
        comments="By clicking yes the selected Modifier Group / modifier Groups will be removed from this Item. This action cannot be undone."
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

export default AddItemForm;
