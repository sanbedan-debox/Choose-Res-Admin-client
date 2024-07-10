import NotFound from "@/components/common/notFound/notFound";
import OnboardingRestaurantLayout from "@/components/layouts/OnboardingRestaurantLayout";
import RestaurantAvailibility from "@/components/modules/onboarding/RestaurantAvailibility";
import RestaurantInfo from "@/components/modules/onboarding/RestaurantBasicInfo";
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
    case "restaurant-location":
      childComponent = <RestaurantLocation />;
      break;
    case "restaurant-availibility":
      childComponent = <RestaurantAvailibility />;
      break;
    case "restaurant-info":
      childComponent = <RestaurantInfo />;
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
