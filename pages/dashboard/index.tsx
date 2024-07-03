// import MainLayout from "@/components/layouts/MainLayout";
// import Loader from "@/components/loader";
// import useGlobalStore from "@/store/global";
// import React, { useEffect, useState } from "react";

// type Todo = {
//   userId: number;
//   id: number;
//   title: string;
//   completed: boolean;
// };

// type NextPageWithLayout = React.FC & {
//   getLayout?: (page: React.ReactNode) => React.ReactNode;
// };

// const Dashboard: NextPageWithLayout = () => {
//   const { setSelectedMenu } = useGlobalStore();
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setSelectedMenu("dashboard");
//     fetch("https://jsonplaceholder.typicode.com/todos/")
//       .then((response) => response.json())
//       .then((data) => {
//         setTodos(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
//   }, [setSelectedMenu]);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>
//             {todo.title} {todo.completed ? "✅" : "❌"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// Dashboard.getLayout = function getLayout(page: React.ReactNode) {
//   return <MainLayout>{page}</MainLayout>;
// };

// export default Dashboard;

// import MainLayout from "@/components/layouts/MainLayout";
// import Loader from "@/components/loader";
// import useGlobalStore from "@/store/global";
// import React, { useEffect } from "react";
// import { GetServerSideProps } from "next";
// import { parseCookies } from "nookies";
// import { sdk } from "@/utils/graphqlClient";

// type NextPageWithLayout = React.FC & {
//   getLayout?: (page: React.ReactNode) => React.ReactNode;
// };

// type UserRepo = {
//   _id: string;
//   email: string;
//   firstName: string;
// };

// const Dashboard: NextPageWithLayout = ({ repo }: { repo: UserRepo }) => {
//   const { setSelectedMenu } = useGlobalStore();
//   const [loading, setLoading] = React.useState(true);

//   useEffect(() => {
//     setSelectedMenu("dashboard");
//   }, [setSelectedMenu]);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome, {repo.firstName}!</p>
//       <p>Welcome, {repo.email}!</p>
//       <p>Your role: {repo._id}</p>
//     </div>
//   );
// };

// Dashboard.getLayout = function getLayout(page: React.ReactNode) {
//   return <MainLayout>{page}</MainLayout>;
// };

// export default Dashboard;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const cookies = parseCookies(context);
//   const token = cookies.accessToken;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   try {
//     const response = await sdk.MeUser(
//       {},
//       {
//         cookie: context.req.headers.cookie?.toString() ?? "",
//       }
//     );

//     if (response && response.meUser) {
//       const { _id, email, firstName } = response.meUser;
//       return {
//         props: {
//           repo: {
//             _id,
//             email,
//             firstName,
//           },
//         },
//       };
//     } else {
//       return {
//         redirect: {
//           destination: "/login",
//           permanent: false,
//         },
//       };
//     }
//   } catch (error) {
//     console.error("Failed to fetch user details:", error);
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
// };

import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  email: string;
  firstName: string;
};

const Dashboard: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  if (!repo) {
    return <Loader />;
  }

  return (
    <div className="text-black">
      <p>Welcome, {repo.firstName}!</p>
      <p>Welcome, {repo.email}!</p>
      <p>Your id: {repo._id}</p>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Dashboard;

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
      const { _id, email, firstName } = response.meUser;
      return {
        props: {
          repo: {
            _id,
            email,
            firstName,
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
