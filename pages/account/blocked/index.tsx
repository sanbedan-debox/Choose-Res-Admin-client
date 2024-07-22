import BlockerLayout from "@/components/layouts/blockerLayout";
import Image from "next/image";
import LogoImage from "../../../assets/logo/logoDark.png";
import IllustrationImage from "../../../assets/svg/pending.svg";
import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = () => {
  return (
    <div className="text-black ">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Account Blocked</h1>
      <p className="text-gray-600 whitespace-pre-line">
        {`Your account has been blocked due to suspicious activity detected on your account.\nPlease contact our support team for further assistance and to resolve this issue promptly.`}
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
      const { status } = response.meUser;

      if (status === "onboardingPending") {
        return {
          redirect: {
            destination: "/onboarding/user/intro",
            permanent: false,
          },
        };
      } else if (status === "restaurantOnboardingPending") {
        return {
          redirect: {
            destination: "/onboarding-restaurant/restaurant-",
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
      } else if (status === "paymentPending") {
        return {
          redirect: {
            destination: "/account/payment-pending",
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
