import useGlobalStore from "@/store/store";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useGlobalStore();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Restaurants", path: "/restaurant" },
  ];

  return (
    <div className="bg-gray-700 text-white h-full p-4 fixed top-16 left-0 w-64">
      <ul>
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path} legacyBehavior>
              <a
                className={`block hover:bg-gray-600 p-2 rounded ${
                  selectedMenu === item.name.toLowerCase() ? "bg-gray-600" : ""
                }`}
                onClick={() => setSelectedMenu(item.name.toLowerCase())}
              >
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
