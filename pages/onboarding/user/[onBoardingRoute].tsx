import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/onboardingUserLayout";
import UserInfo from "@/components/modules/onboarding/UserInformation";

import UserLocation from "@/components/modules/onboarding/UserLocation";
import UserVerification from "@/components/modules/onboarding/UserVerification";
import Intro from "@/components/modules/onboarding/WelcomeUser";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

type HomePageProps = {
  repo: {
    pagePath: string;
    address: any;
    businessName: any;
    businessType: any;
    ein: any;
    employeeSize: any;
    estimatedRevenue: any;
  };
};

const OnboardingPage = ({ repo }: HomePageProps) => {
  const {
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setZipcode,
    setState,
    setbusinessType,
    setein,
    setemployeeSize,
    setbusinessName,
    setestimatedRevenue,
  } = useOnboardingStore();

  useEffect(() => {
    setbusinessName(repo.businessName);
    setbusinessType(repo.businessType);
    setein(repo.ein);
    setemployeeSize(repo.employeeSize);
    setestimatedRevenue(repo.estimatedRevenue);
    setAddressLine1(repo.address?.addressLine1);
    setAddressLine2(repo.address?.addressLine2);
    setCity(repo.address?.city);
    setCords(repo?.address?.coordinate?.coordinates ?? []);
    setPlace(repo?.address?.place);
    setZipcode(repo.address?.zipcode);
    setState({
      id: repo?.address?.state?.stateId ?? "",
      value: repo?.address?.state?.stateName ?? "",
    });
  }, [
    repo,
    setbusinessType,
    setein,
    setemployeeSize,
    setestimatedRevenue,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setZipcode,
    setState,
  ]);

  let childComponent;

  switch (repo.pagePath) {
    case "intro":
      childComponent = <Intro />;
      break;
    case "user-info":
      childComponent = <UserInfo />;
      break;
    case "user-location":
      childComponent = <UserLocation />;
      break;
    case "user-verification":
      childComponent = <UserVerification />;
      break;

    default:
      childComponent = <NotFound />;
      break;
  }

  return <OnboardingLayout>{childComponent}</OnboardingLayout>;
};

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
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
    const response = await sdk.businessOnboardingDetails(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.businessOnboardingDetails) {
      const {
        address,
        businessType,
        ein,
        employeeSize,
        estimatedRevenue,
        businessName,
      } = response.businessOnboardingDetails;
      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
            businessType,
            businessName,
            ein,
            employeeSize,
            estimatedRevenue,
            address,
          },
        },
      };
    } else if (response.businessOnboardingDetails === null) {
      return {
        props: {
          repo: {
            pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
            businessType: null,
            ein: null,
            businessName: null,
            employeeSize: null,
            estimatedRevenue: null,
            address: null,
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
    // console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
