import MainLayout from "@/components/layouts/mainBodyLayout";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Table: NextPageWithLayout = () => {
  return <div className="text-black">COMING SOON</div>;
};

Table.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Table;
