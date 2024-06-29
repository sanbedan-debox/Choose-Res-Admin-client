import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { useRouter } from "next/router";

const Intro = () => {
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
          className="font-display text-4xl font-bold text-foreground transition-colors sm:text-5xl"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Welcome to <span className="font-bold tracking-tighter">CHOOSE</span>
        </motion.h1>
        <motion.p
          className="max-w-md text-accent-foreground/80 transition-colors sm:text-lg"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Built along with Restaurant Owners, Marketers, Technology Experts to
          revolutionise the Restaurant space.
        </motion.p>
        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <button
            // className="px-10 text-base font-medium"
            className="btn btn-primary"
            onClick={() => router.push("/onboarding/user-info")}
          >
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Intro;
