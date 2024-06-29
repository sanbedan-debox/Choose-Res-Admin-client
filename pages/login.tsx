// import { FC, useState, useEffect } from "react";
// import Image from "next/image";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { useRouter } from "next/router";
// import useGlobalStore from "@/store/global";
// import ReusableModal from "@/components/common/modal/modal";
// import { sdk } from "@/utils/graphqlClient";
// import logo1 from "../assets/logo/logoDark.png";

// interface IFormInput {
//   email: string;
//   otp?: string;
//   acknowledge: boolean; // New field for acknowledgment checkbox
// }

// const Login: FC = () => {
//   const router = useRouter();
//   const { setToastData } = useGlobalStore();
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [otp, setOtp] = useState<string>("");
//   const [otpError, setOtpError] = useState<string>("");
//   const [timer, setTimer] = useState<number>(50);
//   const [otpKey, setOtpKey] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [acknowledge, setAcknowledge] = useState<boolean>(false); // State for acknowledgment checkbox

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>();

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   const startTimer = () => {
//     setTimer(50);
//   };

//   const handleResendOtp = async () => {
//     try {
//       const response = await sdk.GenerateOtpForLogin({ input: email });

//       if (response) {
//         setOtpKey(response.generateOtpForLogin);
//         startTimer();
//         setToastData({ message: "OTP resent successfully", type: "success" });
//       }
//     } catch (error) {
//       console.error("Failed to resend OTP:", error);
//       setToastData({ message: "Failed to resend OTP", type: "error" });
//     }
//   };

//   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
//     const { email } = data;
//     setEmail(email);
//     try {
//       const response = await sdk.GenerateOtpForLogin({ input: email });

//       if (response) {
//         setOtpKey(response.generateOtpForLogin);
//         setShowModal(true);
//         startTimer();
//         setToastData({ message: "OTP sent successfully", type: "success" });
//       }
//     } catch (error) {
//       console.error("Failed to generate OTP:", error);
//       setToastData({ message: "Failed to generate OTP", type: "error" });
//     }
//   };

//   const onSubmitOtp: SubmitHandler<IFormInput> = async () => {
//     try {
//       const variables = {
//         key: otpKey,
//         input: email,
//         otp: otp,
//       };

//       const response = await sdk.VerifyOtpForLogin(variables);

//       if (response) {
//         setShowModal(false);
//         setToastData({
//           message: "OTP verification successful",
//           type: "success",
//         });
//         router.replace("/");
//       }
//     } catch (error) {
//       console.error("OTP verification failed:", error);
//       setOtpError("Invalid OTP");
//     }
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setAcknowledge(e.target.checked);
//   };

//   return (
//     <>
//       <div className="bg-white">
//         <div className="flex justify-center h-screen">
//           <div
//             className="hidden bg-cover lg:block lg:w-2/3"
//             style={{
//               backgroundImage:
//                 "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
//             }}
//           >
//             <div className="flex items-end h-full px-20 bg-black bg-opacity-50">
//               <div className="mb-20">
//                 <h2 className="text-4xl font-bold text-white">CHOOSE</h2>
//                 <p className="max-w-xl mt-3 text-neutral-400">
//                   Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
//                   autem ipsa, nulla laboriosam dolores, repellendus perferendis
//                   libero suscipit nam temporibus molestiae.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
//             <div className="flex-1">
//               <div className="text-center">
//                 <div className="relative z-10 flex items-center gap-16 justify-center">
//                   <Image className="mb-4" src={logo1} alt="Logo" width={200} />
//                 </div>
//                 <p className="mt-3 text-gray-800">
//                   Sign in to access your account
//                 </p>
//               </div>

//               <div className="mt-8">
//                 <form
//                   className="space-y-4 md:space-y-6"
//                   onSubmit={handleSubmit(onSubmit)}
//                 >
//                   <div className="col-span-2">
//                     <label
//                       htmlFor="email"
//                       className="block mb-2 text-sm font-medium text-black"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       {...register("email", {
//                         required: "Email is required",
//                         pattern: {
//                           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                           message: "Invalid email address",
//                         },
//                       })}
//                       id="email"
//                       className=" input input-primary"
//                       placeholder="Enter your Email Address"
//                     />
//                     {errors.email && (
//                       <p className="text-red-500 text-sm">
//                         {errors.email.message}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       {...register("acknowledge", { required: true })}
//                       id="acknowledge"
//                       className="mr-2 checkbox checkbox-primary"
//                       onChange={handleCheckboxChange}
//                     />
//                     <label
//                       htmlFor="acknowledge"
//                       className="text-sm text-gray-800"
//                     >
//                       By Ticking you are confirming that you have read
//                       understood and agree to CHOOSE{" "}
//                       <a
//                         href="/signup"
//                         className="text-primary focus:outline-none focus:underline hover:underline"
//                       >
//                         Terms and Condiition
//                       </a>
//                     </label>
//                   </div>
//                   <div className="flex justify-end">
//                     <button className="btn btn-primary" disabled={!acknowledge}>
//                       Log in
//                     </button>
//                   </div>
//                 </form>

//                 <p className="mt-6 text-sm text-center text-gray-800">
//                   Don't have an account yet?{" "}
//                   <a
//                     href="/signup"
//                     className="text-primary focus:outline-none focus:underline hover:underline"
//                   >
//                     Sign up
//                   </a>
//                   .
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ReusableModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title="Enter OTP"
//         width="md"
//       >
//         <form onSubmit={handleSubmit(onSubmitOtp)}>
//           <div className="flex flex-col space-y-4">
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="input input-primary"
//               placeholder="Enter OTP"
//             />
//             {otpError && <p className="text-red-500">{otpError}</p>}
//             <div className="flex items-center justify-between">
//               <button
//                 type="button"
//                 className="text-sm text-blue-500 focus:outline-none hover:underline"
//                 onClick={handleResendOtp}
//                 disabled={timer !== 0}
//               >
//                 Resend OTP
//               </button>
//               {timer > 0 && <p>Time remaining: {timer} seconds</p>}
//             </div>

//             <button className="btn btn-primary">Submit</button>
//           </div>
//         </form>
//       </ReusableModal>
//     </>
//   );
// };

// export default Login;

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import ReusableModal from "@/components/common/modal/modal";
import { sdk } from "@/utils/graphqlClient";
import logo1 from "../assets/logo/logoDark.png";

interface IFormInput {
  email: string;
  otp?: string;
}

const Login: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [timer, setTimer] = useState<number>(50);
  const [otpKey, setOtpKey] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    setTimer(50);
  };

  const handleResendOtp = async () => {
    try {
      const response = await sdk.GenerateOtpForLogin({ input: email });

      if (response) {
        setOtpKey(response.generateOtpForLogin);
        startTimer();
        setToastData({ message: "OTP resent successfully", type: "success" });
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setToastData({ message: "Failed to resend OTP", type: "error" });
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email } = data;
    setEmail(email);
    try {
      const response = await sdk.GenerateOtpForLogin({ input: email });

      if (response) {
        setOtpKey(response.generateOtpForLogin);
        setShowModal(true);
        startTimer();
        setToastData({ message: "OTP sent successfully", type: "success" });
      }
    } catch (error) {
      console.error("Failed to generate OTP:", error);
      setToastData({ message: "Failed to generate OTP", type: "error" });
    }
  };

  const onSubmitOtp: SubmitHandler<IFormInput> = async () => {
    try {
      const variables = {
        key: otpKey,
        input: email,
        otp: otp,
      };

      const response = await sdk.VerifyOtpForLogin(variables);

      if (response) {
        setShowModal(false);
        setToastData({
          message: "OTP verification successful",
          type: "success",
        });
        router.replace("/");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError("Invalid OTP");
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            }}
          >
            <div className="flex items-end h-full px-20 bg-black bg-opacity-55">
              <div className="mb-20">
                <h2 className="text-4xl font-bold text-white">CHOOSE</h2>
                <p className="max-w-xl mt-3 text-neutral-400">
                  Built along with Restaurant Owners, Marketers, Technology
                  Experts to revolutionise the Restaurant space.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="relative z-10 flex items-center gap-16 justify-center">
                  <Image className="mb-4" src={logo1} alt="Logo" width={200} />
                </div>
                <p className="mt-3 text-gray-800">
                  Sign in to access your account
                </p>
              </div>

              <div className="mt-8">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      id="email"
                      className="input input-primary"
                      placeholder="Enter your Email Address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">
                    By logging in, you agree to CHOOSE{" "}
                    <a
                      href="/signup"
                      className="text-primary focus:outline-none focus:underline hover:underline"
                    >
                      Terms and Conditions
                    </a>
                  </p>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Log in</button>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-800">
                  Don't have an account yet?{" "}
                  <a
                    href="/signup"
                    className="text-primary focus:outline-none focus:underline hover:underline"
                  >
                    Sign up
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReusableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Enter OTP"
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-primary"
              placeholder="Enter OTP"
            />
            {otpError && <p className="text-red-500">{otpError}</p>}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-blue-500 focus:outline-none hover:underline"
                onClick={handleResendOtp}
                disabled={timer !== 0}
              >
                Resend OTP
              </button>
              {timer > 0 && <p>Time remaining: {timer} seconds</p>}
            </div>

            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Login;
