import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import ReusableModal from "@/components/common/modal/modal";
import { MenuTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
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
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";

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
  } = useForm<IFormInput>({ defaultValues: { preSelect: false } });
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
      const formattedItems = response.getItems.map(
        (item: {
          _id: string;
          name: string;
          desc: string;
          price: number;
          priceOptions: {
            price: number;
            menuType: MenuTypeEnum;
          }[];
        }) => ({
          _id: item._id,
          name: item.name,
          desc: item.desc,
          price: item.price,
          priceOptions: item.priceOptions,
        })
      );
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
    if (editModId && (isEditMod || isDuplicateMods)) {
      try {
        const response = await sdk.getModifier({ id: editModId });
        if (response && response.getModifier) {
          const { name, desc, preSelect, isItem, price } = response.getModifier;
          setChangesModifiers(response.getModifier);
          setValue("name", name);
          const nameDup = generateUniqueName(name);
          if (isDuplicateMods) {
            setValue("name", nameDup);
          }
          setValue("desc", desc);
          setValue("preSelect", preSelect);
          setValue("isItemFromMenu", isItem);
          setIsItemFromMenu(isItem);
          setValue("price", price);
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

    if (!data.price || data.price < 0) {
      setToastData({
        message: "Price cannot be less than zero, please try again!",
        type: "error",
      });
      return;
    }
    const parsedPrice = roundOffPrice(parseFloat(data.price.toString()));
    let updateInput: any = { _id: editModId || "" };
    let hasChanges = false;

    if (data.name !== changesModifiers?.name) {
      updateInput.name = data.name;
      hasChanges = true;
    }
    if (data.desc !== changesModifiers?.desc) {
      updateInput.desc = data.desc;
      hasChanges = true;
    }

    if (data.price !== changesModifiers?.price) {
      updateInput.price = parsedPrice;
      hasChanges = true;
    }

    if (data.preSelect !== changesModifiers?.preSelect) {
      updateInput.preSelect = data.preSelect;
      hasChanges = true;
    }

    try {
      setBtnLoading(true);
      const imgUrl = await handleLogoUpload();

      if (!isEditMod) {
        // ADD ITEM API

        await sdk.addModifier({
          input: {
            desc: data.desc,

            isItem: isItemFromMenu,
            name: data.name,

            price: parsedPrice,

            preSelect: data.preSelect,
          },
        });
        setToastData({
          type: "success",
          message: "Modifier Added Successfully",
        });
      } else {
        if (hasChanges) {
          await sdk.updateModifier({
            input: updateInput,
          });
          setToastData({
            type: "success",
            message: "Modifier Updated Successfully",
          });
        }
      }

      setisAddModifierModalOpen(false);
      setfetchMenuDatas(!fetchMenuDatas);
      setisEditMod(false);
      setEditModId(null);
      setisDuplicateMods(false);
      setEditModId(null);
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
      className="z-10 w-full min-h-full max-w-4xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" mx-auto p-6 w-full bg-white rounded-md "
      >
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="w-full mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-left text-gray-700">
              Is this an Item from Menu ?
            </label>
            <CustomSwitch
              checked={isItemFromMenu}
              onChange={() => setIsItemFromMenu(!isItemFromMenu)}
              label="Is item from menu"
              className="mr-2"
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Display Name
            </label>

            {isItemFromMenu && (
              <p className="text-gray-600 text-xs mt-1 mb-1 text-start">
                Tap on the below display name field to select desired Item
              </p>
            )}

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
                item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="p-2 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-50"
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
                  <div className="text-md flex justify-between font-medium text-gray-800">
                    {item.name}
                    {item.price && (
                      <div className=" text-sm text-gray-600">
                        ${item.price}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ReusableModal>
    </motion.div>
  );
};

export default AddModifierForm;
