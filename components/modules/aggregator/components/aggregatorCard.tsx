import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface Aggregator {
  id: string;
  name: string;
  imageUrl: StaticImageData;
  isConnected: boolean;
  subtitle?: string;
  description?: string;
  handleConnect: () => void;
}

interface AggregatorCardProps {
  aggregator: Aggregator;
  onConnect: (id: string) => void;
}

const AggregatorCard: React.FC<AggregatorCardProps> = ({
  aggregator,
  onConnect,
}) => {
  console.log("ajjbaeofh", aggregator.isConnected);
  return (
    <div className="border p-4 hover:bg-primary hover:bg-opacity-5 rounded-lg shadow-md flex flex-col justify-between h-full">
      <div className="h-36 flex items-center">
        <Image
          src={aggregator.imageUrl}
          alt={aggregator.name}
          className="w-full object-cover mb-4"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{aggregator.name}</h3>
        {aggregator.subtitle && (
          <p className="text-sm text-gray-500">{aggregator.subtitle}</p>
        )}
        {aggregator.description && (
          <p className="text-sm text-gray-700 mb-4">{aggregator.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        {aggregator.isConnected ? (
          <div className="text-green-500">
            <span>Connected</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        ) : (
          <CButton
            variant={ButtonType.Primary}
            onClick={() => onConnect(aggregator.id)}
            className="py-2 px-4"
          >
            Connect
          </CButton>
        )}
      </div>
    </div>
  );
};

export default AggregatorCard;
