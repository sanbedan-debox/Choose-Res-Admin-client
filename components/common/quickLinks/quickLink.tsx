// components/common/QuickActions.tsx
import {
  FaChartLine,
  FaUserFriends,
  FaUtensils,
  FaEdit,
  FaCheck,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const quickActions = [
  { name: "Sales summary", icon: <FaChartLine />, link: "/sales-summary" },
  { name: "Labor summary", icon: <FaUserFriends />, link: "/labor-summary" },
  { name: "Menu builder", icon: <FaUtensils />, link: "/menu-builder" },
  { name: "Edit menus", icon: <FaEdit />, link: "/edit-menus" },
  { name: "Refund check", icon: <FaCheck />, link: "/refund-check" },
  { name: "Employees", icon: <FaUsers />, link: "/employees" },
  { name: "Time entries", icon: <FaClock />, link: "/time-entries" },
];

const QuickActions = () => (
  <div className="bg-white shadow rounded-lg p-4">
    <h2 className="font-semibold mb-4">Quick Actions</h2>
    <ul className="space-y-2">
      {quickActions.map((action) => (
        <li key={action.name} className="hover:scale-105 transition-transform">
          <a
            href={action.link}
            className="flex items-center space-x-3 text-primary text-sm"
          >
            {action.icon}
            <span>{action.name}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default QuickActions;
