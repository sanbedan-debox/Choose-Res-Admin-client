import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";
import { UserStatus } from "@/generated/graphql";
import QuickActions from "@/components/common/quickLinks/quickLink";
import MainLayout from "@/components/layouts/mainBodyLayout";
import { Searchfeatures } from "@/utils/searchFeatures";
import IncompleteRestaurants from "@/components/common/incompleteRestaurant/incompleteRestaurant";
import { useRouter } from "next/router";
import QuickActionsDashboard from "@/components/common/quickAction/quickAction";

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
    console.log(`Completing restaurant with id: ${id}`); // Added log
    const res = await sdk.setRestaurantIdAsCookie({ id });
    if (res.setRestaurantIdAsCookie) {
      router.push("/onboarding-restaurant/restaurant-basic-information");
    }
  };

  const [restaurants, setRestaurants] = useState<
    { name: string; id: string }[]
  >([]);

  useEffect(() => {
    async function fetchPendingRestaurants() {
      try {
        const response = await sdk.getUserRestaurantsPending();
        const restaurantsIncomplete = response.getUserRestaurantsPending.map(
          (res) => ({
            name: res.name.value,
            id: res.id,
          })
        );
        setRestaurants(restaurantsIncomplete);
      } catch (error) {
        console.error("Failed to fetch pending restaurants:", error);
      }
    }

    fetchPendingRestaurants();
  }, []);

  const { setisShowSetupPanel, setisShowTaxSettings } = useGlobalStore();

  const actions = [
    {
      name: "Set Tax Rate",
      link: "#",
      onClick: () => setisShowTaxSettings(true),
    },
  ];

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
        {restaurants.length > 0 && (
          <IncompleteRestaurants
            restaurants={restaurants}
            completeRes={completeRes}
          />
        )}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Dashboard;

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
