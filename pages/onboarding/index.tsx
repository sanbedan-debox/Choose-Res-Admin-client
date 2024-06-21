import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import Intro from "@/components/modules/onboarding/welcome";
import Next from "@/components/modules/onboarding/next";

export default function Welcome() {
  const router = useRouter();

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
      <AnimatePresence mode="wait">
        {router.query.type ? (
          <>
            <button
              className="group absolute left-2 top-10 z-40 rounded-lg p-2 transition-all hover:bg-primary hover:text-white sm:left-10"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-8 w-8 text-gray-500 group-hover:text-white group-active:scale-90" />
            </button>

            <CButton
              type={ButtonType.Primary}
              onClick={() => router.push("/documents")}
              className="absolute right-2 top-10 z-40 p-2 text-muted-foreground sm:right-10"
            >
              Skip to dashboard
            </CButton>
          </>
        ) : (
          <Intro key="intro" />
        )}
        {router.query.type === "next" && <Next key="next" />}
      </AnimatePresence>
    </div>
  );
}
