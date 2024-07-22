import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Catering: NextPageWithLayout = () => {
  return <div className="text-black">COMING SOON</div>;
};

Catering.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Catering;
