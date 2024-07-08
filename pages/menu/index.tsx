import MainLayout from "@/components/layouts/MainLayout";
import React from "react";
import oneStore from "@/store/test";
import MenuManagement from "@/components/modules/menu/menuManagement";
import BulkManagement from "@/components/modules/menu/bulkManagement";
import Catering from "../catering";
import Tabs from "@/components/common/tabs/tabs";

const tabItems = [
  { label: "Menus", component: <MenuManagement /> },
  { label: "Categories", component: <BulkManagement /> },
  { label: "Items", component: <Catering /> },
  { label: "Modifier Groups", component: <Catering /> },
  { label: "Modifiers", component: <Catering /> },
];

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Menu: NextPageWithLayout = () => {
  const { userId } = oneStore();

  return <Tabs items={tabItems} />;
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;
