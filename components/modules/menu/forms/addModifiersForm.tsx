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
}

interface ItemOption {
  _id: string;
  name: string;
  price: number;
  desc: string;
  priceOptions: {
    price: number;
    menuType: MenuTypeEnum;
  }[];
}

const AddModifierForm = () => {
  // Configs
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm<IFormInput>({ defaultValues: { preSelect: false } });

  // Global States
  const {
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    setIsAddModifierModalOpen,
  } = useMenuOptionsStore();

  const {
    editModId,
    isEditMod,
    setEditModId,
    setIsEditMod,
    setisDuplicateMods,
    isDuplicateMods,
  } = useModStore();

  const { setToastData } = useGlobalStore();

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Local States
  const [modifierData, setModifierData] = useState<{
    _id: string;
    name: string;
    desc: string;
    price: number;
    preSelect: boolean;
  } | null>(null);

  const [isItemFromMenu, setIsItemFromMenu] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Edit States
  // API Callls

  const fetchModData = async () => {
    if (editModId && (isEditMod || isDuplicateMods)) {
      try {
        const response = await sdk.getModifier({ id: editModId });
        if (response && response.getModifier) {
          const { name, desc, preSelect, isItem, price } = response.getModifier;
          setModifierData({
            _id: editModId,
            name,
            desc,
            preSelect,
            price,
          });

          setValue("name", isDuplicateMods ? generateUniqueName(name) : name);

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

  useEffect(() => {
    fetchItems();
    fetchModData();
  }, [editModId, setValue, setToastData]);

  // Helper Functions
  // Handler Functions
  const onSubmit = async (data: IFormInput) => {
    if (!isValidNameAlphabetic(data.name)) {
      setToastData({
        message:
          "Please use only alphabets and numbers while adding or updating name.",
        type: "error",
      });
      return;
    }

    if ((data.price ?? 0) < 0) {
      setToastData({
        message: "Price cannot be less than zero, please try again!",
        type: "error",
      });
      return;
    }
    if (data?.desc?.length <= 20 || data?.desc?.length >= 120) {
      setToastData({
        message: "Modifier Desciprion should be between 60 to 120 characters",
        type: "error",
      });
      return;
    }
    const parsedPrice = roundOffPrice(parseFloat(data.price.toString()));
    let updateInput: {
      _id: string;
      name?: string;
      price?: number;
      desc?: string;
      preSelect?: boolean;
    } = { _id: editModId || "" };
    let hasChanges = false;

    if (data.name !== modifierData?.name) {
      updateInput.name = data.name;
      hasChanges = true;
    }
    if (data.desc !== modifierData?.desc) {
      updateInput.desc = data.desc;
      hasChanges = true;
    }

    if (data.price !== modifierData?.price) {
      updateInput.price = parsedPrice;
      hasChanges = true;
    }

    if (data.preSelect !== modifierData?.preSelect) {
      updateInput.preSelect = data.preSelect;
      hasChanges = true;
    }

    try {
      setActionLoading(true);

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

      setIsAddModifierModalOpen(false);
      setRefreshMenuBuilderData(!refreshMenuBuilderData);
      setIsEditMod(false);
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
      setActionLoading(false);
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
            loading={actionLoading}
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
                    )?.price;

                    const selectedPrice = onlineOrderingPrice ?? item.price;

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
