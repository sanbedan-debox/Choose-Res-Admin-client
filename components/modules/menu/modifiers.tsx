import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModStore from "@/store/modifiers";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { BsCopy } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

const Modifiers: React.FC = () => {
  const [modifier, setModifier] =
    useState<{ _id: string; name: string; price: number }[]>();
  const { setToastData } = useGlobalStore();
  const { setisAddModifierModalOpen, refreshMenuBuilderData } =
    useMenuOptionsStore();
  const [tableLoading, setTableLoading] = useState(false);
  const { setEditModId, setisEditMod, setisDuplicateMods } = useModStore();

  const fetchModifiers = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getModifiers();
      if (response && response.getModifiers) {
        setModifier(
          response.getModifiers.map(
            (el: { _id: string; name: string; price: number }) => ({
              _id: el._id,
              name: el.name,
              price: el.price,
            })
          )
        );
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchModifiers();
  }, [refreshMenuBuilderData]);

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );

  const handleEditItem = (_id: string) => {
    setisAddModifierModalOpen(true);
    setEditModId(_id);
    setisEditMod(true);
    setisDuplicateMods(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setisAddModifierModalOpen(true);
    setEditModId(_id);
    setisDuplicateMods(true);
    setisEditMod(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-3 justify-end">
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />

      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      />
    </div>
  );

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "_id", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Modifiers",
      onClick: () => setisAddModifierModalOpen(true),
    },
  ];

  return (
    <div className="py-2">
      <RoopTable
        loading={tableLoading}
        itemsPerPage={10}
        headings={headings}
        data={modifier ?? []}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Modifiers;
