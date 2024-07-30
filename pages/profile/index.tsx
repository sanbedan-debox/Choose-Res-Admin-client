import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import MainLayout from "@/components/layouts/mainBodyLayout";
import MenuSection from "@/components/common/menuSection/menuSection";
import BusinessInformationForm from "@/components/modules/profile/forms/businessInformationForm";
import LocationDetailsForm from "@/components/modules/profile/forms/locationDetailsForm";
import IdentityVerificationForm from "@/components/modules/profile/forms/identityVerificationForm";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  email: string;
  firstName: string;
};

const Profile: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  if (!repo) {
    return <Loader />;
  }
  const contentList = [
    {
      id: "businessInformation",
      title: "Business Information",
      Component: BusinessInformationForm,
    },
    {
      id: "locationDetails",
      title: "Location Details",
      Component: LocationDetailsForm,
    },
    {
      id: "identityVerification",
      title: "Identity Verification",
      Component: IdentityVerificationForm,
    },
  ];

  return (
    <div className="text-black">
      {/* <p>Welcome, {repo.firstName}!</p>
      <p>Welcome, {repo.email}!</p>
      <p>Your id: {repo._id}</p> */}
      <MenuSection contentList={contentList} />
    </div>
  );
};

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Profile;

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
