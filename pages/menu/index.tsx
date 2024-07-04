import MainLayout from "@/components/layouts/MainLayout";
import React from "react";
import oneStore from "@/store/test";
import MenuSection from "@/components/common/menuSection/menuSection";
import { menuContents } from "./menuContent";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Menu: NextPageWithLayout = () => {
  const { userId } = oneStore();

  return <MenuSection contentList={menuContents} />;
  // return <div className="text-black">{userId}</div>;
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;
