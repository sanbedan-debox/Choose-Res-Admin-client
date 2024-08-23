import React, { useState } from "react";
import { Aggregator } from "../interface/interface";
import AggregatorCard from "./aggregatorCard";

interface AggregatorWithConnect extends Aggregator {
  handleConnect: () => void;
}

const AggregatorList: React.FC = () => {
  const initialAggregators: AggregatorWithConnect[] = [
    {
      id: "1",
      name: "Clover",
      imageUrl: "/assets/integrators/clover.png",
      isConnected: false,
      handleConnect: () => {
        const redirectUri = encodeURIComponent(
          `${process.env.NEXT_PUBLIC_APP_URL}/clover-connection?fromAggregator=true`
        );
        window.location.href = `${process.env.NEXT_PUBLIC_CLOVER_CONNECT_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_CLOVER_APP_ID}&redirect_uri=${redirectUri}`;
      },
    },
    {
      id: "2",
      name: "UberEats",
      imageUrl: "/assets/integrators/ubereats.png",
      isConnected: false,
      handleConnect: () => {
        const redirectUri = encodeURIComponent(
          `${process.env.NEXT_PUBLIC_APP_URL}/ubereats-connection?fromAggregator=true`
        );
        window.location.href = `${process.env.NEXT_PUBLIC_UBEREATS_CONNECT_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_UBEREATS_APP_ID}&redirect_uri=${redirectUri}`;
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
