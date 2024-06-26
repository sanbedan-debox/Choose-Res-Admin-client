import { FC } from "react";
import logo1 from "../assets/logo/logoWhite.png";
import Image from "next/image";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { AddUserInput } from "@/generated/graphql";

enum CommunicationType {
  Email = "EMAIL",
  WhatsApp = "WHATSAPP",
}

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  commPref: CommunicationType[];
}

const Signup: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, firstName, lastName, phone, commPref } = data;

    try {
      const communicationPreferences = commPref.map((pref) => pref);

      const input: AddUserInput = {
        firstName,
        lastName,
        email,
        phone,
        accountPreferences: communicationPreferences,
      };

      console.log("Input data:", input); // Debugging: print the input data

      const response = await sdk.addUser({ input });

      if (response.addUser) {
        console.log("Signup successful:", response);
        setToastData({ message: "Signup Successful", type: "success" });
        router.push("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setToastData({ message: "Signup Failed", type: "error" });
    }
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
                    className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-black focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your First Name"
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
                    className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-black focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your Last Name"
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
                    className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-black focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your Email Address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    id="password"
                    className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-black focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
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
                    className="bg-secondary bg-opacity-30 text-sm rounded-lg focus:ring-primary-600 focus:outline-none block w-full p-2.5 border-gray-500 placeholder-gray-400 text-black focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your Phone Number"
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
                      />
                      <span className="ml-2 text-black">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("commPref")}
                        value={CommunicationType.WhatsApp}
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-black">WhatsApp</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <CButton type={ButtonType.Primary} htmlType="submit">
                    Sign Up
                  </CButton>
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
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-end h-full px-20 bg-gray-900 bg-opacity-40">
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-white">CHOOSE</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                autem ipsa, nulla laboriosam dolores, repellendus perferendis
                libero suscipit nam temporibus molestiae.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
