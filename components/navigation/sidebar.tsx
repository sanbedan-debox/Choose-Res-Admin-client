import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import logo1 from "../../assets/logo/logoDark.png";
import {
  FaHome,
  FaCog,
  FaChartBar,
  FaListUl,
  FaUsers,
  FaTable,
} from "react-icons/fa";
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
      className={`h-screen flex flex-col text-black bg-sidebar transition-all duration-300 ${
        isSidebarExpanded ? "w-64" : "w-20"
      } overflow-y-auto scrollbar-hide`}
    >
      <div
        className={`flex flex-col items-center mb-10 ${
          isSidebarExpanded ? "" : "my-4"
        } `}
      >
        {isSidebarExpanded && (
          <div className="relative z-10 flex items-center justify-center my-4">
            <Link href="/dashboard">
              <Image
                className="mb-4 cursor-pointer"
                src={logo1}
                alt="Logo"
                width={150}
              />
            </Link>
          </div>
        )}
        <hr className="border-gray-600 " />
        <ul className="mx-1">
          {modules.map((module) =>
            hasAccess(module.roles) ? (
              <li
                key={module.name}
                className={`cursor-pointer mb-1 transition-colors ${
                  router.pathname === module.route
                    ? "bg-gray-700  rounded-lg"
                    : ""
                }`}
              >
                <Link legacyBehavior href={module.route}>
                  <div
                    onClick={() => setSelectedMenu(module.name)}
                    className={`flex items-center p-2 rounded-lg text-black group ${
                      router.pathname === module.route ||
                      selectedMenu === module.name
                        ? "bg-primary text-white"
                        : ""
                    } hover:bg-primary hover:text-white`}
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
