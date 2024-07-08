

import { create } from "zustand";

type ToastData = {
  message: string;
  type: "success" | "error" | "warning";
  title?: string; // Make title property optional
};

type MenuState = {
  selectedMenu: string;
  isSidebarExpanded: boolean;
  isShowSetupPanel: boolean;
  setSelectedMenu: (menu: string) => void;
  toastData: ToastData | null;
  setToastData: (data: ToastData | null) => void;
  setisSidebarExpanded: (isExpanded: boolean) => void;
  setisShowSetupPanel: (e: boolean) => void;
};

const useGlobalStore = create<MenuState>((set) => ({
  selectedMenu: "dashboard", // Default selected menu
  isSidebarExpanded: true, // Default to expanded
  isShowSetupPanel: true, // Default to expanded
  setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),
  toastData: null, // Default toast data
  setToastData: (data: ToastData | null) => set({ toastData: data }),
  setisSidebarExpanded: (isExpanded: boolean) =>
    set({ isSidebarExpanded: isExpanded }),
  setisShowSetupPanel: (e: boolean) =>
    set({ isShowSetupPanel: e }),
}));

export default useGlobalStore;
