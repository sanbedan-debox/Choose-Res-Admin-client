import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";

const MenuManagement: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    {
<<<<<<< HEAD
      title: "View Menus",
      caption: "Add or Edit categories for your menu in few easy steps. ",
      link: "/menu/menu-editor",
=======
      title: "Add or Edit Menu",
      caption:
        "Add or Edit your menu for your restaurant in just few easy steps ",
      link: "/menu/menu-section",
>>>>>>> 222775c5915c3a1676e2ec1390902c291ebbacca
    },
    {
      title: "Upload Menu",
      caption: "Add or Edit categories for your menu in few easy steps. ",
      link: "/menu/menu-editor",
    },
    {
      title: "Bulk Edit",
      caption: "Add or Edit categories for your menu in few easy steps. ",
      link: "/menu/menu-editor",
    },
    {
      title: "Export Menu",
      caption: "Add or Edit categories for your menu in few easy steps. ",
      link: "/menu/menu-editor",
    },
    // {
    //   title: "Edit menus",
    //   caption:
    //     "Original menu editing pages that contain all advanced menu features.",
    //   link: "/edit-menus",
    // },
    // {
    //   title: "Menu builder",
    //   caption:
    //     "Our newest tool for creating and managing menus with improved workflows and streamlined settings.",
    //   link: "/menu-builder",
    // },
    // {
    //   title: "Edit menus",
    //   caption:
    //     "Original menu editing pages that contain all advanced menu features.",
    //   link: "/edit-menus",
    // },
  ];

  const handleMenuItemClick = (link: string) => {
    router.push(link);
  };

  return (
    <div className="p-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleMenuItemClick(item.link)}
          className="flex justify-between items-center p-4 mb-4 border rounded-lg hover:bg-primary hover:bg-opacity-10 transition duration-200 transform hover:scale-105 cursor-pointer"
        >
          <div>
            <h3 className="text-md font-semibold mb-1">{item.title}</h3>
            <p className="text-sm">{item.caption}</p>
          </div>
          <FaArrowRight className="text-gray-500 group-hover:text-primary" />
        </div>
      ))}
      {/* <a href="#" className="text-blue-500 mt-4 block">
        Compare menu tools
      </a> */}
    </div>
  );
};

export default MenuManagement;
