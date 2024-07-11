import ReusableModal from "@/components/common/modal/modal";
import NotFound from "@/components/common/notFound/notFound";
import MenuLayout from "@/components/layouts/MenuLayout";
import Categories from "@/components/modules/menu/category";
import Items from "@/components/modules/menu/items";
import Menu from "@/components/modules/menu/menu";
import ModifiersGroup from "@/components/modules/menu/modifierGroups";
import Modifiers from "@/components/modules/menu/modifiers";
import useMenuStore from "@/store/menu";

import { GetServerSideProps } from "next";

type MenuPageProps = {
  repo: {
    pagePath: string;
  };
};

const MenuPage = ({ repo: { pagePath } }: MenuPageProps) => {
  const { isAddItemModalOpen, setisAddItemModalOpen } = useMenuStore();

  const handleAddMenuItemClose = () => {
    setisAddItemModalOpen(false);
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
        isOpen={isAddItemModalOpen}
        title="Add Menu Item"
        onClose={handleAddMenuItemClose}
      >
        HEllo add menu
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
