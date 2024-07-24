import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import ReusableModal from "@/components/common/modal/modal";
import { extractErrorMessage, isValidNameAlphabetic } from "@/utils/utilFUncs";
import { UserRole } from "@/generated/graphql";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: { value: string; label: string };
  whatsApp: boolean;
  emailPref: boolean;
}

const userRoleOptions: any[] = [
  { value: UserRole.Owner, label: "Owner" },
  { value: UserRole.Manager, label: "Manager" },
  { value: UserRole.MarketingPartner, label: "Marketing Partner" },
  { value: UserRole.Accountant, label: "Accountant" },
];

const AddTeamMemberForm = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    watch,
    setValue,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      if (
        !isValidNameAlphabetic(data.firstName) ||
        !isValidNameAlphabetic(data.lastName)
      ) {
        setToastData({
          message: "Please use only alphabets for first and last names.",
          type: "error",
        });
        return;
      }

      setBtnLoading(true);

      const res = await sdk.addTeamMember({
        AddTeamMemberInput: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role.value as UserRole,
          accountPreferences: {
            whatsApp: data.whatsApp,
            email: data.emailPref,
          },
        },
      });
      if (res) {
        setToastData({
          type: "success",
          message: "Team Member Added Successfully",
        });
      }

      setBtnLoading(false);
    } catch (error: any) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <motion.div
      className="z-10 w-full min-h-full max-w-2xl flex flex-col items-center space-y-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-5 text-center">
        <h1 className="font-display max-w-2xl font-semibold text-2xl">
          Add a new team member
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          Fill in the details to add a new team member.
        </p>
      </div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            id="firstName"
            className="input input-primary"
            placeholder="Enter first name"
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
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            id="lastName"
            className="input input-primary"
            placeholder="Enter last name"
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
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            id="email"
            className="input input-primary"
            placeholder="Enter email"
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
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Phone
          </label>
          <input
            type="text"
            {...register("phone", { required: "Phone number is required" })}
            id="phone"
            className="input input-primary"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm text-start">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Role
          </label>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="role"
                options={userRoleOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select role"
              />
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm text-start">
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <CustomSwitchCard
            label="WhatsApp Notifications"
            title="Enable WhatsApp Notifications"
            caption="Toggle to enable or disable WhatsApp notifications"
            switchChecked={watch("whatsApp")}
            onSwitchChange={() => setValue("whatsApp", !watch("whatsApp"))}
          />
        </div>

        <div className="col-span-2">
          <CustomSwitchCard
            label="Email Notifications"
            title="Enable Email Notifications"
            caption="Toggle to enable or disable email notifications"
            switchChecked={watch("emailPref")}
            onSwitchChange={() => setValue("emailPref", !watch("emailPref"))}
          />
        </div>

        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          type="submit"
          className="w-full"
        >
          Add Team Member
        </CButton>
      </form>
    </motion.div>
  );
};

export default AddTeamMemberForm;
