// Aggregator.tsx
import MainLayout from "@/components/layouts/mainBodyLayout";
import AggregatorList from "@/components/modules/aggregator/components/aggregatorList";
import {
  IntegrationConnectionStatusEnum,
  IntegrationPlatformEnum,
} from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

interface PageProps {
  integrations?: {
    _id: string;
    platform: IntegrationPlatformEnum;
    connectionStatus: IntegrationConnectionStatusEnum;
  }[];
}

const Aggregator: NextPageWithLayout = ({ integrations }: PageProps) => {
  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">Integrations</h1>
      <AggregatorList integrations={integrations ?? []} />
    </div>
  );
};

Aggregator.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Aggregator;

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
    const response = await sdk.GetAllIntegrations(
      {},
      { cookie: context.req.headers.cookie?.toString() ?? "" }
    );

    if (response.getAllIntegrations) {
      return {
        props: {
          integrations: response.getAllIntegrations,
        },
      };
    }

    return {
      props: {
        integrations: [],
      },
    };
  } catch (error) {
    return {
      props: {
        integrations: [],
      },
    };
  }
};
