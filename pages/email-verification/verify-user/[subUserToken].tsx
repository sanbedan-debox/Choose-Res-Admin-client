import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { FaSpinner } from "react-icons/fa";

const SubUserVerify = () => {
  return (
    <div className="w-full h-full">
      <FaSpinner className="animate-spin h-5 w-5 text-white" />
    </div>
  );
};

export default SubUserVerify;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await sdk.verifyTeamEmail(
      { token: context.query["subUserToken"]?.toString() ?? "" },
      {}
    );
    if (response) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};
