import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import logo1 from "../assets/logo/logoDark.png";

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
  const [email, setEmail] = useState<string>("");
  const [btnloading, setBtnLoading] = useState(false);
  const [timer, setTimer] = useState<number>(20);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [otpId, setOTPId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email } = data;
    setEmail(email);

    const isPhoneNumber = /^\d{10}$/.test(email);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isPhoneNumber && !isEmail) {
      setToastData({
        type: "error",
        message: "Please enter a valid email address or phone number",
      });
      return;
    }
    try {
      setBtnLoading(true);
      const response = await sdk.userLogin({ input: email });

      if (response.userLogin !== null) {
        setShowModal(true);
        if (response.userLogin !== "") {
          setToastData({ message: "OTP sent successfully", type: "success" });
        }
        setBtnLoading(false);
        setOTPId(response.userLogin);
        setTimer(20);
        setShowResendButton(false);

        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(countdown);
              setShowResendButton(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const resendOtp = async () => {
    await onSubmit({ email });
    setOtp("");
    setToastData({ message: "OTP Sent Successfully", type: "success" });
  };

  const onSubmitOtp: SubmitHandler<IFormInput> = async () => {
    try {
      setBtnLoading(true);

      const response = await sdk.userLoginVerification({
        input: {
          otpId: otpId,
          emailOrNumber: email,
          otp: otp,
        },
      });

      if (response && response.userLoginVerification) {
        setBtnLoading(false);

        setShowModal(false);
        setToastData({
          message: "Verification successful!",
          type: "success",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
      // reset();
      setOtp("");
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
                      Email or Mobile Number
                    </label>
                    <input
                      {...register("email", {
                        required: "Email or Mobile Number is required",
                      })}
                      id="email"
                      className="input input-primary"
                      placeholder="Enter your email or mobile number"
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
                    <CButton
                      loading={btnloading}
                      variant={ButtonType.Primary}
                      className=" w-full"
                    >
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
        title={otpId === "" ? "Enter Authenticator Code" : "Enter OTP"}
        width={otpId === "" ? "md" : "sm"}
      >
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <div className="flex flex-col">
            <div className="flex flex-col mt-3 mb-6">
              <input
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="input input-primary mb-1"
                placeholder="Enter verification code"
              />
              {otpId !== "" ? (
                <>
                  {showResendButton ? (
                    <button
                      type="button"
                      className="text-primary text-start focus:outline-none focus:underline hover:underline text-sm"
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {timer}s
                    </p>
                  )}
                </>
              ) : null}
            </div>

            <CButton
              loading={btnloading}
              variant={ButtonType.Primary}
              disabled={otp.length !== 6}
              className="btn btn-primary"
            >
              Submit
            </CButton>
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";
  // console.log(cookieHeader);

  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      props: {},
    };
  }

  try {
    const response = await sdk.MeCheckUser(
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
    return {
      props: {},
    };
  }
};
