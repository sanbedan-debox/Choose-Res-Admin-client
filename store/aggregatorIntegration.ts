import { create } from "zustand";

type AggregatorIntegrationState = {
    isComingFromAggregatorPage: boolean;
    setIsComingFromAggregatorPage: (open: boolean) => void;

};

const useAggregatorIntegrationStore = create<AggregatorIntegrationState>((set) => ({
    isComingFromAggregatorPage: false,
    setIsComingFromAggregatorPage: (open: boolean) =>
        set({ isComingFromAggregatorPage: open }),

}));

export default useAggregatorIntegrationStore;
