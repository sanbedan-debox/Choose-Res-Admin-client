import CBTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuStore from "@/store/menu";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<any>();
  const { setisAddMenuModalOpen, fetchMenuDatas } = useMenuStore();
  const { setToastData } = useGlobalStore();
  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getAllMenus();
        if (response && response.getAllMenus) {
          // const formattedRestaurant = response.getAllMenus.map((res) => ({
          //   ...res,
          // }));
          // setMenu(formattedRestaurant);
          setMenu(response.getAllMenus);
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
  }, [fetchMenuDatas]);

  const headings = [{ title: "Name", dataKey: "name.value" }];

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
      label: "Add Menu",
      onClick: () => setisAddMenuModalOpen(true),
    },
  ];
  return (
    <div className="py-2">
      <CBTable
        headings={headings}
        data={menu}
        // data={menuItems}
        showAvailableSwitch
        actions={renderActions}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Menu;
