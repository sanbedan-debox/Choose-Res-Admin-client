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

type HomePageProps = {
  repo: {
    pagePath: string;
    address: any;
    businessName: any;
    businessType: any;
    ein: any;
    dob: any;
    employeeSize: any;
    establishedAt: any;
    estimatedRevenue: any;
    ssn: any;
  };
};
const OnboardingPage = ({ repo }: HomePageProps) => {
  const {
    setAddressLine1,
    setAddressLine2,
    setCity,
    setPostcode,
    setState,
    setbusinessName,
    setbusinessType,
    setdob,
    setein,
    setemployeeSize,
    setestablishedAt,
    setestimatedRevenue,
  } = useOnboardingStore();
  useEffect(() => {
    setbusinessName(repo.businessName);
    setbusinessType(repo.businessType);
    setdob(repo.dob);
    setein(repo.ein);
    setemployeeSize(repo.employeeSize);
    setestablishedAt(repo.establishedAt);
    setestimatedRevenue(repo.estimatedRevenue);
    setAddressLine1(repo.address?.addressLine1?.value);
    setAddressLine2(repo.address?.addressLine2?.value);
    setCity(repo.address?.city?.value);

    setPostcode(repo.address?.postcode?.value);
    setState(repo.address?.state?.value);
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
    const response = await sdk.getUserOnboardingDetails(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.getUserOnboardingDetails) {
      const {
        address,
        businessName,
        businessType,
        ein,
        dob,
        employeeSize,
        establishedAt,
        estimatedRevenue,
      } = response.getUserOnboardingDetails;
      console.log(response.getUserOnboardingDetails);
      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
            businessName,
            businessType,
            ein,
            dob,
            employeeSize,
            establishedAt,
            estimatedRevenue,
            address,
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
