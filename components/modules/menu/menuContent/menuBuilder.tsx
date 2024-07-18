import Link from "next/link";
import React from "react";

const MenuManagement: React.FC = () => {
  return (
    <div className="">
      <h3 className="text-xl font-semibold mb-2">
        Menu builder <span className="text-primary">NEW</span>
      </h3>
      <p>
        Our newest tool for creating and managing menus with improved workflows
        and streamlined settings.Manually Select and create your Menus{" "}
        <Link href="/menu/menu-builder/menu" className="text-primary">
          Click here to build or manage your menu
        </Link>
      </p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Have Clover?</h3>
      <p>
        Pull Your menu from Clover!
        <Link href="/menu/menu-builder/menu" className="text-primary">
          Click here to fetch menus from clover
        </Link>
      </p>
      <Link href="/menu/menu-builder/menu" className="text-primary mt-4 block">
        Compare menu tools
      </Link>
    </div>
  );
};

export default MenuManagement;
