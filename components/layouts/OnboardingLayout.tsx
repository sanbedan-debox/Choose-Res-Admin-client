// import { ReactNode } from "react";
// import { useRouter } from "next/router";
// import { AnimatePresence } from "framer-motion";
// import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
// import CButton from "@/components/common/button/button";
// import { ButtonType } from "@/components/common/button/interface";

// type Props = {
//   children: ReactNode;
// };

// const OnboardingLayout = ({ children }: Props) => {
//   const router = useRouter();
//   const { pathname } = router;

//   const handleBackClick = () => {
//     router.back();
//   };

//   const handleSkipClick = () => {
//     router.push("/documents");
//   };

//   const renderHeaderActions = () => {
//     if (pathname === "/onboarding/welcome") {
//       return (
//         <>
//           <button
//             className="group absolute left-2 top-10 z-40 rounded-lg p-2 transition-all hover:bg-primary hover:text-white sm:left-10"
//             onClick={handleBackClick}
//           >
//             <ArrowLeftIcon className="h-8 w-8 text-gray-500 group-hover:text-white group-active:scale-90" />
//           </button>
//           <CButton
//             type={ButtonType.Primary}
//             onClick={handleSkipClick}
//             className="absolute right-2 top-10 z-40 p-2 text-muted-foreground sm:right-10"
//           >
//             Skip to dashboard
//           </CButton>
//         </>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center overflow-x-hidden">
//       <div
//         className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
//         aria-hidden="true"
//       >
//         <div
//           className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-secondary to-primary opacity-20"
//           style={{
//             clipPath:
//               "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
//           }}
//         />
//       </div>
//       {renderHeaderActions()}
//       <AnimatePresence mode="wait">{children}</AnimatePresence>
//     </div>
//   );
// };

// export default OnboardingLayout;

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

type Props = {
  children: ReactNode;
};

const OnboardingLayout = ({ children }: Props) => {
  const router = useRouter();
  const { pathname } = router;

  const handleBackClick = () => {
    router.back();
  };

  const handleSkipClick = () => {
    router.push("/documents");
  };

  const hideBackButtonPaths = ["/onboarding/welcome", "/onboarding/intro"];
  const showBackButton = !hideBackButtonPaths.includes(pathname);

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center overflow-x-hidden">
      <div
        className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-secondary to-primary opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      {/* Conditionally render back button */}
      {showBackButton && (
        <button
          className="group absolute left-2 top-10 z-40 rounded-lg p-2 transition-all hover:bg-primary hover:text-white sm:left-10"
          onClick={handleBackClick}
        >
          <ArrowLeftIcon className="h-8 w-8 text-gray-500 group-hover:text-white group-active:scale-90" />
        </button>
      )}
      {/* Conditional rendering of skip button */}
      {pathname === "/onboarding/welcome" && (
        <CButton
          type={ButtonType.Primary}
          onClick={handleSkipClick}
          className="absolute right-2 top-10 z-40 p-2 text-muted-foreground sm:right-10"
        >
          Skip to dashboard
        </CButton>
      )}
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </div>
  );
};

export default OnboardingLayout;
