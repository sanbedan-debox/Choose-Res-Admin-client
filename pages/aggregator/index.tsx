// Aggregator.tsx
import MainLayout from "@/components/layouts/mainBodyLayout";
import AggregatorList from "@/components/modules/aggregator/components/aggregatorList";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Aggregator: NextPageWithLayout = () => {
  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">Aggregator Connections</h1>
      <AggregatorList />
    </div>
  );
};

Aggregator.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Aggregator;
