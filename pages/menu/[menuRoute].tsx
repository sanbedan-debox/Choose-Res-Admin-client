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
import useMenuStore from "@/store/menu";

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
  } = useMenuStore();

  const handleAddMenuItemClose = () => {
    setisAddItemModalOpen(false);
  };
  const handleAddMenuCategoryClose = () => {
    setisAddCategoryModalOpen(false);
  };
  const handleAddMenuClose = () => {
    setisAddMenuModalOpen(false);
  };

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("");
  const [applySalesTax, setApplySalesTax] = useState(false);
  const [popularItem, setPopularItem] = useState(false);
  const [upSellItem, setUpSellItem] = useState(false);
  const [availability, setAvailability] = useState([]);

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      name,
      desc,
      image,
      price,
      status,
      applySalesTax,
      popularItem,
      upSellItem,
      availability,
    });
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
      <ReusableModal
        width="xl"
        isOpen={isAddItemModalOpen}
        title="Items"
        onClose={handleAddMenuItemClose}
      >
        <div className="flex justify-center">
          <AddItemForm />
        </div>
      </ReusableModal>
      <ReusableModal
        width="xl"
        isOpen={isAddCategoryModalOpen}
        title="Category"
        onClose={handleAddMenuCategoryClose}
      >
        <div className="flex justify-center">
          <AddCategoryForm />
        </div>
      </ReusableModal>
      <ReusableModal
        width="xl"
        isOpen={isAddMenuModalOpen}
        title="Menu"
        onClose={handleAddMenuClose}
      >
        <div className="flex justify-center">
          <AddMenuForm />
        </div>
      </ReusableModal>
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
