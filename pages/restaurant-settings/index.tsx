import MenuSection from "@/components/common/menuSection/menuSection";
import { reverseFormatAvailability } from "@/components/common/timingAvailibility/interface";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import RestaurantBasicInformationEditForm from "@/components/modules/restaurant-settings/forms/restaurantBasicInformation";
import RestaurantEditAdditionalDetails from "@/components/modules/restaurant-settings/forms/restaurantEditAdditionalDetails";
import RestaurantEditAvailabilityForm from "@/components/modules/restaurant-settings/forms/restaurantEditAvailibilityForm";
import {
  BeverageCategory,
  FoodType,
  MeatType,
  PermissionTypeEnum,
  RestaurantCategory,
  RestaurantType,
  UserStatus,
} from "@/generated/graphql";
import useUserStore from "@/store/user";
import useRestaurantEditStore from "@/store/useRestaurantEditStore";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { redirectPathFromStatus } from "@/utils/redirectPathFromStatus";
import { GetServerSideProps } from "next"; // Importing GetServerSideProps type
import React, { useEffect, useState } from "react";

// Define the type for RestaurantSettings component with custom getLayout property
type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const RestaurantSettings: NextPageWithLayout = () => {
  const [canUpdateBusinessDetails, setCanUpdateBusinessDetails] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const { meUser } = useUserStore();
  const {
    setAddressLine1,
    setAddressLine2,
    setAvailabilityHours,
    setBeverageCategory,
    setBrandingLogo,
    setCity,
    setCords,
    setDineInCapacity,
    setFacebookLink,
    setFoodType,
    setId,
    setInstagramLink,
    setMeatType,
    setPlace,
    setRestaurantCategory,
    setRestaurantName,
    setRestaurantType,
    setRestaurantWebsite,
    setZipcode,
    setState,
    setTimeZone,
    setTwitterLink,
  } = useRestaurantEditStore();
  const permissions = meUser?.permissions ?? [];

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await sdk.restaurantDetails();
        if (response && response.restaurantDetails) {
          const repo = response.restaurantDetails;
          setBrandingLogo(repo?.brandingLogo as string);
          setRestaurantName(repo?.name);
          setRestaurantType(repo?.type as RestaurantType);
          setRestaurantCategory(repo?.category as RestaurantCategory[]);
          setRestaurantWebsite(repo?.website as string);
          setDineInCapacity(repo?.dineInCapacity?.toString() ?? "");
          setBeverageCategory(repo?.beverageCategory as BeverageCategory[]);
          setFoodType(repo?.foodType as FoodType[]);
          setMeatType(repo?.meatType as MeatType);
          setAddressLine1(repo?.address?.addressLine1 as string);
          setAddressLine2(repo?.address?.addressLine2 as string);
          setCity(repo.address?.city.toString() ?? "");
          setZipcode(repo.address?.zipcode ?? 0);
          setState({
            id: repo?.address?.state?.stateId ?? "",
            value: repo?.address?.state?.stateName ?? "",
          });
          // setCords(repo?.);
          // setCords(repo?.address?.coordinate?.coordinates ?? [0, 0]);
          // setPlace(repo.address?.place);
          const coordinates = repo?.address?.coordinate?.coordinates;
          setCords(
            (coordinates && coordinates.length === 2
              ? coordinates
              : [0, 0]) as [number, number]
          );

          setPlace(repo.address?.place ?? { displayName: "", placeId: "" });

          setFacebookLink(repo?.socialInfo?.facebook ?? "");
          setInstagramLink(repo?.socialInfo?.instagram ?? "");
          setTimeZone({
            id: repo?.timezone?.timezoneId ?? "",
            value: repo?.timezone?.timezoneName ?? "",
          });
          setTwitterLink(repo?.socialInfo?.twitter ?? "");
          if (repo.availability && repo.availability?.length > 0) {
            const originalAvailability = reverseFormatAvailability(
              repo.availability
            );
            setAvailabilityHours(originalAvailability);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setLoading(false);
      }
    };

    const canUpdateRestaurant = hasAccess(
      permissions,
      PermissionTypeEnum.UpdateRestaurant
    );
    setCanUpdateBusinessDetails(canUpdateRestaurant);
    fetchRestaurantDetails();
  }, [permissions]);

  if (loading) {
    return <Loader />;
  }

  const contentList = canUpdateBusinessDetails
    ? [
        {
          id: "restaurantBasicInformation",
          title: "Restaurant Basic Information",
          Component: RestaurantBasicInformationEditForm,
        },
        {
          id: "restaurantAvailabilityDetails",
          title: "Restaurant Availability Information",
          Component: RestaurantEditAvailabilityForm,
        },
        {
          id: "restaurantAdditionalDetails",
          title: "Restaurant Additional Details",
          Component: RestaurantEditAdditionalDetails,
        },
      ]
    : [];

  return (
    <div className="text-black">
      {contentList.length > 0 ? (
        <MenuSection contentList={contentList} />
      ) : (
        <>{`You don't have access to see and update Restaurant Details`}</>
      )}
    </div>
  );
};

RestaurantSettings.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default RestaurantSettings;

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
      const { status, permissions } = response.meUser;

      const canAccessMenu = hasAccess(
        permissions,
        PermissionTypeEnum.UpdateRestaurant
      );
      if (!canAccessMenu) {
        return {
          redirect: {
            destination: "/500",
            permanent: false,
          },
        };
      }
      if (status === UserStatus.Active) {
        return {
          props: {
            repo: {},
          },
        };
      }
      const redirectResult = redirectPathFromStatus(status);

      return redirectResult;
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
