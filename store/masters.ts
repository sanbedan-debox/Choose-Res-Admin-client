import { create } from "zustand";

type MasterStates = {
  statesOptions: any[];
  setMasterStates: (res: any) => void;
  timezonesOptions: any[];
  setMasterTimezones: (res: any) => void;
};

const useMasterStore = create<MasterStates>((set) => ({
  statesOptions: [],
  setMasterStates: (res) => set({ statesOptions: res }),
  timezonesOptions: [],
  setMasterTimezones: (res) => set({ timezonesOptions: res }),
}));

export default useMasterStore;
