import { ReactNode } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import logo1 from "../../assets/logo/logoDark.png";

type Props = {
  children: ReactNode;
};

const steps = [
  "restaurant-welcome",
  "restaurant-basic-information",
  "restaurant-availibility",
  "restaurant-additional-info",
];

const OnboardingRestaurantLayout = ({ children }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { onBoardingRoute } = query;

  const handleBackClick = () => {
    router.back();
  };

  const hideBackButtonPaths = ["/onboarding/user/intro"];
  const showBackButton = !hideBackButtonPaths.includes(pathname);

  const currentStepIndex = steps.indexOf(onBoardingRoute as string);

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        {showBackButton && (
          <button
            className="group flex items-center space-x-2"
            onClick={handleBackClick}
          >
            <ArrowLeftIcon className="h-8 w-8 text-gray-500 group-hover:text-black" />
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <Image src={logo1} alt="Logo" width={140} height={140} />
        </div>
      </div>
      <div className="relative h-2 bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingRestaurantLayout;
