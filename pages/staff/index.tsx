import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Staff: NextPageWithLayout = () => {
  return <div className="text-black">COMING SOON</div>;
};

Staff.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Staff;