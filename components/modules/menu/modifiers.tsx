import CBTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useRestaurantsStore from "@/store/restaurant";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Modifiers: React.FC = () => {
  const [modifier, setModifier] = useState();
  const { selectedRestaurantId } = useRestaurantsStore();
  const { setToastData } = useGlobalStore();

  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getModifiers({
          id: selectedRestaurantId,
        });
        if (response && response.getModifiers) {
          // const formattedRestaurant = response.getAllMenus.map((res) => ({
          //   ...res,
          // }));
          // setMenu(formattedRestaurant);
          setModifier(response.getModifiers);
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
      label: "Add Modifiers",
      onClick: () => console.log(true),
    },
  ];
  return (
    <div className="py-2">
      <CBTable
        headings={headings}
        data={modifier}
        showAvailableSwitch
        actions={renderActions}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Modifiers;
