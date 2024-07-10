import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaQuestionCircle,
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import useGlobalStore from "@/store/global";
import useAuthStore from "@/store/auth";
import { sdk } from "@/utils/graphqlClient";
import { useRouter } from "next/router";
import useRestaurantsStore from "@/store/restaurant";
import CButton from "../common/button/button";
import { ButtonType } from "../common/button/interface";

const Navbar: React.FC = () => {
  const { firstName } = useAuthStore();
  const { restaurants, selectedRestaurant } = useRestaurantsStore();
  const { isSidebarExpanded, setisSidebarExpanded } = useGlobalStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] =
    useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setisSidebarExpanded(!isSidebarExpanded);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await sdk.Logout();

      if (response && response.logout) {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleRestaurantDropdown = () => {
    setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
  };

  return (
    <nav
      className={`text-black p-4 bg-white fixed top-0 z-10 transition-all duration-300 ${
        isSidebarExpanded ? "left-64" : "left-20"
      }`}
      style={{
        width: `calc(100% - ${isSidebarExpanded ? "16rem" : "5rem"})`,
      }}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            onClick={toggleSidebar}
            className="text-black hover:text-primary flex items-center justify-center"
          >
            {isSidebarExpanded ? (
              <FaCompressArrowsAlt className="h-4 w-4 mr-1" />
            ) : (
              <FaExpandArrowsAlt className="h-4 w-4 mr-1" />
            )}
          </button>

          {restaurants.length > 0 ? (
            <div className="relative">
              <button
                onClick={toggleRestaurantDropdown}
                className="flex items-center space-x-2 hover:bg-primary hover:text-white px-2 py-2 rounded group"
              >
                <FaMapMarkerAlt className="h-4 w-4 text-black group-hover:text-white" />
                <span className="text-sm">{selectedRestaurant}</span>
              </button>
              {isRestaurantDropdownOpen && (
                <div className="bg-white absolute mt-2 w-64 rounded-md shadow-lg py-2 text-black z-50">
                  {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                      <div
                        key={restaurant?.id}
                        className="block px-4 py-2 text-sm hover:bg-primary hover:text-white"
                      >
                        {restaurant?.name?.value}
                      </div>
                    ))
                  ) : (
                    <Link
                      className="block px-4 py-2 text-sm hover:bg-primary hover:text-white"
                      href="/add-restaurant"
                    >
                      <CButton variant={ButtonType.Primary}>
                        Add Restaurant
                      </CButton>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link href="/add-restaurant">
              <CButton variant={ButtonType.Primary}>Add Restaurant</CButton>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-1 relative">
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group focus:outline-none"
            >
              <FaUser className="h-4 w-4 mr-1 text-black group-hover:text-white" />
              <span className="text-sm">{firstName}</span>
            </button>
            {isProfileDropdownOpen && (
              <div className="bg-white absolute right-0 mt-4 w-48 rounded-md shadow-lg py-1 text-black z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-black hover:text-white hover:bg-primary"
                >
                  My account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left text-sm text-black hover:text-white hover:bg-primary"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="border-r border-gray-400 h-6"></div>{" "}
          <Link
            href="/help"
            className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group"
          >
            <FaQuestionCircle className="h-4 w-4 mr-1 text-black group-hover:text-white" />
            <span className="text-sm">Help</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
