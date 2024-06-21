import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import Next from "@/components/modules/onboarding/next";
import Intro from "@/components/modules/onboarding/welcome";
import { useRouter } from "next/router";

const OnboardingPage = () => {
  const router = useRouter();
  const { onBordingRoute } = router.query;

  let childComponent;

  switch (onBordingRoute) {
    case "welcome":
      childComponent = <Intro />;
      break;
    case "info":
      childComponent = <Next />;
      break;
    // case "location":
    // childComponent = <Locations />;
    // break;
    // case "integrations":
    // childComponent = <Integrations />;
    // break;
    // case "status":
    //   childComponent = <StatusRes />;
    //   break;
    // case "menu":
    //   childComponent = <MenuIntegration />;
    //   break;
    // case "link":
    //   childComponent = <RestaurantLink />;
    //   break;
    default:
      childComponent = <Intro />;
      break;
  }

  return <OnboardingLayout>{childComponent}</OnboardingLayout>;
};

export default OnboardingPage;
