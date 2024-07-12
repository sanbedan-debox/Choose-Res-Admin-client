import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import RoopTable from "@/components/common/table/table";
import CBTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
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
  const { setisAddItemModalOpen, fetchMenuDatas } = useMenuStore();

  useEffect(() => {
    const fetchMenuItems = async () => {
      // setLoading(true);
      try {
        const response = await sdk.getItems();
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

    fetchMenuItems();
  }, [fetchMenuDatas, setToastData]);

  const renderActions = (rowData: { id: number }) => (
    <div className="flex space-x-2">
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

  const renderSwitch = (rowData: { status: StatusEnum; id: string }) => (
    <div>
      <CustomSwitch
        checked={rowData.status !== StatusEnum.Inactive}
        // onChange={() => handleToggleSwitch(rowData)}
        onChange={() => console.log(rowData)}
        label={`Toggle switch for ${rowData.id}`}
      />
    </div>
  );

  const headings = [
    { title: "Toggle Availibility", dataKey: "status", render: renderSwitch },
    { title: "Name", dataKey: "name.value" },
    // { title: "Description", dataKey: "desc.value" },
    // { title: "Price", dataKey: "price" },
    // { title: "Actions", dataKey: "name.value", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Item",
      onClick: () => setisAddItemModalOpen(true),
    },
  ];
  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={10}
        headings={headings}
        data={items}
        mainActions={mainActions}
      />
    </div>
  );
};

export default Items;
