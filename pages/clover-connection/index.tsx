import BlockerLayout from "@/components/layouts/blockerLayout";
import { sdk } from "@/utils/graphqlClient";
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

  useEffect(() => {
    if (redirectUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (redirectUrl) {
              window.location.href = redirectUrl;
            }
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
  const isComingFromAggregatorPage = context.query.fromAggregator === "true";
  const merchant_id = context.query.merchant_id?.toString() ?? "";
  const client_id = context.query.client_id?.toString() ?? "";
  const code = context.query.code?.toString() ?? "";

  if (!merchant_id || !code) {
    return {
      props: {
        redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
      },
    };
  }

  try {
    const response = await sdk.validateCloverConnection({
      input: {
        authCode: code,
        merchantId: merchant_id,
      },
    });

    if (response.validateCloverConnection) {
      return {
        props: {
          redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
        },
      };
    } else {
      return {
        props: {
          error: "Validation failed. Please try again.",
          redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
        },
      };
    }
  } catch (error) {
    return {
      props: {
        error:
          "There was an error processing your request. Please try again later.",
        redirectUrl: isComingFromAggregatorPage ? "/aggregator" : "/menu",
      },
    };
  }
};
