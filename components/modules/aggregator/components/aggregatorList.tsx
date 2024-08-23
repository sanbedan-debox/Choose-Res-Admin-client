import useAggregatorIntegrationStore from "@/store/aggregatorIntegration";
import React, { useState } from "react";
import { Aggregator } from "../interface/interface";
import AggregatorCard from "./aggregatorCard";

interface AggregatorWithConnect extends Aggregator {
  handleConnect: () => void;
}

const AggregatorList: React.FC = () => {
  const { setIsComingFromAggregatorPage } = useAggregatorIntegrationStore();
  const initialAggregators: AggregatorWithConnect[] = [
    {
      id: "1",
      name: "Clover",
      imageUrl: "/assets/integrators/clover.png",
      isConnected: false,
      handleConnect: function () {
        setIsComingFromAggregatorPage(true);
        window.location.href = `https://sandbox.dev.clover.com/oauth/v2/authorize?client_id=${
          process.env.NEXT_PUBLIC_CLOVER_APP_ID
        }&redirect_uri=${encodeURIComponent(
          "http://localhost:3000/clover-connection"
        )}`;
      },
    },
    {
      id: "2",
      name: "UberEats",
      imageUrl: "/assets/integrators/ubereats.png",
      isConnected: false,
      handleConnect: function () {
        setIsComingFromAggregatorPage(true);
        window.location.href = `https://sandbox.dev.uber.com/oauth/v2/authorize?client_id=${
          process.env.NEXT_PUBLIC_UBEREATS_APP_ID
        }&redirect_uri=${encodeURIComponent(
          "http://localhost:3000/ubereats-connection"
        )}`;
      },
    },
  ];
  const [aggregators, setAggregators] =
    useState<AggregatorWithConnect[]>(initialAggregators);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {aggregators.map((aggregator) => (
        <AggregatorCard
          key={aggregator.id}
          aggregator={aggregator}
          onConnect={aggregator.handleConnect}
        />
      ))}
    </div>
  );
};

export default AggregatorList;
