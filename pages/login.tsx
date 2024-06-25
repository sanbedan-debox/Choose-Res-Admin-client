import { FC, useState, useEffect } from "react";
import logo1 from "../assets/logo/logoWhite.png";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import ReusableModal from "@/components/common/modal/modal";
import { sdk } from "@/utils/graphqlClient";

interface IFormInput {
  email: string;
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
      const response = await sdk.GenerateOtpForLogin({
        input: email,
      });

      if (response) {
        setOtpKey(response.generateOtpForLogin);
        startTimer();
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
      const response = await sdk.GenerateOtpForLogin({
        input: email,
      });

      if (response) {
        setOtpKey(response.generateOtpForLogin);

        setShowModal(true);
        startTimer();
      }
    } catch (error) {
      console.error("Failed to generate OTP:", error);
      setToastData({ message: "Failed to generate OTP", type: "error" });
    }
  };

  const onSubmitOtp: SubmitHandler<IFormInput> = async () => {
    try {
      const variables: VerifyOtpForLoginMutationVariables = {
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
      <div
        style={{
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
        className=""
      >
        <div className="bg-dot-white/[0.12] md:bg-dot-white/[0.15]">
          <div className="flex justify-center h-screen">
            <div className="hidden bg-cover lg:block lg:w-2/3">
              <div className="flex items-end h-full px-20 bg-gray-900 bg-opacity-40">
                <div className="mb-20">
                  <h2 className="text-4xl font-bold text-white">CHOOSE</h2>
                  <p className="max-w-xl mt-3 text-gray-300">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                    autem ipsa, nulla laboriosam dolores, repellendus
                    perferendis libero suscipit nam temporibus molestiae.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1">
                <div className="text-center">
                  <div className="relative z-10 flex items-center gap-16 justify-center">
                    <Image
                      className="mb-4"
                      src={logo1}
                      alt="Logo"
                      width={200}
                    />
                  </div>
                  <p className="mt-3  text-gray-300">
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
                        className="block mb-2 text-sm font-medium text-white"
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
                        className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your Email Address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 rounded-md text-white font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      >
                        Get OTP
                      </button>
                    </div>
                  </form>

                  <p className="mt-6 text-sm text-center text-gray-400">
                    Don&#x27;t have an account yet?{" "}
                    <a
                      href="/signup"
                      className="text-blue-500 focus:outline-none focus:underline hover:underline"
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
              className="p-2 border text-black border-gray-300 rounded-md"
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
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 rounded-md text-white font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Login;
