// import { create } from "zustand";
// type ToastData = {
//   message: string;
//   type: "success" | "error" | "warning";
//   title?: string; // Make title property optional
// };
// type MenuState = {
//   selectedMenu: string;
//   setSelectedMenu: (menu: string) => void;
//   toastData: ToastData | null;
//   setToastData: (data: ToastData | null) => void;
// };

// const useGlobalStore = create<MenuState>((set) => ({
//   selectedMenu: "dashboard",
//   setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),
//   toastData: null,
//   setToastData: (data: ToastData | null) => set({ toastData: data }),
// }));

// export default useGlobalStore;

import { create } from "zustand";

type ToastData = {
  message: string;
  type: "success" | "error" | "warning";
  title?: string; // Make title property optional
};

type MenuState = {
  selectedMenu: string;
  isSidebarExpanded: boolean;
  setSelectedMenu: (menu: string) => void;
  toastData: ToastData | null;
  setToastData: (data: ToastData | null) => void;
  setisSidebarExpanded: (isExpanded: boolean) => void;
};

const useGlobalStore = create<MenuState>((set) => ({
  selectedMenu: "dashboard", // Default selected menu
  isSidebarExpanded: true, // Default to expanded
  setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),
  toastData: null, // Default toast data
  setToastData: (data: ToastData | null) => set({ toastData: data }),
  setisSidebarExpanded: (isExpanded: boolean) =>
    set({ isSidebarExpanded: isExpanded }),
}));

export default useGlobalStore;
