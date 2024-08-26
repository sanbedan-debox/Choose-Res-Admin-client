import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { IoChevronBackOutline } from "react-icons/io5";
import MainLayout from "./mainBodyLayout";

type Props = {
  children: ReactNode;
};

const MenuLayout = ({ children }: Props) => {
  const router = useRouter();
  const { query } = router;
  const { menuRoute } = query;

  const items = [
    { label: "Menus", route: "menu" },
    { label: "Categories", route: "categories" },
    { label: "Sub-Categories", route: "sub-categories" },
    { label: "Items", route: "items" },
    { label: "Modifier Groups", route: "modifier-group" },
    // { label: "Modifiers", route: "modifier" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-2">
        <span
          className="text-sm flex items-center hover:underline text-primary cursor-pointer"
          onClick={() => {
            router.push("/menu");
          }}
        >
          <IoChevronBackOutline />
          Menu Builder
        </span>

        <div className="flex space-x-2 border-b">
          {items.map((item, index) => (
            <button
              key={index}
              className={`pb-2 px-2 text-sm ${
                item.route === menuRoute
                  ? "border-b-2 border-primary text-primary"
                  : "text-black"
              }`}
              onClick={() => router.push(item.route)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default MenuLayout;
