import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { IntegrationConnectionStatusEnum } from "@/generated/graphql";
import {
  Aggregator,
  formatAggregatorConnection,
  formatAggregatorPlatform,
} from "@/utils/aggregators";
import Image from "next/image";
import React from "react";

const AggregatorCard: React.FC<{ aggregator: Aggregator }> = ({
  aggregator,
}) => {
  const name = formatAggregatorPlatform(aggregator.platform);
  const connection = formatAggregatorConnection(aggregator.connectionStatus);
  return (
    <div className="border p-4 rounded-lg bg-white shadow flex flex-col justify-center items-start">
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col justify-center items-start">
          <div className="w-12 h-12 relative mb-2 rounded-full">
            <Image
              src={aggregator.imageUrl}
              alt={name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        {aggregator.connectionStatus ===
        IntegrationConnectionStatusEnum.Connected ? (
          <CButton
            loading={aggregator.loading}
            disabled={aggregator.loading}
            variant={ButtonType.Outlined}
            onClick={() => {
              aggregator.handleDisconnect();
            }}
            className="py-0"
          >
            Disconnect
          </CButton>
        ) : null}
        {aggregator.connectionStatus ===
          IntegrationConnectionStatusEnum.NotConnected ||
        aggregator.connectionStatus ===
          IntegrationConnectionStatusEnum.Expired ? (
          <CButton
            variant={ButtonType.Outlined}
            onClick={() => {
              aggregator.handleConnect();
            }}
            className="py-0"
          >
            Connect
          </CButton>
        ) : null}
        {aggregator.connectionStatus ===
        IntegrationConnectionStatusEnum.Error ? (
          <CButton
            variant={ButtonType.Outlined}
            onClick={() => {
              aggregator.handleContactSupport();
            }}
            className="py-0"
          >
            Contact Support
          </CButton>
        ) : null}
      </div>
      <br />
      <div className="flex flex-col justify-start items-start">
        <p className="text-neutral-400 font-medium text-xs">
          Connection Status
        </p>
        <span className="text-black text-opacity-75 font-medium">
          {connection}
        </span>
      </div>
    </div>
  );
};

export default AggregatorCard;
