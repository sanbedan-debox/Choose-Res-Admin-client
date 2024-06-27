import NotFound from "@/components/common/notFound/notFound";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import Availability from "@/components/modules/onboarding/Availibility";
import Integrations from "@/components/modules/onboarding/Integrations";
import Locations from "@/components/modules/onboarding/Location";
import Next from "@/components/modules/onboarding/next";
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
    case "info":
      childComponent = <Next />;
      break;
    case "location":
      childComponent = <Locations />;
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
