import NotFound from "@/components/common/notFound/notFound";
import MenuLayout from "@/components/layouts/MenuLayout";
import Categories from "@/components/modules/menu/category";
import Items from "@/components/modules/menu/items";
import Menu from "@/components/modules/menu/menu";

import { GetServerSideProps } from "next";

type MenuPageProps = {
  repo: {
    pagePath: string;
  };
};

const MenuPage = ({ repo: { pagePath } }: MenuPageProps) => {
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
      childComponent = <Items />;
      break;
    case "modifier":
      childComponent = <Items />;
      break;

    default:
      childComponent = <NotFound />;
      break;
  }

  return <MenuLayout>{childComponent}</MenuLayout>;
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
