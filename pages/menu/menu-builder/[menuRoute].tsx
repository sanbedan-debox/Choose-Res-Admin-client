import FullPageModal from "@/components/common/modal/fullPageModal";
import NotFound from "@/components/common/notFound/notFound";
import MenuLayout from "@/components/layouts/menuNextedLayout";
import Categories from "@/components/modules/menu/category";
import AddCategoryForm from "@/components/modules/menu/forms/addCategoryForm";
import AddItemForm from "@/components/modules/menu/forms/addItemForm";
import AddMenuForm from "@/components/modules/menu/forms/addMenuForm";
import AddModifierGroupForm from "@/components/modules/menu/forms/addModifierGroupForm";
import AddModifierForm from "@/components/modules/menu/forms/addModifiersForm";
import AddSubCategoryForm from "@/components/modules/menu/forms/addSubCategoryForm";
import Items from "@/components/modules/menu/items";
import Menu from "@/components/modules/menu/menu";
import ModifiersGroup from "@/components/modules/menu/modifierGroups";
import Modifiers from "@/components/modules/menu/modifiers";
import SubCategories from "@/components/modules/menu/subCategories";
import { PermissionTypeEnum, UserStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuItemsStore from "@/store/menuItems";
import useMenuMenuStore from "@/store/menumenu";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import useModStore from "@/store/modifiers";
import useSubCategoryStore from "@/store/subCategoryStore";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { redirectPathFromStatus } from "@/utils/redirectPathFromStatus";

import { GetServerSideProps } from "next";
import { useEffect } from "react";

type UserRepo = {
  pagePath: string;
  _id: string;
  firstName: string;
  status: string;
};
const MenuPage = ({ repo }: { repo?: UserRepo }) => {
  const {
    isAddItemModalOpen,
    setIsAddItemModalOpen,
    isAddCategoryModalOpen,
    isAddMenuModalOpen,
    setIsAddCategoryModalOpen,
    setIsAddMenuModalOpen,
    refreshMenuBuilderData,
    setRefreshMenuBuilderData,
    isAddModifierGroupModalOpen,
    setIsAddModifierGroupModalOpen,
    isAddModifierModalOpen,
    setIsAddModifierModalOpen,
    isAddSubCategoryModalOpen,
    setisAddSubCategoryModalOpen,
  } = useMenuOptionsStore();
  const { setEditModGroupId, setIsEditModGroup, setisDuplicateModifierGroup } =
    useModGroupStore();
  const { setEditSubCategoryId, setIsEditSubCategory } = useSubCategoryStore();

  const { setEditCatsId, setIsEditCats, setIsDuplicateCats } =
    useMenuCategoryStore();
  const { setEditModId, setIsEditMod, setisDuplicateMods } = useModStore();
  const { setEditMenuId, setisEditMenu, setIsDuplicateMenu } =
    useMenuMenuStore();

  const { setEditItemId, setIsEditItem, setIsDuplicateItem } =
    useMenuItemsStore();
  const handleAddMenuItemClose = () => {
    setIsAddItemModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setIsEditItem(false);
    setEditItemId(null);
    setIsDuplicateItem(false);
  };
  const handleAddSubCategoryModalclose = () => {
    setisAddSubCategoryModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setIsEditSubCategory(false);
    setEditSubCategoryId(null);
  };
  const handleAddMenuCategoryClose = () => {
    setIsAddCategoryModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setIsEditCats(false);
    setEditCatsId(null);
    setIsDuplicateCats(false);
  };
  const handleAddMenuClose = () => {
    setIsAddMenuModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setisEditMenu(false);
    setIsDuplicateMenu(false);
    setEditMenuId(null);
  };
  const handleAddModifierGroupClose = () => {
    setIsAddModifierGroupModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setIsEditModGroup(false);
    setisDuplicateModifierGroup(false);
    setEditModGroupId(null);
  };
  const handleAddModifierClose = () => {
    setIsAddModifierModalOpen(false);
    setRefreshMenuBuilderData(!refreshMenuBuilderData);
    setIsEditMod(false);
    setisDuplicateMods(false);
    setEditModId(null);
  };

  const { setSelectedMenu, setToastData } = useGlobalStore();

  useEffect(() => {
    setSelectedMenu("Menu Management");
  }, [setSelectedMenu]);

  let childComponent;

  switch (repo?.pagePath) {
    case "menu":
      childComponent = <Menu />;
      break;
    case "categories":
      childComponent = <Categories />;
      break;
    case "sub-categories":
      childComponent = <SubCategories />;
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

  const {
    maxSelectionsCount,
    minSelectionsCount,
    modifiersLength,
    isEditModGroup,
  } = useModGroupStore();

  return (
    <>
      <MenuLayout>{childComponent}</MenuLayout>

      <FullPageModal
        isOpen={isAddItemModalOpen}
        title="Items"
        onClose={handleAddMenuItemClose}
        actionButtonLabel="Save Item"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddItemForm />
        </div>
      </FullPageModal>
      <FullPageModal
        isOpen={isAddSubCategoryModalOpen}
        title="Sub Category"
        onClose={handleAddSubCategoryModalclose}
        actionButtonLabel="Save SubCategory"
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddSubCategoryForm />
        </div>
      </FullPageModal>
      <FullPageModal
        isOpen={isAddCategoryModalOpen}
        title="Category"
        onClose={handleAddMenuCategoryClose}
        actionButtonLabel="Save Category"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddCategoryForm />
        </div>
      </FullPageModal>

      {/*ADD  MENU*/}
      <FullPageModal
        isOpen={isAddMenuModalOpen}
        title="Menu"
        onClose={handleAddMenuClose}
        actionButtonLabel="Save Menu"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddMenuForm />
        </div>
      </FullPageModal>

      {/*ADD MODIFIERS GROUP */}
      <FullPageModal
        isOpen={isAddModifierGroupModalOpen}
        title="Modifiers Group"
        // onClose={handleAddModifierGroupClose}
        onClose={() => {
          if (isEditModGroup) {
            if (modifiersLength <= 0) {
              setToastData({
                type: "error",
                message: "You need to add atleast modifiers",
              });
            } else if (modifiersLength < minSelectionsCount) {
              setToastData({
                type: "error",
                message:
                  "Make sure number of modifiers is equal or greater than the selected Minimum selections",
              });
            } else {
              setIsAddModifierGroupModalOpen(false);
              setRefreshMenuBuilderData(!refreshMenuBuilderData);
              setIsEditModGroup(false);
              setisDuplicateModifierGroup(false);
              setEditModGroupId(null);
            }
          } else {
            setIsAddModifierGroupModalOpen(false);
            setRefreshMenuBuilderData(!refreshMenuBuilderData);
            setIsEditModGroup(false);
            setisDuplicateModifierGroup(false);
            setEditModGroupId(null);
          }
        }}
        actionButtonLabel="Save Modifier Group"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddModifierGroupForm />
        </div>
      </FullPageModal>

      {/*ADD MODIFIERS */}
      <FullPageModal
        isOpen={isAddModifierModalOpen}
        title="Modifiers"
        onClose={handleAddModifierClose}
        actionButtonLabel="Save Modifier"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddModifierForm />
        </div>
      </FullPageModal>
    </>
  );
};

export default MenuPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";

  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.MeCheckUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, firstName, status, permissions } = response.meUser;

      const canAccessMenu = hasAccess(permissions, PermissionTypeEnum.Menu);
      if (!canAccessMenu) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      if (status === UserStatus.Active) {
        return {
          props: {
            repo: {
              pagePath: context.query["menuRoute"]?.toString() ?? "",
              _id,

              firstName,
              status,
            },
          },
        };
      }
      const redirectResult = redirectPathFromStatus(status);

      return redirectResult;
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    // console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
