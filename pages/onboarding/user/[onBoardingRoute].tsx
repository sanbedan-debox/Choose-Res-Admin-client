import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";

import UserInfo from "@/components/modules/onboarding/userInfo";
import UserLocation from "@/components/modules/onboarding/UserLocation";
import UserVerification from "@/components/modules/onboarding/UserVerification";
import Intro from "@/components/modules/onboarding/welcome";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

type HomePageProps = {
  repo: {
    pagePath: string;
    // businessName: string;
    // businessType: string;
    // ein: string;
    // dob: string;
    // employeeSize: string;
    // establishedAt: string;
    // estimatedRevenue: string;
    // ssn: string;
    // address: string;
  };
};

const OnboardingPage = ({ repo: { pagePath } }: HomePageProps) => {
  const router = useRouter();
  // const { onBoardingRoute } = router.query;

  let childComponent;

  switch (pagePath) {
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

    // case "integrations":
    //   childComponent = <Integrations />;
    //   break;
    // case "availibility":
    //   childComponent = <Availability />;
    //   break;

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
        ssn,
      } = response.getUserOnboardingDetails;
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
            ssn,
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
