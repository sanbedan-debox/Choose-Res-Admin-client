import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import useAuthStore from "@/store/auth";
import useGlobalStore from "@/store/global";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  ein: string;
  ssn: string;
}

const UserVerification = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const { userId } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const {
    ein,
    setein,
    addressLine1,
    addressLine2,
    businessName,
    businessType,
    city,
    employeeSize,
    place,
    zipcode,
    estimatedRevenue,
    state,
  } = useOnboardingStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    setBtnLoading(true);

    if (!businessType || !businessName || !employeeSize || !estimatedRevenue) {
      try {
        setToastData({
          message: "Please fill business details first.",
          type: "error",
        });
        router.push("/onboarding/user/user-info");
        return;
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
        return;
      }
    }

    if (!addressLine1 || !city || !state || !zipcode || !place) {
      try {
        setToastData({
          message: "Please fill location details first.",
          type: "error",
        });
        router.push("/onboarding/user/user-location");
        return;
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
        return;
      }
    }

    try {
      const response = await sdk.businessOnboarding({
        input: {
          ein: data.ein,
        },
      });

      if (response.businessOnboarding) {
        const res = await sdk.completeBusinessOnboarding();
        if (res.completeBusinessOnboarding) {
          setToastData({
            message: "User verification details updated successfully!",
            type: "success",
          });
          router.replace("/account/verification-pending");
        }
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
      return;
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-2xl  items-center space-y-5 text-center"
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
        <h1 className="font-display max-w-md text-2xl font-semibold transition-colors">
          User Verification
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            EIN
          </label>
          <input
            type="text"
            {...register("ein", {
              required: "EIN is required",
            })}
            className="input input-primary"
            placeholder="EIN"
            defaultValue={ein}
            onChange={(e) => setein(e.target.value)}
          />
          <p className="text-gray-400 text-xs text-start mt-1">
            Enter your 9-digits EIN number in this format XX-XXXXXXX
          </p>
          {errors.ein && (
            <p className="text-red-500 text-sm text-start">
              {errors.ein.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
            className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
          >
            Submit
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default UserVerification;
