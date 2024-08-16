import QuickActionsDashboard from "@/components/common/quickAction/quickAction";
import ScrollableQuickActionCard from "@/components/common/ScrollableQuickActionCard/ScrollableQuickActionCard";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import { PermissionTypeEnum, UserStatus } from "@/generated/graphql";
import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
};

const Dashboard: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu, isShowSetupPanel } = useGlobalStore();
  const [canEditRestaurant, setCanEditRestaurant] = useState(false);
  const [canEditTaxRate, setCanEditTaxRate] = useState(false);

  const router = useRouter();
  const {
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
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

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const completeRes = async (id: string) => {
    const res = await sdk.setRestaurantIdAsCookie({ id });
    if (res.setRestaurantIdAsCookie) {
      router.push("/onboarding-restaurant/restaurant-basic-information");
    }
  };
  const completeMenuUpload = async (id: string) => {
    const res = await sdk.setRestaurantIdAsCookie({ id });
    if (res.setRestaurantIdAsCookie) {
      router.push("/onboarding-restaurant/restaurant-basic-information");
    }
  };

  const [restaurants, setRestaurants] = useState<
    { name: string; id: string }[]
  >([]);

  const [csvFails, setCsvFails] = useState<
    {
      id: string;
      issues: string[];
      errorFile: string;
      updatedAt: string;
    }[]
  >([]);
  const { meUser } = useUserStore();
  const permissions = meUser?.permissions ?? [];

  useEffect(() => {
    async function fetchPendingRestaurants() {
      try {
        const response = await sdk.userRestaurantsPending();
        if (response && response.userRestaurantsPending) {
          const restaurantsIncomplete = response.userRestaurantsPending.map(
            (res: { name: string; id: string }) => ({
              name: res.name,
              id: res.id,
            })
          );
          setRestaurants(restaurantsIncomplete);
        }
      } catch (error) {
        console.error("Failed to fetch pending restaurants:", error);
      }
    }
    async function fetchPendingCsvUploads() {
      try {
        const response = await sdk.getCsvErrors();

        if (response && response.getCsvErrors) {
          const restaurantsIncomplete = response.getCsvErrors.map((res) => ({
            id: res._id,
            issues: res.issues,
            errorFile: res.errorFile,
            updatedAt: res.updatedAt,
          }));
          setCsvFails(restaurantsIncomplete);
        }
      } catch (error) {
        console.error("Failed to fetch pending restaurants:", error);
      }
    }
    const canAddRestaurant = hasAccess(permissions, PermissionTypeEnum.Menu);
    setCanEditRestaurant(canAddRestaurant);
    const canUpdateTax = hasAccess(permissions, PermissionTypeEnum.UpdateTax);
    const canUpdateBusiness = hasAccess(
      permissions,
      PermissionTypeEnum.UpdateBusiness
    );
    const canUpdateRestarant = hasAccess(
      permissions,
      PermissionTypeEnum.UpdateRestaurant
    );
    setCanEditTaxRate(canUpdateTax && canUpdateBusiness && canUpdateRestarant);

    fetchPendingRestaurants();
    fetchPendingCsvUploads();
  }, []);

  const { setisShowTaxSettings } = useGlobalStore();
  const { taxRate } = useAuthStore();

  canEditTaxRate;
  const actions = canEditTaxRate
    ? [
        {
          name: taxRate?.salesTax ? "Update tax rate" : "Set Tax Rate",
          link: "#",
          onClick: () => setisShowTaxSettings(true),
        },
      ]
    : [];

  const { firstName } = useAuthStore();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} ${
    months[currentDate.getMonth()]
  }`;

  if (!repo) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Welcome</span>
          <span className="text-lg font-bold">{firstName}</span>
          <span className="text-sm">|</span>
          <span className="text-sm font-semibold">Date</span>
          <span className="text-sm font-bold">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-4">
        <QuickActionsDashboard actions={actions} />
        {restaurants.length > 0 && canEditRestaurant && (
          <ScrollableQuickActionCard
            list={restaurants}
            onClick={completeRes}
            title="Incomplete Restaurants"
            emptyContentText="No Incomplete restaurants"
          />
        )}
        {/* {restaurants.length > -1 && canEditRestaurant && (
          <ScrollableQuickActionCard
            list={csvFails}
            onClick={completeMenuUpload}
            title="Incomplete Menu Uploads"
            emptyContentText="No Incomplete menu Uploads"
          />
        )} */}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Dashboard;

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
    const response = await sdk.MeUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, email, firstName, status, lastName, phone, permissions } =
        response.meUser;

      const canAccessMenu = hasAccess(
        permissions,
        PermissionTypeEnum.Dashboard
      );
      if (!canAccessMenu) {
        return {
          redirect: {
            destination: "/500",
            permanent: false,
          },
        };
      }

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
