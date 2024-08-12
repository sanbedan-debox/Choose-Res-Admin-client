import { FC, useEffect, useState } from "react";
import logo1 from "../assets/logo/logoDark.png";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { VerifyUserDetails, AddUserInput } from "@/generated/graphql";
import ReusableModal from "@/components/common/modal/modal";
import useAuthStore from "@/store/auth";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { extractErrorMessage } from "@/utils/utilFUncs";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";

enum CommunicationType {
  Email = "EMAIL",
  WhatsApp = "WHATSAPP",
}

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  commPref: CommunicationType[];
}

interface IOTPFormInput {
  emailOtp: string;
  numberOtp: string;
}

const Signup: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [commPref, setCommPref] = useState<CommunicationType[]>([]);
  const [emailOtpVerifyKey, setEmailOtpVerifyKey] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpWhatsApp, setOtpWhatsApp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [timer, setTimer] = useState<number>(20);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({});

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset,
  } = useForm<IOTPFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { firstName, lastName, email, phone, commPref = [] } = data;

    const accountPreferences = {
      email:
        Array.isArray(commPref) && commPref.includes(CommunicationType.Email),
      whatsApp:
        Array.isArray(commPref) &&
        commPref.includes(CommunicationType.WhatsApp),
    };
    const input: AddUserInput = {
      firstName,
      lastName,
      email,
      phone,
      accountPreferences,
    };

    try {
      const response = await sdk.addUser({ input });

      if (response && response.addUser) {
        setEmailOtpVerifyKey(response.addUser);
        setToastData({ message: "Signup Successful", type: "success" });

        setShowModal(true);
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
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const resendOtp = async () => {
    await onSubmit({ firstName, lastName, email, phone, commPref });
    reset();
    setOtpEmail("");
    setOtpWhatsApp("");
    setToastData({ message: "OTP has been sent", type: "success" });
  };

  const onSubmitOtp: SubmitHandler<IOTPFormInput> = async (data) => {
    const { emailOtp } = data;

    try {
      const input: VerifyUserDetails = {
        email,
        phone,
        emailOtp,
        firstName,
        lastName,
        emailOtpVerifyKey,
        accountPreferences: {
          email: commPref.includes(CommunicationType.Email),
          whatsApp: commPref.includes(CommunicationType.WhatsApp),
        },
      };

      const response = await sdk.verifyUserDetails({ input });

      if (response && response.verifyUserDetails) {
        setShowModal(false);
        setToastData({ message: "Verification Successful", type: "success" });
        router.replace("/onboarding/user/intro");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
      reset();
      setOtpEmail("");
      setOtpWhatsApp("");
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setShowResendButton(true);
    } else if (timer < 0) {
      setTimer(0);
    } else {
      setShowResendButton(false);
    }
  }, [timer]);

  useEffect(() => {
    setOtpEmail("");
    setOtpWhatsApp("");
  }, [showModal]);

  return (
    <div className="bg-white">
      <div className="flex justify-center h-screen">
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="relative z-10 flex items-center gap-16 justify-center">
                <Image className="mb-4" src={logo1} alt="Logo" width={200} />
              </div>
              <p className="mt-3 text-gray-900">
                Sign up to create your account
              </p>
            </div>

            <div className="mt-8">
              <form
                className="space-y-4 md:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="col-span-2">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First Name is required",
                    })}
                    id="firstName"
                    className="input input-primary"
                    placeholder="Enter your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last Name is required",
                    })}
                    id="lastName"
                    className="input input-primary"
                    placeholder="Enter your Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    style={{
                      appearance: "textfield",
                    }}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    id="phone"
                    className="input input-primary"
                    placeholder="Enter your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="commPref"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Communication Preferences
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value={CommunicationType.Email}
                        className="form-checkbox"
                        onChange={(e) => {
                          setCommPref((prev) => {
                            const updatedPrefs = e.target.checked
                              ? [...prev, CommunicationType.Email]
                              : prev.filter(
                                  (pref) => pref !== CommunicationType.Email
                                );
                            return updatedPrefs;
                          });
                        }}
                      />

                      <span className="ml-2 text-black">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value={CommunicationType.WhatsApp}
                        className="form-checkbox"
                        onChange={(e) => {
                          setCommPref((prev) => {
                            const updatedPrefs = e.target.checked
                              ? [...prev, CommunicationType.WhatsApp]
                              : prev.filter(
                                  (pref) => pref !== CommunicationType.WhatsApp
                                );
                            return updatedPrefs;
                          });
                        }}
                      />

                      <span className="ml-2 text-black">WhatsApp</span>
                    </label>
                  </div>
                </div>

                <p className="text-sm text-gray-800">
                  {`By signing up, you agree to CHOOSE's`}{" "}
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
                <div className="flex justify-end">
                  <CButton
                    className="w-full"
                    variant={ButtonType.Primary}
                    type="submit"
                  >
                    Sign Up
                  </CButton>
                </div>
              </form>
              <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary focus:outline-none focus:underline hover:underline"
                >
                  Login
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          <div className="flex items-end h-full px-20 bg-gray-900 bg-opacity-55">
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-white">CHOOSE</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Built along with Restaurant Owners, Marketers, Technology
                Experts to revolutionise the Restaurant space.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ReusableModal
          title="Enter OTP"
          width="sm"
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        >
          <form onSubmit={handleSubmitOtp(onSubmitOtp)}>
            <div>
              <label
                htmlFor="otpEmail"
                className="block mb-2 text-sm font-medium text-black"
              >
                Email OTP
              </label>
              <input
                type="text"
                id="otpEmail"
                className="input input-primary mb-1"
                {...registerOtp("emailOtp", { required: true })}
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
              />
              {showResendButton ? (
                <button
                  type="button"
                  className="text-primary text-start focus:outline-none focus:underline hover:underline text-sm mb-3"
                  onClick={resendOtp}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500 mb-6">
                  Resend OTP in {timer}s
                </p>
              )}
            </div>
            {otpError && (
              <p className="text-red-500 text-sm mt-2">{otpError}</p>
            )}
            <div className="flex justify-end mt-4 w-full">
              <CButton
                variant={ButtonType.Primary}
                type="submit"
                className="w-full"
                disabled={!otpEmail}
              >
                Submit
              </CButton>
            </div>
          </form>
        </ReusableModal>
      )}
    </div>
  );
};

export default Signup;

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
