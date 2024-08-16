import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
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
const journeySteps = steps.slice(1);

const OnboardingRestaurantLayout = ({ children }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { onBoardingRoute } = query;
  const { setToastData } = useGlobalStore();

  const { setMasterStates, setMasterTimezones } = useMasterStore();
  useEffect(() => {
    const fetch = async () => {
      try {
        const resstates = await sdk.getActiveStates();
        if (resstates && resstates.getActiveStates) {
          const formattedStates = resstates.getActiveStates.map(
            (state: { value: string; _id: string }) => ({
              value: state._id,
              label: state.value,
            })
          );
          setMasterStates(formattedStates);
        }
        const resTimeZones = await sdk.getActiveTimezones();
        if (resTimeZones && resTimeZones.getActiveTimezones) {
          const formattedTimeZones = resTimeZones.getActiveTimezones.map(
            (timeZone: { gmtOffset: number; value: string; _id: string }) => {
              const gmtOffsetHours = timeZone.gmtOffset / 3600;
              const sign = gmtOffsetHours >= 0 ? "+" : "-";
              const formattedLabel = `${timeZone.value} (GMT ${sign} ${Math.abs(
                gmtOffsetHours
              )})`;
              return {
                value: timeZone._id,
                label: formattedLabel,
              };
            }
          );
          setMasterTimezones(formattedTimeZones);
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetch();
  }, [setMasterStates, setMasterTimezones, setToastData]);

  const handleBackClick = () => {
    router.back();
  };

  const hideBackButtonPaths = ["/onboarding/user/intro"];
  const showBackButton = !hideBackButtonPaths.includes(pathname);

  const currentStepIndex = journeySteps.indexOf(onBoardingRoute as string);

  const progressPercentage =
    ((currentStepIndex + 1) / journeySteps.length) * 100;

  return (
    <div className="bg-white min-h-screen text-black flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {showBackButton && (
            <button
              className="group flex items-center space-x-2"
              onClick={handleBackClick}
            >
              <LuArrowLeft className="h-8 w-8 text-gray-500 group-hover:text-black" />
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <Image src={logo1} alt="Logo" width={140} height={140} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center w-full justify-between">
            {journeySteps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 text-sm text-center py-2 font-bold border-b-[1px] border-l-[1px] border-r-[1px] border-gray-300 ${
                  index <= currentStepIndex
                    ? "text-white bg-primary font-bold"
                    : "text-black"
                }`}
              >
                <p>
                  {index === 0
                    ? "Basic Information"
                    : index === 1
                    ? "Location"
                    : index === 2
                    ? "Additional Information"
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-grow flex pt-28 items-center justify-center p-4">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingRestaurantLayout;
