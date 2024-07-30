import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
import { extractErrorMessage } from "@/utils/utilFUncs";
import RestaurantOnboardingStore from "@/store/restaurantOnboarding";
import { RestaurantStatus } from "@/generated/graphql";
import { Searchfeatures } from "@/utils/searchFeatures";
import { IoSearchSharp } from "react-icons/io5";

const Navbar: React.FC = () => {
  const { firstName } = useAuthStore();
  const { restaurants, selectedRestaurant } = useRestaurantsStore();
  const { reset } = RestaurantOnboardingStore();
  const { isSidebarExpanded, setisSidebarExpanded, setToastData } =
    useGlobalStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] =
    useState(false);
  const router = useRouter();
  const {
    setSelectedRestaurant,
    setRefreshRestaurantChange,
    refreshRestaurantChange,
  } = useRestaurantsStore();
  const toggleSidebar = () => {
    setisSidebarExpanded(!isSidebarExpanded);
  };

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const restaurantDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        restaurantDropdownRef.current &&
        !restaurantDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRestaurantDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setSelectedRestaurantFunc = async (restaurant: any) => {
    try {
      const res = await sdk.setRestaurantIdAsCookie({
        id: restaurant?._id,
      });
      if (res.setRestaurantIdAsCookie) {
        router.reload();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
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
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };
  const { setisShowTaxSettings } = useGlobalStore();

  const handleShowTaxRate = () => {
    setisShowTaxSettings(true);
  };
  const toggleRestaurantDropdown = () => {
    setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; link: string }[]
  >([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredSuggestions = Searchfeatures.filter((feature) =>
        feature.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleAddRestaurant = async () => {
    try {
      const res = await sdk.setRestaurantIdAsCookie({
        id: "",
      });
      if (res.setRestaurantIdAsCookie) {
        router.push("/onboarding-restaurant/restaurant-basic-information");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
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
            <div ref={restaurantDropdownRef} className="relative">
              <button
                onClick={toggleRestaurantDropdown}
                className="flex items-center space-x-2 hover:bg-primary hover:text-white px-2 py-2 rounded group"
              >
                <FaMapMarkerAlt className="h-4 w-4 text-black group-hover:text-white" />
                <span className="text-sm">{selectedRestaurant}</span>
              </button>
              {isRestaurantDropdownOpen && (
                <div className="bg-white absolute mt-2 w-64 rounded-md shadow-lg py-2 text-black z-50">
                  <div>
                    {restaurants.length > 0 ? (
                      restaurants.map((restaurant) => (
                        <div
                          onClick={() => setSelectedRestaurantFunc(restaurant)}
                          key={restaurant?.id}
                          className="block px-4 py-2 text-sm hover:bg-primary hover:text-white"
                        >
                          {restaurant?.name?.value}
                        </div>
                      ))
                    ) : (
                      <div
                        className="block px-4 py-2 text-sm hover:bg-primary hover:text-white"
                        onClick={() => handleAddRestaurant()}
                      >
                        <CButton variant={ButtonType.Primary}>
                          Add Restaurant
                        </CButton>
                      </div>
                    )}
                    <div
                      className="block px-4 cursor-pointer py-2 text-sm hover:bg-primary hover:text-white"
                      onClick={() => handleAddRestaurant()}
                    >
                      Add Restaurant
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div onClick={() => handleAddRestaurant()}>
              <CButton variant={ButtonType.Primary}>Add Restaurant</CButton>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 relative">
          <div className=" flex items-center">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="input input-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-200 mt-9 rounded-lg shadow-lg">
                {suggestions.map((suggestion) => (
                  <a key={suggestion.name} href="href={suggestion.link}">
                    <li
                      key={suggestion.name}
                      className="hover:bg-primary hover:text-white p-2"
                    >
                      <p>{suggestion.name}</p>
                    </li>
                  </a>
                ))}
              </ul>
            )}
          </div>
          <div ref={profileDropdownRef} className="relative">
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
                {/* <Link
                  href="/teams"
                  className="block px-4 py-2 text-sm text-black hover:text-white hover:bg-primary"
                >
                  My Teams
                </Link> */}
                <button
                  onClick={handleShowTaxRate}
                  className="block px-4 py-2 w-full text-left text-sm text-black hover:text-white hover:bg-primary"
                >
                  Tax Rate
                </button>
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
