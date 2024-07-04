import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";

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
  businessName: string;
  establishedAt: string;
};

const Dashboard: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();

  const {
    setBusinessName,
    setEmail,
    setEstablishedAt,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
    firstName,
  } = useAuthStore();

  useEffect(() => {
    setUserId(repo?._id);
    setEmail(repo?.email);
    setPhone(repo?.phone);
    setFirstName(repo?.firstName);
    setLastName(repo?.lastName);
    setStatus(repo?.status);
    setBusinessName(repo?.businessName);
    setEstablishedAt(repo?.establishedAt);
  }, [repo]);

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  if (!repo) {
    return <Loader />;
  }

  return (
    <div className="text-black">
      <p>Welcome, {repo.firstName}!</p>
      <p>Welcome, {repo.email}!</p>
      <p>Your id: {repo._id}</p>
      <p>Your status: {repo.status}</p>
      <p>Your Name from auth state: {firstName}</p>
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
      const {
        _id,
        email,
        firstName,
        status,
        lastName,
        phone,
        businessName,
        establishedAt,
      } = response.meUser;

      if (status === "blocked") {
        return {
          redirect: {
            destination: "/blocked",
            permanent: false,
          },
        };
      } else if (status === "onboardingPending") {
        return {
          redirect: {
            destination: "/onboarding/user/intro",
            permanent: false,
          },
        };
      } else if (status === "paymentPending") {
        return {
          redirect: {
            destination: "/onboarding/pending",
            permanent: false,
          },
        };
      } else if (status === "restaurantOnboardingPending") {
        return {
          redirect: {
            destination: "/onboardingRestaurant/restaurant",
            permanent: false,
          },
        };
      } else if (status === "internalVerificationPending") {
        return {
          redirect: {
            destination: "/pending",
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
            businessName,
            establishedAt,
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
