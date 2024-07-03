import MenuSection from "@/components/common/menuSection/menuSection";
import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useEffect, useState } from "react";
import { menuContents } from "./menuContent";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Menu: NextPageWithLayout = () => {
  // return <MenuSection contentList={menuContents} />;
  return <div className="text-black">COMING SOON</div>;
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;
