import { StaticImageData } from "next/image";

interface Aggregator {
    id: string;
    name: string;
    imageUrl: StaticImageData;
    isConnected: boolean;
    subtitle?: string;
    description?: string;
    handleConnect: () => void;
}
