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
    beverageCategory: [BeverageCategory];
    brandingLogo: string;
    category: [RestaurantCategory];
    foodType: [FoodType];
    meatType: MeatType;
    name: any;
    timezone: any;
    type: any;
    dineInCapacity: any;
    socialInfo: any;
    website: any;
  };
};
const OnboardingPage = ({ repo }: HomePageProps) => {
  const {
    setBeverageCategory,
    setDineInCapacity,
    setFoodType,
    setFacebookLink,
    setInstagramLink,
    setMeatType,
    setRestaurantCategory,
    setRestaurantName,
    setRestaurantType,
    setRestaurantWebsite,
    setTwitterLink,
  } = RestaurantOnboardingStore();
  // useEffect(() => {
  //   setbusinessName(repo.businessName);
  //   setbusinessType(repo.businessType);
  //   setdob(repo.dob);
  //   setein(repo.ein);
  //   setemployeeSize(repo.employeeSize);
  //   setestablishedAt(repo.establishedAt);
  //   setestimatedRevenue(repo.estimatedRevenue);
  //   setAddressLine1(repo.address?.addressLine1?.value);
  //   setAddressLine2(repo.address?.addressLine2?.value);
  //   setCity(repo.address?.city?.value);

  //   setPostcode(repo.address?.postcode?.value);
  //   setState(repo.address?.state?.value);
  // }, [repo]);

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
  let id = "";

  try {
    const restaurantData = RestaurantOnboardingStore();
    if (restaurantData) {
      id = restaurantData.id; // Assign id from RestaurantOnboardingStore
    }
  } catch (error) {
    console.error("Error retrieving restaurant data:", error);
  }

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
    if (!id) {
      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
          },
        },
      };
    }

    const response = await sdk.getRestaurantOnboardingData(
      { id },
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
      } = response.getRestaurantOnboardingData;

      console.log(response.getRestaurantOnboardingData);

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
          },
        },
      };
    } else {
      // Handle case where response or required details are not available
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
