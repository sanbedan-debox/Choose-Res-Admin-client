import ArrowCard from "@/components/common/arrowCard/arrowCard";
import ReusableModal from "@/components/common/modal/modal";
import QuickActions from "@/components/common/quickLinks/quickLink";
import MainLayout from "@/components/layouts/mainBodyLayout";
import CsvUploadForm from "@/components/modules/menu/forms/csvUploadForm";
import { PermissionTypeEnum, UserStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { redirectPathFromStatus } from "@/utils/redirectPathFromStatus";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import useMenuPageStore from "../../store/menuStore";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;

  firstName: string;
  status: string;
};

const Menu: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();

  const { isShowUploadCSV, setisShowUploadCSV } = useMenuPageStore();

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  return (
    <div className="w-full flex space-x-5">
      <div className="w-3/4 overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col space-y-4">
          <ArrowCard
            title="Menu builder"
            caption="Our newest tool for creating and managing menus with improved workflows and streamlined settings. Manually select and create your menus."
            href="/menu/menu-builder/menu"
          />
          <ArrowCard
            title="Have Clover?"
            caption="Pull your menu from Clover!"
            href={`https://sandbox.dev.clover.com/oauth/v2/authorize?client_id=${
              process.env.NEXT_PUBLIC_CLOVER_APP_ID
            }&redirect_uri=${encodeURIComponent(
              `${process.env.NEXT_PUBLIC_APP_URL}/clover-connection?redirectUri=false`
            )}`}
          />
          <ArrowCard
            title="Upload CSV"
            caption="Bulk upload your categories and items to the selected Menu"
            onClick={() => setisShowUploadCSV(true)}
          />
        </div>
      </div>
      <div className="w-1/4 sticky top-0 h-full">
        <QuickActions />
      </div>
      <ReusableModal
        width="md"
        isOpen={isShowUploadCSV}
        onClose={() => setisShowUploadCSV(false)}
        title="Upload CSV"
      >
        <CsvUploadForm />
      </ReusableModal>
    </div>
  );
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;

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
