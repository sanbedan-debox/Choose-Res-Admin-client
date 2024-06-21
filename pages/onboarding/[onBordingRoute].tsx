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
    case "hello":
      childComponent = <Next />;
      break;
    default:
      childComponent = <Intro />;
      break;
  }

  return <OnboardingLayout>{childComponent}</OnboardingLayout>;
};

export default OnboardingPage;
