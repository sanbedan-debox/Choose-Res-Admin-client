import Link from "next/link";
import useGlobalStore from "@/store/store";

const Navbar: React.FC = () => {
  const toggleSidebar = () => {
    setisSidebarExpanded(!isSidebarExpanded);
  };
  const { isSidebarExpanded, setisSidebarExpanded } = useGlobalStore();

  return (
    <nav
      className={`bg-gray-800 text-white p-4 fixed top-0 z-10 transition-all duration-300  w-[100%]`}
      // style={{ width: `calc(100% - ${isSidebarExpanded ? "16rem" : "5rem"})` }}
    >
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
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
          <Link href="/dashboard">
            <div className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</div>
          </Link>
          <Link href="/restaurant">
            <div className="hover:bg-gray-700 px-3 py-2 rounded">
              Restaurants
            </div>
          </Link>
        </div>
        <div>hello</div>
      </div>
    </nav>
  );
};

export default Navbar;
