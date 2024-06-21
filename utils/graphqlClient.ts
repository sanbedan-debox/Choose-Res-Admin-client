import { getSdk } from "@/generated/graphql";
import { GraphQLClient } from "graphql-request";

if (
  process.env.NEXT_PUBLIC_SERVER_IS_PROD === "true" &&
  !process.env.NEXT_PUBLIC_SERVER_PROD_URL
) {
  throw new Error(
    "Production endpoint must be defined in NEXT_PUBLIC_SERVER_PROD_URL"
  );
}

const endpoint =
  process.env.NEXT_PUBLIC_SERVER_IS_PROD === "true"
    ? process.env.NEXT_PUBLIC_SERVER_PROD_URL || ""
    : process.env.NEXT_PUBLIC_SERVER_DEV_URL || "";

if (!endpoint) {
  throw new Error("Endpoint URL is not defined.");
}

export const graphQLClient = new GraphQLClient(endpoint, {
  credentials: "include",
});

export const sdk = getSdk(graphQLClient);
