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
  roundOffPrice,
} from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import useModStore from "@/store/modifiers";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";

interface IFormInput {
  isItemFromMenu: boolean;

  name: string;
  preSelect: boolean;
  maxSelections: number;
  desc: string;
  minSelections: number;
  price: number;
  image: string;
}

interface ItemOption {
  _id: string;
  name: string;
  price: number;
  desc: string;
  priceOptions: any[];
}

const AddModifierForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>();
  const [changesModifiers, setChangesModifiers] = useState<any | null>(null);

  const { fetchMenuDatas, setfetchMenuDatas, setisAddModifierModalOpen } =
    useMenuOptionsStore();
  const {
    editModId,
    isEditMod,
    setEditModId,
    setisEditMod,
    setisDuplicateMods,
    isDuplicateMods,
  } = useModStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isItemFromMenu, setIsItemFromMenu] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);

  // const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await sdk.getItems();
      const formattedItems = response.getItems.map((item: any) => ({
        _id: item._id,
        name: item.name.value,
        desc: item.desc.value,
        price: item.price.value,
        priceOptions: item.priceOptions,
      }));
      setItemOptions(formattedItems);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const fetchModData = async () => {
    if (editModId) {
      try {
        const response = await sdk.getModifier({ id: editModId });
        const item = response.getModifier;
        setChangesModifiers(item);

        setValue("name", item.name.value);
        const nameDup = generateUniqueName(item?.name?.value);
        if (isDuplicateMods) {
          setValue("name", nameDup);
        }
        setValue("desc", item.desc.value);
        setValue("preSelect", item.preSelect);
        setValue("isItemFromMenu", item.isItem);
        setIsItemFromMenu(item.isItem);
        setValue("price", item.price.value);
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
    fetchItems();

    fetchModData();
  }, [editModId, setValue, setToastData]);

  const onSubmit = async (data: IFormInput) => {
    if (!isDuplicateMods) {
      if (!isValidNameAlphabetic(data.name)) {
        setToastData({
          message:
            "Please use only alphabets and numbers while adding or updating name.",
          type: "error",
        });
        return;
      }
    }

    const parsedPrice = roundOffPrice(parseFloat(data.price.toString()));
    let updateInput: any = { _id: editModId || "" };
    let hasChanges = false;
    const addChange = (field: string, newValue: any) => {
      updateInput[field] = { value: newValue };
      hasChanges = true;
    };
    if (data.name !== changesModifiers?.name?.value) {
      addChange("name", data.name);
    }

    if (data.price !== changesModifiers?.price?.value) {
      addChange("price", data.price);
    }

    if (data.preSelect !== changesModifiers?.preSelect) {
      updateInput.preSelect = data.preSelect;
      hasChanges = true;
    }

    try {
      setBtnLoading(true);
      const imgUrl = await handleLogoUpload();

      !isEditMod
        ? // ADD ITEM API

          await sdk.addModifier({
            input: {
              desc: {
                value: data.desc,
              },
              isItem: isItemFromMenu,
              name: {
                value: data.name,
              },
              price: {
                value: parsedPrice,
              },
              preSelect: data.preSelect,
            },
          })
        : await sdk.updateModifier({
            input: updateInput,
          });

      setisAddModifierModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisEditMod(false);
      setEditModId(null);
      setisDuplicateMods(false);
      setToastData({
        type: "success",
        message: "Modifier Added Successfully",
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

  const handleLogoUpload = async () => {
    if (logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);
      formData.append("upload_preset", "modifier-images");

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
            {!isEditMod ? "ADD Modifier" : "EDIT Modifier"}
          </h2>
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="mb-1 flex items-center">
            <CustomSwitch
              checked={isItemFromMenu}
              onChange={() => setIsItemFromMenu(!isItemFromMenu)}
              label="Is item from menu"
              className="mr-2"
            />
            <label className="text-sm font-medium text-left text-gray-700">
              Is item from menu
            </label>
          </div>

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
              className={`input input-primary ${
                isItemFromMenu ? "cursor-pointer" : "cursor-text"
              }  `}
              placeholder="Enter Modifier name"
              readOnly={isItemFromMenu}
              onClick={
                isItemFromMenu ? () => setShowItemModal(true) : undefined
              }
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
              {...register("price", {
                required: "Price is required",
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
              Modifier prices will be rounded off the nearest number.
            </p>

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
                <label className="block  text-sm font-medium text-left text-gray-700">
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
              <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
                This is the image your customer will see
              </p>
            </div>
          </div>

          <div className="">
            <label
              htmlFor="optional"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              optional
            </label>

            <CustomSwitchCard
              label="Pre Select"
              title="Pre Select"
              caption="If its checked,Then Modifier will be preselected"
              switchChecked={watch("preSelect")}
              onSwitchChange={() => setValue("preSelect", !watch("preSelect"))}
            />
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Turn on if you want to make this modifiers optional
            </p>

            {errors.preSelect && (
              <p className="text-red-500 text-sm text-start">
                {errors.preSelect.message}
              </p>
            )}
          </div>
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
            // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <div className="flex justify-center items-center">
              {!isEditMod ? "Add Modifier" : "Edit Modifier"}
              {!isEditMod ? (
                <IoIosAddCircleOutline className="text-xl ml-1" />
              ) : (
                <RiEditCircleLine className="text-xl ml-1" />
              )}
            </div>
          </CButton>
        </div>
      </form>
      <ReusableModal
        comments="Select any Item from the menu that you want to replace as a modifier"
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title="Select Item"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search items..."
            // className="w-full p-2 border border-gray-300 rounded"
            className="input input-primary"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-2">
            {itemOptions
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="p-2 border border-gray-300 rounded cursor-pointer hover:bg-primary hover:bg-opacity-5"
                  onClick={() => {
                    const onlineOrderingPrice = item.priceOptions.find(
                      (option) => option.menuType === "OnlineOrdering"
                    )?.price.value;

                    const selectedPrice = onlineOrderingPrice ?? item.price;

                    setSelectedItem(item);
                    setValue("name", item.name);
                    setValue("price", selectedPrice);
                    setValue("desc", item.desc);
                    setShowItemModal(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
          </div>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddModifierForm;
