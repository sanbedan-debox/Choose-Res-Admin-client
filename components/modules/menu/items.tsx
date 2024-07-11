import CBTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuStore from "@/store/menu";
import useRestaurantsStore from "@/store/restaurant";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Items: React.FC = () => {
  const [items, setItems] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddItemModalOpen } = useMenuStore();

  const { selectedRestaurantId } = useRestaurantsStore();
  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getItems({
          id: selectedRestaurantId,
        });
        if (response && response.getItems) {
          // const formattedRestaurant = response.getAllMenus.map((res) => ({
          //   ...res,
          // }));
          // setMenu(formattedRestaurant);
          setItems(response.getItems);
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
      label: "Add Item",
      onClick: () => setisAddItemModalOpen(true),
    },
  ];
  return (
    <div className="py-2">
      <CBTable
        headings={headings}
        data={items}
        // data={menuItems}
        showAvailableSwitch
        actions={renderActions}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Items;
