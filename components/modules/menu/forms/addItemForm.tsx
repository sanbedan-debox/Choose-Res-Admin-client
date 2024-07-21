import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { StatusEnum } from "@/generated/graphql";
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
  regularHours: {
    Monday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Tuesday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Wednesday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Thursday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Friday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Saturday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Sunday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
  };
  activeDays: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
}

interface ItemsDropDownType {
  _id: string;
  name: string;
}

const AddItemForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>({
    defaultValues: {
      regularHours: {
        Monday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Tuesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Wednesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Thursday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Friday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Saturday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Sunday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
      },
      activeDays: {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
      },
    },
  });
  const [changesMenu, setChangesMenu] = useState<any>([]);

  const {
    fetchMenuDatas,
    setfetchMenuDatas,
    setisAddItemModalOpen,
    setisAddModifierGroupModalOpen,
  } = useMenuOptionsStore();
  const { editItemId, isEditItem, setEditItemId, setisEditItem } =
    useMenuItemsStore();
  const { setEditModGroupId, setisEditModGroup } = useModGroupStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [prevItemsbfrEdit, setprevItemsbfrEdit] = useState<ItemsDropDownType[]>(
    []
  );
  const [itemsOption, setItemsOption] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedItems, setTempSelectedItems] = useState<
    ItemsDropDownType[]
  >([]);

  useEffect(() => {
    const fetchItemData = async () => {
      if (editItemId) {
        try {
          const response = await sdk.getItem({ id: editItemId });
          const item = response.getItem;
          setChangesMenu(response.getItem);
          setValue("name", item.name.value);
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
          setSelectedItems(item?.modifierGroup);
          const formateditemlist = item?.modifierGroup.map((el) => ({
            _id: el._id,
            name: el?.name?.value ?? "",
          }));
          setTempSelectedItems(formateditemlist);
          setprevItemsbfrEdit(formateditemlist);
          setPreviewUrl(item.image || "");
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
  }, [editItemId, setValue, setToastData]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const items = await sdk.getModifierGroupsforItemsDropDown();
        if (items && items.getModifierGroups) {
          const formattedItemsList = items.getModifierGroups.map((item) => ({
            _id: item._id,
            name: item?.name?.value,
            length: item?.modifiers?.length,
          }));
          setItemsOption(formattedItemsList);
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

  const onSubmit = async (data: IFormInput) => {
    try {
      setBtnLoading(true);
      const statusSub = data.status ? StatusEnum.Active : StatusEnum.Inactive;

      const parsedPrice = parseFloat(data.price.toString());
      const formattedData = Object.keys(data.regularHours).map((day) => ({
        Day: day,
        hours: data.regularHours[
          day as
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday"
            | "Sunday"
        ]
          .filter((slot: any) => slot.from && slot.to)
          .map((slot: any) => ({
            start: slot.from,
            end: slot.to,
          })),
        active:
          data.activeDays[
            day as
              | "Monday"
              | "Tuesday"
              | "Wednesday"
              | "Thursday"
              | "Friday"
              | "Saturday"
              | "Sunday"
          ],
      }));

      const formatData = (formattedData: any[]): any[] => {
        const currentDate = DateTime.now().toISO();
        const endcurrentDate = DateTime.now().plus({ minutes: 90 }).toISO();
        return formattedData.map((dayData) => {
          const { Day, hours, active } = dayData;

          const formattedHours = hours.map((hour: any) => {
            let start = hour.start.value || currentDate;
            let end = hour.end.value || endcurrentDate;

            return {
              start,
              end,
            };
          });

          return {
            day: Day,
            hours: formattedHours,
            active,
          };
        });
      };
      const formattedSampleInput = formatData(formattedData);
      // setAvailabilityHours(formattedSampleInput);
      const prevSelectedMenuIds = prevItemsbfrEdit.map((item) => item._id);
      const selectedItemsIds = selectedItems.map((item) => item._id);
      const addedMenuIds = selectedItemsIds.filter(
        (id) => !prevSelectedMenuIds.includes(id)
      );
      const isMenuAdded = addedMenuIds.length > 0;
      setBtnLoading(true);
      if (!isEditItem) {
        // ADD ITEM API
        await sdk.addItem({
          input: {
            name: {
              value: data.name,
            },
            desc: {
              value: data.desc,
            },
            image: previewUrl,
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
            availability: formattedSampleInput,
          },
          modifierGroups: selectedItemsIds,
        });
        setBtnLoading(false);
        setisAddItemModalOpen(false);
        setfetchMenuDatas(!fetchMenuDatas);
      } else {
        // EDIT/UPDATE ITEM API
        await sdk.updateItem({
          input: {
            _id: editItemId || "",
            name: {
              value: data.name,
            },
            desc: {
              value: data.desc,
            },
            image: previewUrl,
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
            // availability: [],
          },
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

  useEffect(() => {
    if (!isModalOpen && selectedItems.length > 0) {
      setItemsOption((prevItemsOption) =>
        prevItemsOption.filter(
          (item) =>
            !selectedItems.some((selectedItem) => selectedItem._id === item._id)
        )
      );
    }
  }, [isModalOpen, selectedItems]);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "csv-data");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
        { method: "POST", body: formData }
      ).then((r) => r.json());

      const cloudinaryUrl = response?.secure_url;
      setPreviewUrl(cloudinaryUrl);
      setIsUploading(false);
    }
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-center">
      <FaTrash
        className="text-red-600 cursor-pointer"
        onClick={() => handleRemoveItem(rowData._id)}
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

  const handleRemoveItem = async (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );

    setTempSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item._id !== id)
    );
    if (isEditItem) {
      const res = await sdk.removeModifierGroupFromItem({
        modifierGroupId: id,
        itemId: editItemId || "",
      });
      if (res) {
        setprevItemsbfrEdit((prevSelected) =>
          prevSelected.filter((item) => item._id !== id)
        );
      }
    }
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const filteredItems = itemsOption.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleItemClick = (item: any) => {
    console.log(item);
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

  const handleAddItem = () => {
    setisAddItemModalOpen(true);
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
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              id="price"
              className="input input-primary"
              placeholder="Enter item price"
              style={{
                appearance: "textfield",
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              onWheel={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "-" || e.key === "+") {
                  e.preventDefault();
                }
              }}
            />
            {errors.price && (
              <p className="text-red-500 text-sm text-start">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="block mb-2 text-lg font-medium text-left text-gray-700">
              Photo
            </label>
            <div className="mb-4">
              <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
                <input
                  type="file"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {isUploading ? (
                    <div className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto animate-spin"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : (
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
                        Upload an image
                      </p>
                    </div>
                  )}
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                  />
                )}
              </div>
            </div>
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
              onSwitchChange={() => setValue("status", !watch("status"))}
            />

            {errors.status && (
              <p className="text-red-500 text-sm text-start">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Options"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Options
            </label>
            <div className="mb-1 grid grid-cols-2 gap-4">
              <CustomSwitchCard
                label="sales Tax"
                title="Apply Sales Tax"
                caption="This item is subject to sales tax."
                switchChecked={watch("applySalesTax")}
                onSwitchChange={() =>
                  setValue("applySalesTax", !watch("applySalesTax"))
                }
              />
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
          <FormAddTable
            data={data}
            headings={headings}
            title="Modifier Groups"
            emptyCaption="You can add Modifier Group for items here"
            emptyMessage="No Modifier Groups available"
            buttonText="Add Modifier Groups"
            onAddClick={handleAddClick}
          />
          <AvailabilityForm
            control={control}
            errors={errors}
            getValues={null}
            register={register}
            setValue={setValue}
            watch={watch}
            key={null}
          />

          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Item
          </CButton>
        </div>
      </form>
      <AddFormDropdown
        title="Add Modifier Groups"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        filteredItems={filteredItems}
        tempSelectedItems={tempSelectedItems}
        handleItemClick={handleItemClick}
        handleAddItems={handleAddItems}
        createNewItemButtonLabel="Create New Modifier group"
        addSelectedItemsButtonLabel="Add Selected Modifier Groups"
        headings={headingsDropdown}
        renderActions={renderActions}
        onClickCreatebtn={handleCreateModifierGroup}
      />
    </motion.div>
  );
};

export default AddItemForm;
