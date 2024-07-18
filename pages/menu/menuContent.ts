import { SectionContent } from "@/components/common/menuSection/interface";
import MenuManagement from "@/components/modules/menu/menuContent/menuBuilder";

export const menuContents: SectionContent[] = [
  {
    id: "section1",
    title: "Menu management",
    Component: MenuManagement,
  },
  //   {
  //     id: "section2",
  //     title: "Bulk management",
  //     Component: BulkManagement,
  //   },
  //   {
  //     id: "section3",
  //     title: "Settings",
  //     Component: Settings,
  //   },
  //   {
  //     id: "section4",
  //     title: "Reports",
  //     Component: Reports,
  //   },
  //   {
  //     id: "section5",
  //     title: "Catering & Events management",
  //     Component: Catering,
  //   },
  //   {
  //     id: "section6",
  //     title: "Food waste management",
  //     Component: WasteManagement,
  //   },
];
