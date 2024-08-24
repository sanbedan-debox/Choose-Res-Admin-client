import {
  IntegrationConnectionStatusEnum,
  IntegrationPlatformEnum,
} from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { Aggregator, aggregatorList } from "@/utils/aggregators";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useCallback, useEffect, useState } from "react";
import AggregatorCard from "./aggregatorCard";

interface AggregatorListProps {
  integrations: {
    _id: string;
    platform: IntegrationPlatformEnum;
    connectionStatus: IntegrationConnectionStatusEnum;
  }[];
}

const APP_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "";

// Clover Config
const CLOVER_ENDPOINT = process.env.NEXT_PUBLIC_CLOVER_BASE_URL ?? "";
const CLOVER_APP_ID = process.env.NEXT_PUBLIC_CLOVER_APP_ID ?? "";

const AggregatorList: React.FC<AggregatorListProps> = ({ integrations }) => {
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const { setToastData } = useGlobalStore();

  const changeLoadingStatus = (
    platform: IntegrationPlatformEnum,
    loading: boolean
  ) => {
    setAggregators((prev) => {
      let arr = [...prev];
      let index = arr.findIndex((e) => e.platform === platform);
      if (index >= 0) {
        arr[index].loading = loading;
      }
      return arr;
    });
  };

  const connectHandler = (platform: IntegrationPlatformEnum) => {
    if (platform === IntegrationPlatformEnum.Clover) {
      console.log("here");
      const redirectUri = encodeURIComponent(
        `${APP_DOMAIN}/clover-connection?fromAggregator=true`
      );
      window.location.href = `${CLOVER_ENDPOINT}/oauth/v2/authorize?client_id=${CLOVER_APP_ID}&redirect_uri=${redirectUri}`;
    }
  };

  const disconnectHandler = useCallback(
    async (platform: IntegrationPlatformEnum) => {
      // Clover handler
      if (platform === IntegrationPlatformEnum.Clover) {
        try {
          changeLoadingStatus(platform, true);
          const resp = await sdk.DisconnectCloverConnection();
          if (!resp.disconnectCloverConnection) {
            setToastData({
              message: "Something went wrong, please try again!",
              type: "error",
            });
            return;
          }

          setAggregators((prev) => {
            let arr = [...prev];
            let index = arr.findIndex((e) => e.platform === platform);
            if (index >= 0) {
              arr[index].connectionStatus =
                IntegrationConnectionStatusEnum.NotConnected;
            }
            return arr;
          });

          setToastData({
            message:
              "Clover account is disconnected from your account successfully!",
            type: "success",
          });
        } catch (error) {
          let errMessage = extractErrorMessage(error);
          if (errMessage) {
            setToastData({
              message: errMessage,
              type: "error",
            });
          }
        } finally {
          changeLoadingStatus(platform, false);
        }
      }
    },
    [setToastData]
  );

  const contactHandler = async (platform: IntegrationPlatformEnum) => {};

  useEffect(() => {
    let finalList: Aggregator[] = aggregatorList;
    for (let i = 0; i < aggregatorList.length; i++) {
      const agg = aggregatorList[i];
      const serverAggIndex = integrations.findIndex(
        (e) => e.platform.toString() === agg.platform.toString()
      );

      // Click handlers
      finalList[i].handleConnect = () => {
        connectHandler(agg.platform);
      };
      finalList[i].handleDisconnect = () => {
        disconnectHandler(agg.platform);
      };
      finalList[i].handleContactSupport = () => {
        contactHandler(agg.platform);
      };

      // Status check
      if (serverAggIndex >= 0 && integrations[serverAggIndex]) {
        finalList[i].connectionStatus =
          integrations[serverAggIndex].connectionStatus;
      }
    }
    setAggregators(finalList);
  }, [disconnectHandler, integrations]);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {aggregators.map((aggregator) => (
        <AggregatorCard key={aggregator.platform} aggregator={aggregator} />
      ))}
    </div>
  );
};

export default AggregatorList;
