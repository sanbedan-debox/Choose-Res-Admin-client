import RoopTable from "@/components/common/table/table";
import CBTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuStore from "@/store/menu";
import useRestaurantsStore from "@/store/restaurant";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Categories: React.FC = () => {
  const [cats, setCats] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddCategoryModalOpen, fetchMenuDatas } = useMenuStore();

  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getCategories();
        if (response && response.getCategories) {
          // const formattedRestaurant = response.getAllMenus.map((res) => ({
          //   ...res,
          // }));
          // setMenu(formattedRestaurant);
          setCats(response.getCategories);
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
  }, [fetchMenuDatas, setToastData]);

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
      label: "Add Category",
      onClick: () => setisAddCategoryModalOpen(true),
    },
  ];
  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={10}
        headings={headings}
        data={cats}
        // data={menuItems}
        // showAvailableSwitch
        // actions={renderActions}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Categories;
