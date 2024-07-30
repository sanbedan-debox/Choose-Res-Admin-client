import ArrowCard from "@/components/common/arrowCard/arrowCard";
import React from "react";

const MenuManagement: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4">
      <ArrowCard
        title="Menu builder"
        caption="Create or Edit your menu manually"
        href="/menu/menu-builder/menu"
      />
      <ArrowCard
        title="Have Clover?"
        caption="Pull your menu from Clover!"
        href="/menu/menu-builder/menu"
      />
      <ArrowCard
        title="Compare menu tools"
        caption=""
        href="/menu/menu-builder/menu"
      />
    </div>
  );
};

export default MenuManagement;
