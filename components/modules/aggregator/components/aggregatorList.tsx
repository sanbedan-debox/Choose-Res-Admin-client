// import CloverImage from "@/assets/integrators/clover.png";
// import UberEatsImage from "@/assets/integrators/ubereats.png";
// import { StaticImageData } from "next/image";
// import React, { useState } from "react";
// import AggregatorCard from "./aggregatorCard";
// interface AggregatorWithConnect extends Aggregator {
//   handleConnect: () => void;
// }

// interface Aggregator {
//   id: string;
//   name: string;
//   imageUrl: StaticImageData;
//   isConnected: boolean;
//   subtitle?: string;
//   description?: string;
//   handleConnect: () => void;
// }

// const AggregatorList: React.FC = () => {
//   const initialAggregators: AggregatorWithConnect[] = [
//     {
//       id: "clover",
//       name: "Clover",
//       imageUrl: CloverImage,
//       isConnected: false,
//       subtitle: "Payment Processor,Menu Management",
//       description:
//         "Connecting Choose with Clover enhances payment processing and integrates sales data, streamlining transactions and providing Clover merchants such as inventory, orders, and payment",
//       handleConnect: () => {
//         const redirectUri = encodeURIComponent(
//           `${process.env.NEXT_PUBLIC_DOMAIN}/clover-connection?fromAggregator=true`
//         );
//         window.location.href = `${process.env.NEXT_PUBLIC_CLOVER_BASE_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_CLOVER_APP_ID}&redirect_uri=${redirectUri}`;
//       },
//     },
//     {
//       id: "uber",
//       name: "UberEats",
//       imageUrl: UberEatsImage,
//       isConnected: false,
//       subtitle: "Food Delivery",
//       description:
//         "Connecting CHOOSE with Uber Eats streamlines order processing and inventory management, improving efficiency and customer experience by integrating seamless online ordering and delivery operations.",
//       handleConnect: () => {
//         const redirectUri = encodeURIComponent(
//           `${process.env.NEXT_PUBLIC_DOMAIN}/ubereats-connection?fromAggregator=true`
//         );
//         window.location.href = `${process.env.NEXT_PUBLIC_UBEREATS_CONNECT_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_UBEREATS_APP_ID}&redirect_uri=${redirectUri}`;
//       },
//     },
//   ];

//   const [aggregators, setAggregators] =
//     useState<AggregatorWithConnect[]>(initialAggregators);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {aggregators.map((aggregator) => (
//         <AggregatorCard
//           key={aggregator.id}
//           aggregator={aggregator}
//           onConnect={aggregator.handleConnect}
//         />
//       ))}
//     </div>
//   );
// };

// export default AggregatorList;

import CloverImage from "@/assets/integrators/clover.png";
import UberEatsImage from "@/assets/integrators/ubereats.png";
import { ConnectionStatusEnum } from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import AggregatorCard from "./aggregatorCard";

interface AggregatorWithConnect extends Aggregator {
  handleConnect: () => void;
}

interface Aggregator {
  id: string;
  name: string;
  imageUrl: StaticImageData;
  isConnected: boolean;
  subtitle?: string;
  description?: string;
  handleConnect: () => void;
}

const AggregatorList: React.FC = () => {
  const initialAggregators: AggregatorWithConnect[] = [
    {
      id: "clover",
      name: "Clover",
      imageUrl: CloverImage,
      isConnected: true,
      subtitle: "Payment Processor, Menu Management",
      description:
        "Connecting Choose with Clover enhances payment processing and integrates sales data, streamlining transactions and providing Clover merchants such as inventory, orders, and payment",
      handleConnect: () => {
        const redirectUri = encodeURIComponent(
          `${process.env.NEXT_PUBLIC_DOMAIN}/clover-connection?fromAggregator=true`
        );
        window.location.href = `${process.env.NEXT_PUBLIC_CLOVER_BASE_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_CLOVER_APP_ID}&redirect_uri=${redirectUri}`;
      },
    },
    {
      id: "uber",
      name: "UberEats",
      imageUrl: UberEatsImage,
      isConnected: false,
      subtitle: "Food Delivery",
      description:
        "Connecting CHOOSE with Uber Eats streamlines order processing and inventory management, improving efficiency and customer experience by integrating seamless online ordering and delivery operations.",
      handleConnect: () => {
        const redirectUri = encodeURIComponent(
          `${process.env.NEXT_PUBLIC_DOMAIN}/ubereats-connection?fromAggregator=true`
        );
        window.location.href = `${process.env.NEXT_PUBLIC_UBEREATS_CONNECT_URL}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_UBEREATS_APP_ID}&redirect_uri=${redirectUri}`;
      },
    },
  ];

  const [aggregators, setAggregators] =
    useState<AggregatorWithConnect[]>(initialAggregators);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await sdk.getAllIntegrations();
        const integrationData = response?.getAllIntegrations || [];

        // Create a map of integrations for quick lookup
        const integrationMap = new Map<string, boolean>(
          integrationData.map(({ platform, connectionStatus }) => [
            platform,
            connectionStatus === ConnectionStatusEnum.Connected,
          ])
        );

        // Update the aggregator list with the connection status
        const updatedAggregators = initialAggregators.map((aggregator) => ({
          ...aggregator,
          isConnected: integrationMap.get(aggregator.id) || false,
        }));

        setAggregators(updatedAggregators);
      } catch (error) {
        // Handle error (e.g., show a notification)
        console.error("Error fetching integrations:", error);
      }
    };

    fetchIntegrations();
  }, []);

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
