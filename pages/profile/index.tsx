import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import MainLayout from "@/components/layouts/mainBodyLayout";
import MenuSection from "@/components/common/menuSection/menuSection";
import BusinessInformationForm from "@/components/modules/profile/forms/businessInformationForm";
import LocationDetailsForm from "@/components/modules/profile/forms/locationDetailsForm";
import IdentityVerificationForm from "@/components/modules/profile/forms/identityVerificationForm";
import useProfileStore from "@/store/profile";

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
  const {
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setPostcode,
    setState,
    setbusinessName,
    setbusinessType,
    setein,
    setemployeeSize,
    setestablishedAt,
    setestimatedRevenue,
  } = useProfileStore();

  const [loading, setLoading] = useState(true);

  const fetchBusinessDetails = async () => {
    try {
      const response = await sdk.getBusinessDetails();
      const {
        businessType,
        businessName,
        employeeSize,
        estimatedRevenue,
        address,
        ein,
      } = response.getBusinessDetails;
      setAddressLine1(address?.addressLine1?.value || "");
      setAddressLine2(address?.addressLine2?.value || "");
      setCity(address?.city?.value || "");
      setCords(address?.coordinate?.coordinates || [0, 0]);
      setPlace({
        displayName: address?.place?.displayName || "",
        placeId: address?.place?.placeId || "",
      });
      setPostcode(address?.postcode?.value || "");
      setState({
        id: address?.state?._id || "",
        value: address?.state?.value || "",
      });
      setbusinessName(businessName || "");
      setbusinessType(businessType || "");
      setein(ein || "");
      setemployeeSize(employeeSize || "");
      setestimatedRevenue(estimatedRevenue || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching business details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col">
      {/* <MenuSection contentList={contentList} /> */}
      <BusinessInformationForm />
      <br />
      <LocationDetailsForm />
      <br />
      <IdentityVerificationForm />
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
