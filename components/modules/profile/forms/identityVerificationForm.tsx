import React from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useForm } from "react-hook-form";
import useGlobalStore from "@/store/global";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";

interface IFormInput {
  ein: string;
  ssn: string;
}

const IdentityVerificationForm: React.FC = () => {
  const { setToastData } = useGlobalStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  return (
    <div className="z-10 flex flex-col w-full max-w-lg items-center space-y-5 text-center">
      <form className="space-y-4 md:space-y-3 w-full max-w-2xl">
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
            // defaultValue={ein}
            // onChange={(e) => setEin(e.target.value)}
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
      </form>
    </div>
  );
};

export default IdentityVerificationForm;
