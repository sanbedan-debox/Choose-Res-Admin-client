import MenuSection from "@/components/common/menuSection/menuSection";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import BusinessInformationForm from "@/components/modules/profile/forms/businessInformationForm";
import IdentityVerificationForm from "@/components/modules/profile/forms/identityVerificationForm";
import LocationDetailsForm from "@/components/modules/profile/forms/locationDetailsForm";
import UserBasicInformationForm from "@/components/modules/profile/forms/userBasicInformationForm";
import { useBasicProfileStore } from "@/components/modules/profile/store/basicProfileInformation";
import { PermissionTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useProfileStore from "@/store/profile";
import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { redirectForStatus } from "@/utils/redirectForStatus";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  firstName: string;
};

const Profile: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();
  const [canUpdateBusinessDetails, setCanUpdateBusinessDetails] =
    useState(false);
  const { meUser } = useUserStore();
  const permissions = meUser?.permissions ?? [];

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
    setid,
  } = useProfileStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedMenu("");

    const fetchRestaurantDetails = async () => {
      try {
        const response = await sdk.MeUserforProfile();
        if (response && response.meUser) {
          const { _id, email, firstName, lastName, phone, enable2FA } =
            response.meUser;
          useBasicProfileStore.getState().setProfileData({
            _id: _id ?? "",
            email: email ?? "",
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            phone: phone ?? "",
            twoFactorAuth: enable2FA ?? false,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setLoading(false);
      }
    };

    const fetchBusinessDetails = async () => {
      try {
        const response = await sdk.userBusinessDetails();
        const {
          businessType,
          businessName,
          employeeSize,
          estimatedRevenue,
          address,
          ein,
          _id,
        } = response.userBusinessDetails;

        setid(_id);
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
          id: address?.state?.stateId || "",
          value: address?.state?.stateName || "",
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

    const canUpdateRestaurant = hasAccess(
      permissions,
      PermissionTypeEnum.UpdateBusiness
    );
    setCanUpdateBusinessDetails(canUpdateRestaurant);
    fetchRestaurantDetails();
    fetchBusinessDetails();
  }, [permissions]);

  if (loading) {
    return <Loader />;
  }

  const contentList = canUpdateBusinessDetails
    ? [
        {
          id: "userBasicInformation",
          title: "Profile Information",
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
          title: "Security",
          Component: IdentityVerificationForm,
        },
      ]
    : [
        {
          id: "userBasicInformation",
          title: "Profile Information",
          Component: UserBasicInformationForm,
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
    const response = await sdk.MeCheckUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, firstName, status } = response.meUser;
      const redirectResult = redirectForStatus(status);

      if (redirectResult) {
        return redirectResult;
      }

      return {
        props: {
          repo: {
            _id,
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
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
