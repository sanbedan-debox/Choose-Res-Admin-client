import { create } from "zustand";

type MenuPageStore = {

    isShowUploadCSV: boolean;
    setisShowUploadCSV: (open: boolean) => void;
    isShowCloverModal: boolean;
    setIsShowCloverModal: (open: boolean) => void;
};

const useMenuPageStore = create<MenuPageStore>((set) => ({

    isShowUploadCSV: false,
    setisShowUploadCSV: (open: boolean) => set({ isShowUploadCSV: open }),
    isShowCloverModal: false,
    setIsShowCloverModal: (open: boolean) => set({ isShowCloverModal: open }),


}));

export default useMenuPageStore;
