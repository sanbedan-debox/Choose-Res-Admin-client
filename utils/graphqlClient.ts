import { getSdk } from "@/generated/graphql";
import { gql, GraphQLClient } from "graphql-request";

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

const TOKEN_REFRESH_QUERY = gql`
  mutation TokenRefresh {
    tokensRefresh
  }
`;

export const graphQLClient = new GraphQLClient(endpoint, {
  credentials: "include",
  // fetch: async (
  //   input: RequestInfo | URL,
  //   init?: RequestInit
  // ): Promise<Response> => {
  //   let response = await fetch(input, init);

  //   if (response.status === 401) {
  //     // Get new refresh tokens
  //     try {
  //       const client = new GraphQLClient(endpoint, { credentials: "include" });

  //       const resp: any = await client.rawRequest(
  //         TOKEN_REFRESH_QUERY,
  //         {},
  //         init?.headers
  //       );

  //       // console.log(resp.headers.get("set-cookie"));

  //       // setCookie("test", "works!!!", {
  //       //   req: input,
  //       //   res: response,
  //       //   httpOnly: true,
  //       //   maxAge: 3.154e10,
  //       // });

  //       // const d = await response.json();

  //       // response = new Response();
  //       const responseClone = new Response(response.body, response);
  //       resp.headers.forEach((v: any, k: any, i: any) => {
  //         responseClone.headers.set(k, v);
  //       });
  //       // resp.headers.keys((he: any) => {
  //       //   console.log(he);
  //       //   // responseClone.headers.set(he, h);
  //       // });
  //       // .set(
  //       //   "set-cookie",
  //       //   "at=hello; Max-Age=31540000000; HttpOnly"
  //       // );
  //       response = responseClone;
  //       //   {
  //       //   ...init,
  //       //   headers: {
  //       //     ...init?.headers,
  //       //     "set-cookie": "at=hello; Max-Age=31540000000; HttpOnly",
  //       //   },
  //       // });
  //     } catch (error) {
  //       console.log("ERROR", error);
  //       // Redirect to login page if the user is not already there
  //       if (window.location.pathname !== "/login") {
  //         window.location.href = "/login";
  //       }
  //     }
  //   }

  //   console.log("returned", response.headers.get("set-cookie"));

  //   return response;
  // },
});

export const sdk = getSdk(graphQLClient);
