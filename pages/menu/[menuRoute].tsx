import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import ReusableModal from "@/components/common/modal/modal";
import NotFound from "@/components/common/notFound/notFound";
import MenuLayout from "@/components/layouts/MenuLayout";
import Categories from "@/components/modules/menu/category";
import AddCategoryForm from "@/components/modules/menu/forms/addCategoryForm";
import AddItemForm from "@/components/modules/menu/forms/addItemForm";
import AddMenuForm from "@/components/modules/menu/forms/addMenuForm";
import Items from "@/components/modules/menu/items";
import Menu from "@/components/modules/menu/menu";
import ModifiersGroup from "@/components/modules/menu/modifierGroups";
import Modifiers from "@/components/modules/menu/modifiers";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuItemsStore from "@/store/menuItems";
import useMenuOptionsStore from "@/store/menuOptions";

import { GetServerSideProps } from "next";
import { useState } from "react";

type MenuPageProps = {
  repo: {
    pagePath: string;
  };
};

const MenuPage = ({ repo: { pagePath } }: MenuPageProps) => {
  const {
    isAddItemModalOpen,
    setisAddItemModalOpen,
    isAddCategoryModalOpen,
    isAddMenuModalOpen,
    setisAddCategoryModalOpen,
    setisAddMenuModalOpen,
    fetchMenuDatas,
    setfetchMenuDatas,
  } = useMenuOptionsStore();

  const { seteditCatsId, setisEditCats } = useMenuCategoryStore();
  const { setEditItemId, setisEditItem } = useMenuItemsStore();
  const handleAddMenuItemClose = () => {
    setisAddItemModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditItem(false);
    setEditItemId(null);
  };
  const handleAddMenuCategoryClose = () => {
    setisAddCategoryModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditCats(false);
    seteditCatsId(null);
  };
  const handleAddMenuClose = () => {
    setisAddMenuModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
  };

  const handleSubmit = () => {
    handleAddMenuItemClose();
  };

  let childComponent;

  switch (pagePath) {
    case "menu":
      childComponent = <Menu />;
      break;
    case "categories":
      childComponent = <Categories />;
      break;
    case "items":
      childComponent = <Items />;
      break;
    case "modifier-group":
      childComponent = <ModifiersGroup />;
      break;
    case "modifier":
      childComponent = <Modifiers />;
      break;

    default:
      childComponent = <NotFound />;
      break;
  }

  return (
    <>
      <MenuLayout>{childComponent}</MenuLayout>
      {/* <ReusableModal
        width="dxl"
        isOpen={isAddItemModalOpen}
        title="Items"
        hight="dxl"
        onClose={handleAddMenuItemClose}
      >
        <div className="flex justify-center">
          <AddItemForm />
        </div>
      </ReusableModal> */}
      <FullPageModal
        isOpen={isAddItemModalOpen}
        title="Items"
        onClose={handleAddMenuItemClose}
        actionButtonLabel="Save Item"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => console.log("hello")}
      >
        <div className="flex justify-center">
          <AddItemForm />
        </div>
      </FullPageModal>
      <FullPageModal
        isOpen={isAddCategoryModalOpen}
        title="Category"
        onClose={handleAddMenuCategoryClose}
        actionButtonLabel="Save Category"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => console.log("hello")}
      >
        <div className="flex justify-center">
          <AddCategoryForm />
        </div>
      </FullPageModal>

      <FullPageModal
        isOpen={isAddMenuModalOpen}
        title="Menu"
        onClose={handleAddMenuClose}
        actionButtonLabel="Save Menu"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => console.log("hello")}
      >
        <div className="flex justify-center">
          <AddMenuForm />
        </div>
      </FullPageModal>
    </>
  );
};

export default MenuPage;

export const getServerSideProps: GetServerSideProps<MenuPageProps> = async (
  context
) => {
  return {
    props: {
      repo: {
        pagePath: context.query["menuRoute"]?.toString() ?? "",
      },
    },
  };
};
