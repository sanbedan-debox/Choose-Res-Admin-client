// import { motion } from "framer-motion";
// import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
// import Image from "next/image";
// import logo1 from "../../../assets/logo/logoWhite.png";
// import { useRouter } from "next/router";
// import {
//   File as DocumentIcon,
//   Presentation as PresentationChartBarIcon,
// } from "lucide-react";
// import CButton from "@/components/common/button/button";
// import { ButtonType } from "@/components/common/button/interface";
// import { CommunicationType } from "@/generated/graphql";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { sdk } from "@/utils/graphqlClient";
// import useGlobalStore from "@/store/global";

// interface IFormInput {
//   name: string;
//   address: string;
//   state: string;
//   city: string;
// }

// const Locations = () => {
//   const { setToastData } = useGlobalStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>();
//   const router = useRouter();

//   return (
//     <motion.div
//       className="z-10 flex flex-col items-center space-y-5 text-center "
//       variants={{
//         hidden: { opacity: 0, scale: 0.95 },
//         show: {
//           opacity: 1,
//           scale: 1,
//           transition: { staggerChildren: 0.2 },
//         },
//       }}
//       initial="hidden"
//       animate="show"
//       exit="hidden"
//       transition={{ duration: 0.3, type: "spring" }}
//     >
//       <motion.div
//         variants={STAGGER_CHILD_VARIANTS}
//         className="flex flex-col items-center space-y-5 text-center"
//       >
//         <div className="relative z-10 flex items-center justify-center my-4">
//           <Image className="mb-4" src={logo1} alt="Logo" width={200} />
//         </div>
//         <h1 className="font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl">
//           Okay Lets start with Basic Restaurant Information
//         </h1>
//       </motion.div>

//       <form
//         className="space-y-4 md:space-y-3 w-full max-w-2xl"
//         // onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="col-span-2">
//           <label
//             htmlFor="name"
//             className="block mb-2 text-sm font-medium text-left text-white"
//           >
//             Restaurant Name
//           </label>
//           <input
//             type="name"
//             {...register("name", {
//               required: "Restaurant name is required",
//             })}
//             id="name"
//             className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-transparent"
//             placeholder="Enter your Restaurant Name"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm">{errors.name.message}</p>
//           )}
//         </div>
//         <div className="col-span-2">
//           <label
//             htmlFor="address"
//             className="block mb-2 text-sm font-medium text-left text-white"
//           >
//             Address
//           </label>
//           <input
//             type="address"
//             {...register("address", {
//               required: "Address is required",
//             })}
//             id="email"
//             className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-transparent"
//             placeholder="Enter your Email"
//           />
//           {errors.address && (
//             <p className="text-red-500 text-sm">{errors.address.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label
//             htmlFor="phone"
//             className="block mb-2 text-sm font-medium text-left text-white"
//           >
//             State
//           </label>
//           <input
//             type="text"
//             {...register("state", {
//               required: "Phone number is required",
//             })}
//             id="phone"
//             className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-transparent"
//             placeholder="Enter your State"
//           />
//           {errors.state && (
//             <p className="text-red-500 text-sm">{errors.state.message}</p>
//           )}
//         </div>
//         <div className="col-span-2">
//           <label
//             htmlFor="city"
//             className="block mb-2 text-sm font-medium text-left text-white"
//           >
//             City
//           </label>
//           <input
//             type="text"
//             {...register("city", {
//               required: "Phone number is required",
//             })}
//             id="city"
//             className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-transparent"
//             placeholder="Enter your City"
//           />
//           {errors.city && (
//             <p className="text-red-500 text-sm">{errors.city.message}</p>
//           )}
//         </div>

//         <div className="flex justify-center">
//           <CButton
//             onClick={() => router.push("/onboarding/location")}
//             type={ButtonType.Primary}
//           >
//             Continue
//           </CButton>
//         </div>
//       </form>

//       <motion.div variants={STAGGER_CHILD_VARIANTS} className="text-center">
//         <h1>There are just a few steps to go..... :)</h1>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Locations;

import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import Image from "next/image";
import logo1 from "../../../assets/logo/logoWhite.png";
import { useRouter } from "next/router";
import {
  File as DocumentIcon,
  Presentation as PresentationChartBarIcon,
} from "lucide-react";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";

const Locations = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();

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
        <h1 className="font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl">
          Which document do you want to share today?
        </h1>
      </motion.div>

      <div className="w-full max-w-2xl p-4 bg-secondary bg-opacity-30 rounded-lg">
        <h2 className="text-lg font-medium text-left text-white mb-2">
          Select your location from the map
        </h2>
        <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
          {/* Placeholder for the map */}
          <p className="text-gray-700">Map Placeholder</p>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <CButton
          onClick={() => router.push("/onboarding/integrations")}
          type={ButtonType.Primary}
        >
          Continue
        </CButton>
      </div>

      <motion.div variants={STAGGER_CHILD_VARIANTS} className="text-center">
        <h1>There are just a few steps to go..... :)</h1>
      </motion.div>
    </motion.div>
  );
};

export default Locations;
