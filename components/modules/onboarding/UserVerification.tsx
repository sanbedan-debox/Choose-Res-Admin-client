import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import useOnboardingStore from "@/store/onboarding";
import useAuthStore from "@/store/auth";
import { sdk } from "@/utils/graphqlClient";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

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
    postcode,
    estimatedRevenue,
    state,
  } = useOnboardingStore();

  const onSubmit = async (data: IFormInput) => {
    if (!businessType || !businessName || !employeeSize || !estimatedRevenue) {
      try {
        setToastData({
          message: "Please fill business details first.",
          type: "error",
        });
        router.push("/onboarding/user/user-info");
        return;
      } catch (error) {
        console.error("Failed to call API to fill details:", error);
        setToastData({
          message: "Failed to check business details.",
          type: "error",
        });
        return;
      }
    }

    if (!addressLine1 || !city || !state || !postcode || !place) {
      try {
        setToastData({
          message: "Please fill location details first.",
          type: "error",
        });
        router.push("/onboarding/user/user-location");
        return;
      } catch (error) {
        console.error("Failed to call API to fill details:", error);
        setToastData({
          message: "Failed to check location details.",
          type: "error",
        });
        return;
      }
    }

    try {
      const response = await sdk.UpdateUserOnboarding({
        input: {
          ein: data.ein,
        },
      });

      if (response.updateUserOnboarding) {
        const res = await sdk.completeUserOnboarding();
        if (res.completeUserOnboarding) {
          setToastData({
            message: "User verification details updated successfully!",
            type: "success",
          });
          router.replace("/account/verification-pending");
        }
      }
    } catch (error) {
      setToastData({
        message: "Failed to update user verification details.",
        type: "error",
      });
    }
  };

  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-md items-center space-y-5 text-center"
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
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
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
          {errors.ein && (
            <p className="text-red-500 text-sm text-start">
              {errors.ein.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <CButton
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
