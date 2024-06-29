import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import Image from "next/image";
import logo1 from "../../../assets/logo/logoWhite.png";
import { useRouter } from "next/router";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";

const images = [
  "https://via.placeholder.com/40",
  "https://via.placeholder.com/40",
  "https://via.placeholder.com/40",
  "https://via.placeholder.com/40",
  "https://via.placeholder.com/40",
  "https://via.placeholder.com/40",
];

const titles = [
  "Title 1",
  "Title 2",
  "Title 3",
  "Title 4",
  "Title 5",
  "Title 6",
];

const Integrations = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();

  const handleClick = (title: string) => {
    console.log(title);
  };

  return (
    <motion.div
      className="z-10 flex flex-col items-center space-y-5 text-center"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-5 text-center"
      >
        <div className="relative z-10 flex items-center justify-center my-4">
          <Image className="mb-4" src={logo1} alt="Logo" width={200} />
        </div>
        <h1 className="font-display max-w-xl text-3xl font-semibold transition-colors sm:text-4xl">
          Integrate With any Software you are using currently
        </h1>
      </motion.div>

      <div className="w-full max-w-2xl rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => handleClick(titles[index])}
              className="cursor-pointer rounded-lg p-4 shadow-sm flex flex-col justify-center items-center transition-transform transform hover:scale-105"
              style={{
                boxShadow:
                  "0 4px 6px rgba(0, 123, 255, 0.2), 0 8px 12px rgba(0, 123, 255, 0.1)",
              }}
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-20 h-20 mb-2 rounded"
              />
              <p className="text-white">{titles[index]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => router.push("/onboarding/availibility")}
          className="btn btn-primary"
        >
          Continue
        </button>
      </div>

      <motion.div variants={STAGGER_CHILD_VARIANTS} className="text-center">
        <h1>There are just a few steps to go..... :)</h1>
      </motion.div>
    </motion.div>
  );
};

export default Integrations;
