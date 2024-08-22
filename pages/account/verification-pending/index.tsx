import BlockerLayout from "@/components/layouts/blockerLayout";
import { sdk } from "@/utils/graphqlClient";
import { redirectForStatus } from "@/utils/redirectForStatus";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = (props: any) => {
  const resto = props.restaurants;
  const router = useRouter();
  return (
    <div className="text-black ">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Verification Pending
      </h1>
      <p className="text-gray-600 whitespace-pre-line">
        {`Your account verification is pending. Please check your email for further instructions.\n${
          resto <= 0
            ? "Till we Verify your account please proceed by adding restaurants"
            : ""
        }`}
      </p>
      <p className="text-gray-600 mb-8"></p>

      {resto <= 0 ? (
        <Link
          href="/onboarding-restaurant/restaurant-welcome"
          className="btn p-0  hover:scale-105 transition-all  mb-12"
        >
          <div className="flex items-center space-x-2">
            <p className="text-lg text-primary ">Add restaurants </p>
            <div className="  text-primary ">
              <FaArrowRight />
            </div>
          </div>
        </Link>
      ) : (
        <div
          onClick={() => {
            router.reload();
          }}
          className="btn p-0  hover:scale-105 transition-all  mb-12 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <p className="text-lg text-primary ">Refresh Status</p>
            <div className="  text-primary ">
              <FaArrowRight />
            </div>
          </div>
        </div>
      )}
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

      const redirectResult = redirectForStatus(status);

      if (redirectResult) {
        return redirectResult;
      }

      return {
        props: {
          status,
          restaurants: (response?.meUser?.restaurants ?? []).length,
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
