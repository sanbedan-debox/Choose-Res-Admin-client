import BlockerLayout from "@/components/layouts/blockerLayout";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = () => {
  return (
    <div className="text-black ">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Pending</h1>
      <p className="text-gray-600 whitespace-pre-line">
        {`Your payment for the current account is pending. Please check your email for further instructions.\nTill we Verify your payments and please proceed forward`}
      </p>
      <p className="text-gray-600 mb-8"></p>
    </div>
  );
};

PaymentPending.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default PaymentPending;

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
      const { status } = response.meUser;

      if (status === "blocked") {
        return {
          redirect: {
            destination: "/account/blocked",
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
      } else if (status === "restaurantOnboardingPending") {
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
