import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { useEffect } from "react";

const WelcomeRestaurantOnboarding = () => {
  const { setisVerificationToRestaurantAdd } = useGlobalStore();

  const fetchOnboardingjump = async () => {
    try {
      const res = await sdk.meUserInResOnboarding();

      if (res && res.meUser) {
        console.log(res);
        const { status } = res.meUser;
        if (status === "internalVerificationPending") {
          console.log(status);
          setisVerificationToRestaurantAdd(true);
        }
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };
  useEffect(() => {
    fetchOnboardingjump();
  }, []);

  const router = useRouter();
  const { isVerificationToRestaurantAdd } = useGlobalStore();
  const textheading = isVerificationToRestaurantAdd
    ? "Set up your restaurant till we verify your account"
    : "Congratulations Your account has been approved";
  const textbody = isVerificationToRestaurantAdd
    ? "Lets Set up your first Restaurant and proceed to verification status page"
    : "Lets Set up your first Restaurant and proceed to the dashboard";
  return (
    <motion.div
      className="w-full max-w-lg"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.2 } } }}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center space-y-10 text-center"
      >
        <motion.h1
          className="font-display text-4xl font-bold text-foreground transition-colors sm:text-4xl"
          variants={STAGGER_CHILD_VARIANTS}
        >
          {textheading}
        </motion.h1>
        <motion.p
          className="max-w-md text-accent-foreground/80 transition-colors sm:text-lg"
          variants={STAGGER_CHILD_VARIANTS}
        >
          {textbody}
        </motion.p>
        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <CButton
            variant={ButtonType.Primary}
            className="btn btn-primary"
            onClick={() =>
              router.push("/onboarding-restaurant/restaurant-basic-information")
            }
          >
            Add Restaurant
          </CButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeRestaurantOnboarding;
