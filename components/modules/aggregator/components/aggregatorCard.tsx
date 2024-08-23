import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import React from "react";
import { Aggregator } from "../interface/interface";

interface AggregatorCardProps {
  aggregator: Aggregator;
  onConnect: (id: string) => void;
}

const AggregatorCard: React.FC<AggregatorCardProps> = ({
  aggregator,
  onConnect,
}) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img
        src={aggregator.imageUrl}
        alt={aggregator.name}
        className="w-16 h-16 object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{aggregator.name}</h3>
      <div className="border-b-2"></div>
      <div className="flex items-center mt-2">
        {aggregator.isConnected ? (
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">Connected</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <p className="text-xs">
              Do you want to manage Menu.Then{" "}
              <span className="text-primary cursor-pointer">Click here</span>
            </p>
          </div>
        ) : (
          <CButton
            variant={ButtonType.Primary}
            onClick={() => onConnect(aggregator.id)}
            className="py-0"
          >
            Connect
          </CButton>
        )}
      </div>
    </div>
  );
};

export default AggregatorCard;
