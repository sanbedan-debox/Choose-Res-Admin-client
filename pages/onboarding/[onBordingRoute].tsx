import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import Availability from "@/components/modules/onboarding/Availibility";
import Integrations from "@/components/modules/onboarding/Integrations";
import RestaurantLocation from "@/components/modules/onboarding/RestaurantLocation";
import UserInfo from "@/components/modules/onboarding/userInfo";
import UserLocation from "@/components/modules/onboarding/UserLocation";
import UserVerification from "@/components/modules/onboarding/UserVerification";
import Intro from "@/components/modules/onboarding/welcome";
import { useRouter } from "next/router";

const OnboardingPage = () => {
  const router = useRouter();
  const { onBordingRoute } = router.query;

  let childComponent;

  switch (onBordingRoute) {
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
    case "location":
      childComponent = <RestaurantLocation />;
      break;
    case "integrations":
      childComponent = <Integrations />;
      break;
    case "availibility":
      childComponent = <Availability />;
      break;
    default:
      childComponent = <NotFound />;
      break;
  }

  return <OnboardingLayout>{childComponent}</OnboardingLayout>;
};

export default OnboardingPage;
