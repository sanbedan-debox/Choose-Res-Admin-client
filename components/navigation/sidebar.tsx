import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/store";
import {
  FaHome,
  FaCogs,
  FaChartBar,
  FaClipboardList,
  FaUsers,
  FaTable,
} from "react-icons/fa"; // Example icons from react-icons
import { modules } from "./common/accessConfog";

const Sidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  const toggleDropdown = (moduleName: string) => {
    setOpenDropdown((prev) => (prev === moduleName ? null : moduleName));
  };

  const toggleSidebar = () => {
    setisSidebarExpanded(!isSidebarExpanded);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      dashboard: <FaHome />,
      menu: <FaCogs />,
      aggregator: <FaChartBar />,
      cms: <FaClipboardList />,
      marketing: <FaChartBar />,
      reports: <FaChartBar />,
      customers: <FaUsers />,
      rewards: <FaCogs />,
      user: <FaUsers />,
      inventory: <FaTable />,
      operations: <FaCogs />,
      marketinginsights: <FaChartBar />,
      tips: <FaClipboardList />,
      staff: <FaUsers />,
      payment: <FaCogs />,
      table: <FaTable />,
      banquet: <FaCogs />,
      catering: <FaCogs />,
    };
    return icons[iconName] || <FaHome />; // Default to FaHome if icon is not found
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
      }`}
    >
      <div className="flex flex-col items-center">
        {/* User Info */}
        <div
          className={`flex items-center ${
            isSidebarExpanded ? "justify-between py-4" : "justify-center py-6"
          } w-full px-4 bg-gray-800`}
        >
          {isSidebarExpanded && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-lg font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2">{userName}</span>
            </div>
          )}
          <button
            type="button"
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarExpanded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Divider */}
        <hr className="border-gray-600 my-2" />
        {/* Navigation List */}
        <ul className="mx-1">
          {modules.map((module) =>
            hasAccess(module.roles) ? (
              <li
                key={module.name}
                className={`cursor-pointer mb-1 ${
                  router.pathname === module.route ? "bg-gray-700" : ""
                }`}
              >
                <Link legacyBehavior href={module.route}>
                  <div
                    onClick={() => setSelectedMenu(module.name)}
                    className={`flex items-center p-2 rounded-lg text-white group ${
                      router.pathname === module.route ? "bg-gray-700" : ""
                    }`}
                  >
                    {getIconComponent(module.icon)}
                    {isSidebarExpanded && (
                      <span className="ml-3">{module.name}</span>
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
