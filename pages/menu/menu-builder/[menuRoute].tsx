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
import { UserStatus } from "@/generated/graphql";
import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useMenuCategoryStore from "@/store/menuCategory";
import useMenuItemsStore from "@/store/menuItems";
import useMenuMenuStore from "@/store/menumenu";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import useModStore from "@/store/modifiers";
import useSubCategoryStore from "@/store/subCategoryStore";
import useSubCategory from "@/store/subCategoryStore";
import { sdk } from "@/utils/graphqlClient";

import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useEffect } from "react";

type UserRepo = {
  pagePath: string;

  _id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
};
const MenuPage = ({ repo }: { repo?: UserRepo }) => {
  const {
    isAddItemModalOpen,
    setisAddItemModalOpen,
    isAddCategoryModalOpen,
    isAddMenuModalOpen,
    setisAddCategoryModalOpen,
    setisAddMenuModalOpen,
    fetchMenuDatas,
    setfetchMenuDatas,
    isAddModifierGroupModalOpen,
    setisAddModifierGroupModalOpen,
    isAddModifierModalOpen,
    setisAddModifierModalOpen,
    isAddSubCategoryModalOpen,
    setisAddSubCategoryModalOpen,
  } = useMenuOptionsStore();
  const { setEditModGroupId, setisEditModGroup, setisDuplicateModifierGroup } =
    useModGroupStore();
  const { seteditSubCategoryId, setisEditSubCategory } = useSubCategoryStore();

  const { seteditCatsId, setisEditCats, setisDuplicateCats } =
    useMenuCategoryStore();
  const { setEditModId, setisEditMod, setisDuplicateMods } = useModStore();
  const { setEditMenuId, setisEditMenu, setisDuplicateMenu } =
    useMenuMenuStore();

  const {
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
    firstName,
  } = useAuthStore();

  useEffect(() => {
    setUserId(repo?._id ?? "");
    setEmail(repo?.email ?? "");
    setPhone(repo?.phone ?? "");
    setFirstName(repo?.firstName ?? "");
    setLastName(repo?.lastName ?? "");
    setStatus(repo?.status ?? "");
  }, [
    repo,
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
  ]);

  const { setEditItemId, setisEditItem, setisDuplicateItem } =
    useMenuItemsStore();
  const handleAddMenuItemClose = () => {
    setisAddItemModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditItem(false);
    setEditItemId(null);
    setisDuplicateItem(false);
  };
  const handleAddSubCategoryModalclose = () => {
    setisAddSubCategoryModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditSubCategory(false);
    seteditSubCategoryId(null);
  };
  const handleAddMenuCategoryClose = () => {
    setisAddCategoryModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditCats(false);
    seteditCatsId(null);
    setisDuplicateCats(false);
  };
  const handleAddMenuClose = () => {
    setisAddMenuModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditMenu(false);
    setisDuplicateMenu(false);
    setEditMenuId(null);
  };
  const handleAddModifierGroupClose = () => {
    setisAddModifierGroupModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditModGroup(false);
    setisDuplicateModifierGroup(false);
    setEditModGroupId(null);
  };
  const handleAddModifierClose = () => {
    setisAddModifierModalOpen(false);
    setfetchMenuDatas(!fetchMenuDatas);
    setisEditMod(false);
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
        onActionButtonClick={() => console.log("hello")}
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
        onActionButtonClick={() => console.log("hello")}
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
        onActionButtonClick={() => console.log("hello")}
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
        onActionButtonClick={() => console.log("hello")}
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
              setisAddModifierGroupModalOpen(false);
              setfetchMenuDatas(!fetchMenuDatas);
              setisEditModGroup(false);
              setisDuplicateModifierGroup(false);
              setEditModGroupId(null);
            }
          } else {
            setisAddModifierGroupModalOpen(false);
            setfetchMenuDatas(!fetchMenuDatas);
            setisEditModGroup(false);
            setisDuplicateModifierGroup(false);
            setEditModGroupId(null);
          }
        }}
        actionButtonLabel="Save Modifier Group"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => console.log("hello")}
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
        onActionButtonClick={() => console.log("hello")}
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
  const cookies = parseCookies(context);
  const token = cookies.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.MeUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, email, firstName, status, lastName, phone } =
        response.meUser;

      if (status === UserStatus.Blocked) {
        return {
          redirect: {
            destination: "/account/blocked",
            permanent: false,
          },
        };
      } else if (status === UserStatus.OnboardingPending) {
        return {
          redirect: {
            destination: "/onboarding/user/intro",
            permanent: false,
          },
        };
      } else if (status === UserStatus.PaymentPending) {
        return {
          redirect: {
            destination: "/account/payment-pending",
            permanent: false,
          },
        };
      } else if (status === UserStatus.RestaurantOnboardingPending) {
        return {
          redirect: {
            destination: "/onboarding-restaurant/restaurant-welcome",
            permanent: false,
          },
        };
      } else if (status === "internalVerificationPending") {
        return {
          redirect: {
            destination: "/account/verification-pending",
            permanent: false,
          },
        };
      }

      return {
        props: {
          repo: {
            pagePath: context.query["menuRoute"]?.toString() ?? "",
            _id,
            email,
            phone,
            firstName,
            lastName,
            status,
          },
        },
      };
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
