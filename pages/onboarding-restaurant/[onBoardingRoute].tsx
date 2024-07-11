import NotFound from "@/components/common/notFound/notFound";
import OnboardingRestaurantLayout from "@/components/layouts/OnboardingRestaurantLayout";
import RestaurantAvailibility from "@/components/modules/onboarding/RestaurantAvailibility";
import RestaurantBasicInformation from "@/components/modules/onboarding/RestaurantBasicInformation";
import WelcomeRestaurantOnboarding from "@/components/modules/onboarding/WelcomeRestaurantOnboarding";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";

import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import RestaurantAdditionalInformation from "@/components/modules/onboarding/RestaurantAdditionalInfo";
import RestaurantOnboardingStore from "@/store/restaurantOnboarding";
import {
  BeverageCategory,
  FoodType,
  MeatType,
  RestaurantCategory,
} from "@/generated/graphql";

type HomePageProps = {
  repo: {
    pagePath: string;
    address: any;
    beverageCategory: any;
    brandingLogo: any;
    category: any;
    foodType: any;
    meatType: any;
    name: any;
    timezone: any;
    type: any;
    dineInCapacity: any;
    socialInfo: any;
    website: any;
    availability: any;
  };
};
const OnboardingPage = ({ repo }: HomePageProps) => {
  const {
    setAddressLine1,
    setAddressLine2,
    setBeverageCategory,
    setCity,
    setCords,
    setDineInCapacity,
    setFacebookLink,
    setFoodType,
    setInstagramLink,
    setMeatType,
    setPlace,
    setPostcode,
    setRestaurantCategory,
    setRestaurantName,
    setRestaurantType,
    setRestaurantWebsite,
    setState,
    setTimeZone,
    setTwitterLink,
    setAvailabilityHours,
  } = RestaurantOnboardingStore();
  useEffect(() => {
    setRestaurantName(repo?.name?.value);
    setRestaurantType(repo?.type);
    setRestaurantCategory(repo?.category);
    setRestaurantWebsite(repo?.website);
    setDineInCapacity(repo?.dineInCapacity?.value);
    setBeverageCategory(repo?.beverageCategory as BeverageCategory);
    setFoodType(repo?.foodType as FoodType);
    setMeatType(repo?.meatType as MeatType);
    setAddressLine1(repo?.address?.addressLine1?.value);
    setAddressLine2(repo?.address?.addressLine1?.value);
    setCity(repo.address?.city?.value);
    setPostcode(repo.address?.postcode?.value);
    setState(repo.address?.state?.value);
    setCords(repo?.address?.coordinate?.coordinates ?? []);
    setPlace(repo.address?.place);
    setFacebookLink(repo?.socialInfo?.facebook);
    setInstagramLink(repo?.socialInfo?.instagram);
    setTimeZone(repo?.timezone);
    setTwitterLink(repo?.socialInfo?.twitter);
    setAvailabilityHours(repo?.availability);
  }, [repo]);

  let childComponent;

  switch (repo.pagePath) {
    case "restaurant-welcome":
      childComponent = <WelcomeRestaurantOnboarding />;
      break;
    case "restaurant-basic-information":
      childComponent = <RestaurantBasicInformation />;
      break;
    case "restaurant-availibility":
      childComponent = <RestaurantAvailibility />;
      break;
    case "restaurant-additional-info":
      childComponent = <RestaurantAdditionalInformation />;
      break;

    default:
      childComponent = <NotFound />;
      break;
  }

  return (
    <OnboardingRestaurantLayout>{childComponent}</OnboardingRestaurantLayout>
  );
};

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
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
    const res_id = cookies.restaurant_onboarding_id;
    if (!res_id) {
      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
          },
        },
      };
    }

    const response = await sdk.getRestaurantOnboardingData(
      { id: res_id },
      { cookie: context.req.headers.cookie?.toString() ?? "" }
    );

    if (response && response.getRestaurantOnboardingData) {
      const {
        address,
        beverageCategory,
        brandingLogo,
        category,
        foodType,
        meatType,
        name,
        timezone,
        type,
        dineInCapacity,
        socialInfo,
        website,
        availability,
      } = response.getRestaurantOnboardingData;

      console.log(response.getRestaurantOnboardingData.availability);

      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
            address,
            beverageCategory,
            brandingLogo,
            category,
            foodType,
            meatType,
            name,
            timezone,
            type,
            dineInCapacity,
            socialInfo,
            website,
            availability,
          },
        },
      };
    } else {
      console.error("Failed to fetch user details:", response);
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
