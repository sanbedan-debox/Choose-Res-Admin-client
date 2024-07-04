import NotFound from "@/components/common/notFound/notFound";
import OnboardingRestaurantLayout from "@/components/layouts/OnboardingRestaurantLayout";
import RestaurantLocation from "@/components/modules/onboarding/RestaurantLocation";

import { GetServerSideProps } from "next";

type HomePageProps = {
  repo: {
    pagePath: string;
  };
};

const OnboardingPage = ({ repo: { pagePath } }: HomePageProps) => {
  let childComponent;

  switch (pagePath) {
    case "restaurant":
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
