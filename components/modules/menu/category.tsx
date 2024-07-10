import CBTable from "@/components/common/table/table";
import useRestaurantsStore from "@/store/restaurant";
import { sdk } from "@/utils/graphqlClient";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Categories: React.FC = () => {
  const [cats, setCats] = useState();
  const { selectedRestaurantId } = useRestaurantsStore();
  useEffect(() => {
    const fetchRestaurantUsers = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getCategories({
          id: selectedRestaurantId,
        });
        if (response && response.getCategories) {
          // const formattedRestaurant = response.getAllMenus.map((res) => ({
          //   ...res,
          // }));
          // setMenu(formattedRestaurant);
          setCats(response.getCategories);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant users:", error);
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
      label: "Add Category",
      onClick: () => console.log(true),
    },
  ];
  return (
    <div className="py-2">
      <CBTable
        headings={headings}
        data={cats}
        // data={menuItems}
        showAvailableSwitch
        actions={renderActions}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Categories;
