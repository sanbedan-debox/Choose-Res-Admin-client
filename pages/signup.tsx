import { FC, useEffect, useState } from "react";
import logo1 from "../assets/logo/logoDark.png";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { VerifyUserDetails, AddUserInput } from "@/generated/graphql";
import ReusableModal from "@/components/common/modal/modal"; // Import your reusable modal component

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

const Signup: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [commPref, setCommPref] = useState<CommunicationType[]>([]);
  const [emailOtpVerifyKey, setEmailOtpVerifyKey] = useState<string>("");
  const [numberOtpVerifyKey, setNumberOtpVerifyKey] = useState<string>("");
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
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { firstName, lastName, email, phone, commPref } = data;

    try {
      const accountPreferences = {
        email: commPref.includes(CommunicationType.Email),
        whatsApp: commPref.includes(CommunicationType.WhatsApp),
      };

      const input: AddUserInput = {
        firstName,
        lastName,
        email,
        phone,
        accountPreferences,
      };

      const response = await sdk.addUser({ input });

      if (response.addUser) {
        setEmailOtpVerifyKey(response.addUser.emailOtpVerifyKey);
        setNumberOtpVerifyKey(response.addUser.numberOtpVerifyKey);
        setToastData({ message: "Signup Successful", type: "success" });

        setShowModal(true);
        startTimer();
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setToastData({ message: "Signup Failed", type: "error" });
    }
  };

  const onSubmitOtp: SubmitHandler<{
    emailOtp: string;
    numberOtp: string;
  }> = async (data) => {
    const { emailOtp, numberOtp } = data;

    try {
      const input: VerifyUserDetails = {
        email,
        phone,
        emailOtp,
        numberOtp,
        firstName,
        lastName,
        emailOtpVerifyKey,
        numberOtpVerifyKey,
        accountPreferences: {
          email: commPref.includes(CommunicationType.Email),
          whatsApp: commPref.includes(CommunicationType.WhatsApp),
        },
      };

      const response = await sdk.verifyUserDetails({ input });

      if (response.verifyUserDetails) {
        setToastData({ message: "Verification Successful", type: "success" });
        router.push("/"); // Redirect to home page after successful verification
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setOtpError("Invalid OTP"); // Display error message for OTP verification failure
    }
  };

  const startTimer = () => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResendButton(true);
    }

    return () => clearInterval(interval);
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

  // const handleResendOtp = async () => {
  //   try {
  //     const response = await sdk.GenerateOtpForLogin({ input: email });

  //     if (response) {
  //       setEmailOtpVerifyKey(response.generateOtpForLogin);
  //       startTimer();
  //       setToastData({ message: "OTP resent successfully", type: "success" });
  //     }
  //   } catch (error) {
  //     console.error("Failed to resend OTP:", error);
  //     setToastData({ message: "Failed to resend OTP", type: "error" });
  //   }
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setOtpEmail("");
    setOtpWhatsApp("");
    setTimer(120); // Reset timer when modal is closed
  };

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
                    <p className="text-red-500 text-sm">
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
                    <p className="text-red-500 text-sm">
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
                    <p className="text-red-500 text-sm">
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
                    type="text"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    id="phone"
                    className="input input-primary"
                    placeholder="Enter your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
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
                        {...register("commPref")}
                        value={CommunicationType.Email}
                        className="form-checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCommPref((prev) => [
                              ...prev,
                              CommunicationType.Email,
                            ]);
                          } else {
                            setCommPref((prev) =>
                              prev.filter(
                                (pref) => pref !== CommunicationType.Email
                              )
                            );
                          }
                        }}
                      />
                      <span className="ml-2 text-black">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("commPref")}
                        value={CommunicationType.WhatsApp}
                        className="form-checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCommPref((prev) => [
                              ...prev,
                              CommunicationType.WhatsApp,
                            ]);
                          } else {
                            setCommPref((prev) =>
                              prev.filter(
                                (pref) => pref !== CommunicationType.WhatsApp
                              )
                            );
                          }
                        }}
                      />
                      <span className="ml-2 text-black">WhatsApp</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn btn-primary" type="submit">
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="mt-6 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Login
                </a>
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
          width="ml"
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        >
          <form onSubmit={handleSubmit(onSubmitOtp)}>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Enter OTP</h3>
              <p className="text-sm mb-4">
                Please enter the OTP sent to your Email and WhatsApp
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
                  className="input input-primary"
                  {...register("emailOtp", { required: true })}
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="otpWhatsApp"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  WhatsApp OTP
                </label>
                <input
                  type="text"
                  id="otpWhatsApp"
                  className="input input-primary"
                  {...register("numberOtp", { required: true })}
                  value={otpWhatsApp}
                  onChange={(e) => setOtpWhatsApp(e.target.value)}
                />
              </div>
            </div>
            {otpError && (
              <p className="text-red-500 text-sm mt-2">{otpError}</p>
            )}
            <div className="flex justify-between mt-4">
              <div className="mt-5">
                {showResendButton && (
                  <button
                    // onClick={handleResendOtp}
                    className="text-sm text-primary underline"
                  >
                    Resend OTP
                  </button>
                )}
                <span className="ml-2 text-warning">
                  {showResendButton
                    ? ""
                    : `Resend OTP available after ${timer}s`}
                </span>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!otpEmail || !otpWhatsApp}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </ReusableModal>
      )}
    </div>
  );
};

export default Signup;
