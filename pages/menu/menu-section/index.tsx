import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { MdAddCircleOutline, MdEdit, MdDelete } from "react-icons/md";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const dummyMenus = [
  {
    _id: "1",
    type: "Restaurant",
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      businessName: "John's Diner",
    },
    name: {
      value: "Breakfast Menu",
    },
    categories: [
      {
        name: {
          value: "Main Course",
        },
      },
    ],
    visibility: {
      name: {
        value: "Public",
      },
      status: "Active",
    },
    createdAt: "2023-07-08",
    updatedAt: "2023-07-08",
    status: "Active",
  },
  {
    _id: "2",
    type: "Cafe",
    user: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "0987654321",
      businessName: "Jane's Cafe",
    },
    name: {
      value: "Lunch Menu",
    },
    categories: [
      {
        name: {
          value: "Beverages",
        },
      },
    ],
    visibility: {
      name: {
        value: "Private",
      },
      status: "Inactive",
    },
    createdAt: "2023-06-15",
    updatedAt: "2023-07-01",
    status: "Inactive",
  },
];

const MenuSection: NextPageWithLayout = () => {
  const router = useRouter();
  const [menus, setMenus] = useState(dummyMenus);

  const handleMenuClick = (menuId: string) => {
    router.push(`/menu/${menuId}`);
  };

  return (
    <div className=" bg-primary-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Menus</h1>
        <button className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-white hover:text-primary">
          <MdAddCircleOutline className="mr-2" />
          Create Menu
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="bg-white p-6 rounded-lg shadow cursor-pointer relative"
            onClick={() => handleMenuClick(menu._id)}
          >
            <div className="absolute top-4 right-4 flex space-x-2">
              <MdEdit className="text-primary cursor-pointer hover:text-primary-dark" />
              <MdDelete className="text-red-500 cursor-pointer hover:text-red-700" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-primary">
              {menu.name.value}
            </h2>
            <p className="text-gray-700 mb-1">Type: {menu.type}</p>
            <p className="text-gray-700 mb-1">
              Created by: {menu.user.firstName} {menu.user.lastName}
            </p>
            <p className="text-gray-700 mb-1">
              Visibility: {menu.visibility.name.value}
            </p>
            <p className="text-gray-700 mb-1">Status: {menu.status}</p>
            <p className="text-gray-700">Created At: {menu.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

MenuSection.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default MenuSection;
