import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import OnboardingRestaurantLayout from "@/components/layouts/OnboardingRestaurantLayout";
import RestaurantLocation from "@/components/modules/onboarding/RestaurantLocation";

import Intro from "@/components/modules/onboarding/welcome";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

type HomePageProps = {
  repo: {
    pagePath: string;
  };
};

const OnboardingPage = ({ repo: { pagePath } }: HomePageProps) => {
  let childComponent;

  switch (pagePath) {
    case "res":
      childComponent = <RestaurantLocation />;
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
  return {
    props: {
      repo: {
        pagePath: context.query["onBoardingRoute"]?.toString() ?? "",
      },
    },
  };
};
