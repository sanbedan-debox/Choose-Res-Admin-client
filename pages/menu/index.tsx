import MenuSection from "@/components/common/menuSection/menuSection";
import MainLayout from "@/components/layout";
import Loader from "@/components/loader";
import useGlobalStore from "@/store/store";
import React, { useEffect, useState } from "react";
import { menuContents } from "./menuContent";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Menu: NextPageWithLayout = () => {
  const { setSelectedMenu } = useGlobalStore();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  // if (loading) {
  //   return <Loader />;
  // }

  return <MenuSection contentList={menuContents} />;
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;
