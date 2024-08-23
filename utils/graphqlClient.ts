// import { getSdk } from "@/generated/graphql";
// import { gql, GraphQLClient } from "graphql-request";

// // if (
// //   process.env.NEXT_PUBLIC_SERVER_IS_PROD === "true" &&
// //   !process.env.NEXT_PUBLIC_SERVER_PROD_URL
// // ) {
// //   throw new Error(
// //     "Production endpoint must be defined in NEXT_PUBLIC_SERVER_PROD_URL"
// //   );
// // }

// // const endpoint =
// //   process.env.NEXT_PUBLIC_SERVER_IS_PROD === "true"
// //     ? process.env.NEXT_PUBLIC_SERVER_PROD_URL || ""
// //     : process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";

// if (!process.env.NEXT_PUBLIC_SERVER_BASE_URL) {
//   throw new Error("Endpoint URL is not defined.");
// }

// const TOKEN_REFRESH_QUERY = gql`
//   mutation TokenRefresh {
//     tokensRefresh
//   }
// `;

// export const graphQLClient = new GraphQLClient(`{${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/graphql}`, {
//   credentials: "include",
//   // fetch: async (
//   //   input: RequestInfo | URL,
//   //   init?: RequestInit
//   // ): Promise<Response> => {
//   //   let response = await fetch(input, init);

//   //   if (response.status === 401) {
//   //     // Get new refresh tokens
//   //     try {
//   //       const client = new GraphQLClient(endpoint, { credentials: "include" });

//   //       const resp: any = await client.rawRequest(
//   //         TOKEN_REFRESH_QUERY,
//   //         {},
//   //         init?.headers
//   //       );

//   //       // console.log(resp.headers.get("set-cookie"));

//   //       // setCookie("test", "works!!!", {
//   //       //   req: input,
//   //       //   res: response,
//   //       //   httpOnly: true,
//   //       //   maxAge: 3.154e10,
//   //       // });

//   //       // const d = await response.json();

//   //       // response = new Response();
//   //       const responseClone = new Response(response.body, response);
//   //       resp.headers.forEach((v: any, k: any, i: any) => {
//   //         responseClone.headers.set(k, v);
//   //       });
//   //       // resp.headers.keys((he: any) => {
//   //       //   console.log(he);
//   //       //   // responseClone.headers.set(he, h);
//   //       // });
//   //       // .set(
//   //       //   "set-cookie",
//   //       //   "at=hello; Max-Age=31540000000; HttpOnly"
//   //       // );
//   //       response = responseClone;
//   //       //   {
//   //       //   ...init,
//   //       //   headers: {
//   //       //     ...init?.headers,
//   //       //     "set-cookie": "at=hello; Max-Age=31540000000; HttpOnly",
//   //       //   },
//   //       // });
//   //     } catch (error) {
//   //       console.log("ERROR", error);
//   //       // Redirect to login page if the user is not already there
//   //       if (window.location.pathname !== "/login") {
//   //         window.location.href = "/login";
//   //       }
//   //     }
//   //   }

//   //   console.log("returned", response.headers.get("set-cookie"));

//   //   return response;
//   // },
// });

// export const sdk = getSdk(graphQLClient);

import { getSdk } from "@/generated/graphql";
import { gql, GraphQLClient } from "graphql-request";

if (!process.env.NEXT_PUBLIC_SERVER_BASE_URL) {
  throw new Error("Endpoint URL is not defined.");
}

const TOKEN_REFRESH_QUERY = gql`
  mutation TokenRefresh {
    tokensRefresh
  }
`;

const endpoint = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/graphql`;

const graphQLClient = new GraphQLClient(endpoint, {
  credentials: "include",
  fetch: async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let response = await fetch(input, init);

    if (response.status === 401) {
      try {
        // Get new refresh tokens
        const client = new GraphQLClient(endpoint, { credentials: "include" });
        const resp = await client.rawRequest(TOKEN_REFRESH_QUERY, {}, init?.headers);

        // Clone the response and set new headers
        const responseClone = new Response(response.body, response);
        resp.headers.forEach((value, key) => {
          responseClone.headers.set(key, value);
        });

        response = responseClone;
      } catch (error) {
        console.error("Error refreshing tokens:", error);
        // Redirect to login page if the user is not already there
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return response;
  },
});

export const sdk = getSdk(graphQLClient);
