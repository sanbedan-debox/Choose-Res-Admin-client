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
import { hideEmail, hidePhoneNumber } from "@/utils/utilFUncs";
import UserBasicInformationForm from "@/components/modules/profile/forms/userBasicInformationForm";
import { useBasicProfileStore } from "@/components/modules/profile/store/basicProfileInformation";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const Profile: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();
  const { _id, email, firstName, lastName, phone } = repo || {};

  useEffect(() => {
    if (repo) {
      useBasicProfileStore.getState().setProfileData({
        _id: _id || "",
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
      });
    }
  }, [repo]);

  const {
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setZipcode,
    setState,
    setbusinessName,
    setbusinessType,
    setein,
    setemployeeSize,
    setestablishedAt,
    setestimatedRevenue,
  } = useProfileStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setAddressLine1(address?.addressLine1 || "");
        setAddressLine2(address?.addressLine2 || "");
        setCity(address?.city || "");
        setCords(address?.coordinate?.coordinates || [0, 0]);
        setPlace({
          displayName: address?.place?.displayName || "",
          placeId: address?.place?.placeId || "",
        });
        setZipcode(address?.zipcode || 0);
        setState({
          id: address?.state.stateId || "",
          value: address?.state.stateName || "",
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
    fetchBusinessDetails();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const contentList = [
    {
      id: "userBasicInformation",
      title: "User Basic Information",
      Component: UserBasicInformationForm,
    },
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
      <MenuSection contentList={contentList} />
    </div>
  );
};

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
export default Profile;

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
    const response = await sdk.MeUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, email, firstName, lastName, phone } = response.meUser;
      return {
        props: {
          repo: {
            _id,
            email,
            firstName,
            lastName,
            phone,
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
