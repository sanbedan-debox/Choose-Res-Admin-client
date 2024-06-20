import BulkManagement from "@/components/modules/menu/bulkManagement";
import MenuManagement from "@/components/modules/menu/menuManagement";
import Settings from "@/components/modules/menu/settings";
import WasteManagement from "@/components/modules/menu/wasteManagement";
import { SectionContent } from "@/components/common/menuSection/interface";
import Catering from "@/components/modules/menu/cateringFoodManagement";
import Reports from "@/components/modules/menu/reports";




export const menuContents: SectionContent[] = [
    {
        id: "section1",
        title: "Menu management",
        Component: MenuManagement,
    },
    {
        id: "section2",
        title: "Bulk management",
        Component: BulkManagement,
    },
    {
        id: "section3",
        title: "Settings",
        Component: Settings,
    },
    {
        id: "section4",
        title: "Reports",
        Component: Reports,
    },
    {
        id: "section5",
        title: "Catering & Events management",
        Component: Catering,
    },
    {
        id: "section6",
        title: "Food waste management",
        Component: WasteManagement,
    },
];
