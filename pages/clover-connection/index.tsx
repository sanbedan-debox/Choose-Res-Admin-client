import BlockerLayout from "@/components/layouts/blockerLayout";
import useMenuPageStore from "@/store/menuStore";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

interface CloverConnectionVerifyProps {
  redirectUrl?: string;
  error?: string;
}

const CloverConnectionVerify: NextPageWithLayout = ({
  redirectUrl,
  error,
}: CloverConnectionVerifyProps) => {
  const [countdown, setCountdown] = useState<number>(3);
  const { setIsShowCloverModal } = useMenuPageStore();
  useEffect(() => {
    if (redirectUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (redirectUrl === "/menu") {
              setIsShowCloverModal(true);
            }
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [redirectUrl]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
      {error && (
        <p className="text-red-500">
          {error} <br />
          Redirecting in {countdown} seconds...
        </p>
      )}
      {!error && redirectUrl && (
        <p>{`Clover Connection successful. Redirecting in ${countdown} seconds...`}</p>
      )}
    </div>
  );
};

CloverConnectionVerify.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default CloverConnectionVerify;

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

  const isComingFromAggregatorPage = context.query.fromAggregator === "true";
  const merchant_id = context.query.merchant_id?.toString() ?? "";
  const code = context.query.code?.toString() ?? "";

  if (!merchant_id || !code) {
    return {
      props: {
        error: "Something went wrong, please try again later!",
        redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
      },
    };
  }

  try {
    const response = await sdk.validateCloverConnection(
      {
        input: {
          authCode: code,
          merchantId: merchant_id,
        },
      },
      { cookie: context.req.headers.cookie?.toString() ?? "" }
    );

    if (response.validateCloverConnection) {
      return {
        props: {
          redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
        },
      };
    } else {
      return {
        props: {
          error:
            "Clover could not verify your details, please try again or contact Clover!",
          redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
        },
      };
    }
  } catch (error) {
    return {
      props: {
        error: extractErrorMessage(error),
        redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
      },
    };
  }
};
