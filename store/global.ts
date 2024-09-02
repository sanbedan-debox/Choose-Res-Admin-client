

import { create } from "zustand";

type ToastData = {
  message: string;
  type: "success" | "error" | "warning";
  title?: string;
};

type MenuState = {
  isShowTaxSettings: boolean;
  setIsShowTaxSettings: (isExpanded: boolean) => void;

  selectedMenu: string;
  isSidebarExpanded: boolean;
  isShowSetupPanel: boolean;
  isVerificationToRestaurantAdd: boolean;
  setSelectedMenu: (menu: string) => void;
  toastData: ToastData | null;
  setToastData: (data: ToastData | null) => void;
  setIsSidebarExpanded: (isExpanded: boolean) => void;
  setIsShowSetupPanel: (e: boolean) => void;
  setisVerificationToRestaurantAdd: (e: boolean) => void;
};

const useGlobalStore = create<MenuState>((set) => ({
  isShowTaxSettings: false,
  setIsShowTaxSettings: (show: boolean) =>
    set({ isShowTaxSettings: show }),

  selectedMenu: "dashboard",
  isSidebarExpanded: true,
  isShowSetupPanel: true,
  isVerificationToRestaurantAdd: false,
  setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),
  toastData: null, // Default toast data
  setToastData: (data: ToastData | null) => set({ toastData: data }),
  setIsSidebarExpanded: (isExpanded: boolean) =>
    set({ isSidebarExpanded: isExpanded }),
  setIsShowSetupPanel: (e: boolean) =>
    set({ isShowSetupPanel: e }),
  setisVerificationToRestaurantAdd: (e: boolean) =>
    set({ isVerificationToRestaurantAdd: e }),
}));

export default useGlobalStore;
