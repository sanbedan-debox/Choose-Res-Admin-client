import MainLayout from "@/components/layouts/mainBodyLayout";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Aggregator: NextPageWithLayout = () => {
  return <div className="text-black">COMING SOON</div>;
};

Aggregator.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Aggregator;
