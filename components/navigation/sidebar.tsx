import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/store";
import logo1 from "../../assets/logo/logoWhite.png";
import {
  FaHome,
  FaCog,
  FaChartBar,
  FaListUl,
  FaUsers,
  FaTable,
} from "react-icons/fa"; // Updated icons
import Image from "next/image";
import { modules } from "./common/accessConfig";

const Sidebar: React.FC = () => {
  const {
    isSidebarExpanded,
    setisSidebarExpanded,
    selectedMenu,
    setSelectedMenu,
  } = useGlobalStore();
  const router = useRouter();

  const userRole = "admin";
  const userName = "Roop";
  const hasAccess = (moduleRoles: string[]) => moduleRoles.includes(userRole);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      dashboard: <FaHome />,
      menu: <FaCog />,
      aggregator: <FaChartBar />,
      cms: <FaListUl />,
      marketing: <FaChartBar />,
      reports: <FaChartBar />,
      customers: <FaUsers />,
      rewards: <FaCog />,
      user: <FaUsers />,
      inventory: <FaTable />,
      operations: <FaCog />,
      marketinginsights: <FaChartBar />,
      tips: <FaListUl />,
      staff: <FaUsers />,
      payment: <FaCog />,
      table: <FaTable />,
      banquet: <FaCog />,
      catering: <FaCog />,
    };
    return icons[iconName] || <FaHome />;
  };

  return (
    <div
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
      className={`h-screen flex flex-col text-white transition-all duration-300 ${
        isSidebarExpanded ? "w-64" : "w-20"
      } overflow-y-auto scrollbar-hide`}
    >
      <div className="flex flex-col items-center mb-10">
        <div
          style={{
            background: "rgb(4,7,29)",
            backgroundColor:
              "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
          }}
          className={`flex items-center ${
            isSidebarExpanded ? "justify-between py-4" : "justify-center py-6"
          } w-full px-4 `}
        >
          {isSidebarExpanded && (
            <div className="relative z-10 flex items-center gap-16 justify-center">
              <Image className="mb-4" src={logo1} alt="Logo" width={200} />
            </div>
          )}
        </div>
        <hr className="border-gray-600 " />
        <ul className="mx-1">
          {modules.map((module) =>
            hasAccess(module.roles) ? (
              <li
                key={module.name}
                className={`cursor-pointer mb-1 transition-colors ${
                  router.pathname === module.route
                    ? "bg-gray-700 rounded-lg"
                    : ""
                }`}
              >
                <Link legacyBehavior href={module.route}>
                  <div
                    onClick={() => setSelectedMenu(module.name)}
                    className={`flex items-center p-2 rounded-lg text-white group ${
                      router.pathname === module.route ||
                      selectedMenu === module.name
                        ? "bg-gray-700"
                        : ""
                    } hover:bg-gray-700`}
                  >
                    {getIconComponent(module.icon)}
                    {isSidebarExpanded && (
                      <span className="ml-3 text-sm">{module.name}</span>
                    )}
                  </div>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
