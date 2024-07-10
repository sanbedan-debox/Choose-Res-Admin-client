import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import ReusableModal from "@/components/common/modal/modal";
import { sdk } from "@/utils/graphqlClient";
import logo1 from "../assets/logo/logoDark.png";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { UserStatus } from "@/generated/graphql";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

interface IFormInput {
  email: string;
  otp?: string;
}

export enum UserOnboardingStatusMessage {
  completed = "Account Completed",
  // active = "active",
  blocked = "Your account is blocked.",
  paymentPending = "Your payment details are pending.",
  internalVerificationPending = "Verification pending.",
  onboardingPending = "Your onboarding details are pending",
  restaurantOnboardingPending = "Restaurant onboarding pending",
}
const Login: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpKey, setOtpKey] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleResendOtp = async () => {
    try {
      const response = await sdk.GenerateOtpForLogin({ input: email });

      if (response) {
        setOtpKey(response.generateOtpForLogin);
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
        router.replace("/dashboard");
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
                      <p className="text-red-500 text-sm text-start">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">
                    {`By logging in, you agree to CHOOSE's`}{" "}
                    <Link
                      href="/signup"
                      className="text-primary focus:outline-none focus:underline hover:underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/signup"
                      className="text-primary focus:outline-none focus:underline hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                  <div className="flex justify-end ">
                    <CButton variant={ButtonType.Primary} className=" w-full">
                      Log in
                    </CButton>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-800">
                  {`Don't have an account yet?`}{" "}
                  <Link
                    href="/signup"
                    className="text-primary focus:outline-none focus:underline hover:underline"
                  >
                    Sign up
                  </Link>
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
          <div className="flex flex-col ">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-primary mb-8"
              placeholder="Enter OTP"
            />
            {otpError && <p className="text-red-500">{otpError}</p>}
            {/* <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-blue-500 focus:outline-none hover:underline"
                onClick={handleResendOtp}
                disabled={timer !== 0}
              >
                Resend OTP
              </button>
              {timer > 0 && <p>Time remaining: {timer} seconds</p>}
            </div> */}

            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken;

  if (!token) {
    return {
      props: {},
    };
  }

  try {
    const response = await sdk.MeUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return {
      props: {},
    };
  }
};
