import Link from "next/link";
import {
  FaStore,
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";
import useGlobalStore from "@/store/global";

const Navbar: React.FC = () => {
  const User = "Roop37";
  const { isSidebarExpanded, setisSidebarExpanded } = useGlobalStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] =
    useState(false);

  const toggleSidebar = () => {
    setisSidebarExpanded(!isSidebarExpanded);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleRestaurantDropdown = () => {
    setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
  };

  const restaurants: any[] = [
    { name: "Rasoi Indian Cuisine", id: 1 },
    { name: "Spice Hub", id: 2 },
  ];

  return (
    <nav
      className={` text-black p-4 fixed top-0 z-10 transition-all duration-300 ${
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
          <div className="relative">
            <button
              onClick={toggleRestaurantDropdown}
              className="flex items-center space-x-2  hover:bg-primary hover:text-white px-2 py-2 rounded group"
            >
              <FaMapMarkerAlt className="h-4 w-4 text-black group-hover:text-white" />
              <span className="text-sm">Rasoi Indian Cuisine</span>
            </button>
            {isRestaurantDropdownOpen && (
              <div
                style={{
                  background: "rgb(4,7,29)",
                  backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                }}
                className="absolute mt-2 w-64 rounded-md shadow-lg py-2  text-white z-50"
              >
                {restaurants.length > 1 ? (
                  restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="block px-4 py-2 text-sm hover:bg-primary"
                    >
                      {restaurant.name}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background: "rgb(4,7,29)",
                      backgroundColor:
                        "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                    className="block px-4 py-2 text-sm text-center text-white"
                  >
                    Expecting access to more locations?
                    <Link
                      href="/contact-support"
                      className="block text-primary mt-2"
                    >
                      Contact customer support for assistance
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 relative">
          <Link
            href="/shop"
            className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group"
          >
            <FaStore className="h-4 w-4 mr-1 text-black group-hover:text-white" />
            <span className="text-sm">Shop</span>
          </Link>
          <Link
            href="/unpublished-changes"
            className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group"
          >
            <FaBell className="h-4 w-4 mr-1 text-black group-hover:text-white" />
            <span className="text-sm">Unpublished changes</span>
          </Link>
          <Link
            href="/search"
            className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group"
          >
            <FaSearch className="h-4 w-4 mr-1 text-black group-hover:text-white" />
            <span className="text-sm">Search</span>
          </Link>
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group focus:outline-none"
            >
              <FaUser className="h-4 w-4 mr-1 text-black group-hover:text-white" />
              <span className="text-sm">{User}</span>
            </button>
            {isProfileDropdownOpen && (
              <div
                style={{
                  background: "rgb(4,7,29)",
                  backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                }}
                className="absolute right-0 mt-4 w-48  rounded-md shadow-lg py-1 text-gray-700 z-50"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-primary"
                >
                  My account
                </Link>
                <Link
                  href="/toast-community"
                  className="block px-4 py-2 text-sm text-white hover:bg-primary"
                >
                  Choose Community
                </Link>
                <Link
                  href="/referral-program"
                  className="block px-4 py-2 text-sm text-white hover:bg-primary"
                >
                  Referral Program
                </Link>
                <Link
                  href="/share-your-screen"
                  className="block px-4 py-2 text-sm text-white hover:bg-primary"
                >
                  Share your screen
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-white hover:bg-primary"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
          <div className="border-r border-gray-400 h-6"></div>{" "}
          <Link
            href="/setup"
            className="hover:bg-primary hover:text-white px-3 py-2 rounded flex items-center group"
          >
            <FaCog className="h-4 w-4 mr-1 text-black group-hover:text-white" />
            <span className="text-sm">Setup</span>
          </Link>
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
