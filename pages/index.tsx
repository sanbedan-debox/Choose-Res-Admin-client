import DashboardLayout from "@/components/layout";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Hello: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

Hello.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Hello;
