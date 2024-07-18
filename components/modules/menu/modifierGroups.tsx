import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Modifiers: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddModifierGroupModalOpen, fetchMenuDatas } =
    useMenuOptionsStore();

  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getModifierGroups();
        if (response && response.getModifierGroups) {
          setModifierGroups(
            response.getModifierGroups.map((el) => ({
              _id: el._id,
              name: el.name.value,
            }))
          );
        }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      } finally {
        // setLoading(false);
      }
    };

    fetchRestaurantUsers();
  }, []);

  const headings = [{ title: "Name", dataKey: "name" }];

  const renderActions = (rowData: { id: number }) => (
    <div className="flex space-x-3">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => console.log("Delete", rowData.id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => console.log("Edit", rowData.id)}
      />
      <FaShieldAlt
        className="text-green-500 cursor-pointer"
        onClick={() => console.log("Change Password", rowData.id)}
      />
    </div>
  );
  const mainActions = [
    {
      label: "Add Modifiers Groups",
      onClick: () => setisAddModifierGroupModalOpen(true),
    },
  ];
  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={20}
        headings={headings}
        data={modifierGroups}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Modifiers;
