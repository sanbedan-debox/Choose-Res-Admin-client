import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Tips: NextPageWithLayout = () => {
  return <div className="text-black">COMING SOON</div>;
};

Tips.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Tips;