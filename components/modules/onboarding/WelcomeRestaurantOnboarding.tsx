import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { useRouter } from "next/router";

const WelcomeRestaurantOnboarding = () => {
  const router = useRouter();

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
          Congratulations Your account has been approved
        </motion.h1>
        <motion.p
          className="max-w-md text-accent-foreground/80 transition-colors sm:text-lg"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Lets Set up your first Restaurant and proceed to the dashboard
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
