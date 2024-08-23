import BlockerLayout from "@/components/layouts/blockerLayout";
import { UserStatus } from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { redirectPathFromStatus } from "@/utils/redirectPathFromStatus";
import { GetServerSideProps } from "next";
import React from "react";

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
      const { status } = response.meUser;

      if (status === UserStatus.Blocked) {
        return {
          props: {
            repo: {
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
