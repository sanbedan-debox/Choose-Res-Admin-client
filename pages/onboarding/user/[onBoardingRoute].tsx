import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import UserInfo from "@/components/modules/onboarding/UserInformation";

import UserLocation from "@/components/modules/onboarding/UserLocation";
import UserVerification from "@/components/modules/onboarding/UserVerification";
import Intro from "@/components/modules/onboarding/WelcomeUser";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";

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
  };
};

const OnboardingPage = ({ repo }: HomePageProps) => {
  const router = useRouter();
  // const { onBoardingRoute } = router.query;
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
    setdob,
    setein,
    setemployeeSize,
    setestablishedAt,
    setestimatedRevenue,
  } = useOnboardingStore();

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
  //   setCords(repo?.address?.coordinate?.coordinates ?? []);
  //   setPlace(repo?.address?.place);

  //   setPostcode(repo.address?.postcode?.value);
  //   setState(repo.address?.state?.value);
  // }, [repo]);

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
    setCords(repo?.address?.coordinate?.coordinates ?? []);
    setPlace(repo?.address?.place);
    setPostcode(repo.address?.postcode?.value);
    setState(repo.address?.state?.value);
  }, [
    repo,
    setbusinessName,
    setbusinessType,
    setdob,
    setein,
    setemployeeSize,
    setestablishedAt,
    setestimatedRevenue,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setPostcode,
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
      console.log("ADDRESSS");

      console.log(response.getUserOnboardingDetails.address);
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
