import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import ReusableModal from "@/components/common/modal/modal";
import { extractErrorMessage, isValidNameAlphabetic } from "@/utils/utilFUncs";
import { UserRole } from "@/generated/graphql";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import ArrowCard from "@/components/common/arrowCard/arrowCard";
import useUserManagementStore from "@/store/userManagement";
import useAddTeamMemberFormStore from "@/pages/teams/store/addTeamMemberStore";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const userRoleOptions = [
  { value: UserRole.Owner, label: "Owner" },
  { value: UserRole.Manager, label: "Manager" },
  { value: UserRole.MarketingPartner, label: "Marketing Partner" },
  { value: UserRole.Accountant, label: "Accountant" },
];

const AddTeamMemberForm = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const { isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen } =
    useUserManagementStore();
  const { form, setFormValue, resetForm } = useAddTeamMemberFormStore();
  const [restaurantDropdownOptions, setRestaurantDropdownOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<
    {
      type: string;
      _id: string;
      isTicked: boolean;
      preselect: string[];
    }[]
  >([]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (
        !isValidNameAlphabetic(form.firstName) ||
        !isValidNameAlphabetic(form.lastName)
      ) {
        setToastData({
          message: "Please use only alphabets for first and last names.",
          type: "error",
        });
        return;
      }

      setBtnLoading(true);
      const restaurantIds = form.restaurant.map(
        (rest: { value: string }) => rest.value
      );

      const res = await sdk.addTeamMember({
        AddTeamMemberInput: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          role: form.role.value as UserRole,
          restaurants: restaurantIds,
          accountPreferences: {
            whatsApp: form.whatsApp,
            email: form.emailPref,
          },
          // permissions: Object.keys(form.permissions).filter(
          //   (key) => form.permissions[key]
          // ),
        },
      });

      if (res) {
        setToastData({
          type: "success",
          message: "Team Member Added Successfully",
        });
        setIsAddTeamMemberModalOpen(false);
        resetForm();
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

  useEffect(() => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) => ({
        ...permission,
        isTicked: permission.preselect.includes(form.role?.value || ""),
      }))
    );
  }, [form.role]);

  const fetchPermissions = async () => {
    try {
      const response = await sdk.getAllPermissions();
      const formattedPermissions = response.getAllPermissions.map(
        (permission) => ({
          type: permission.type,
          _id: permission._id,
          isTicked: false,
          preselect: permission.preselect,
        })
      );
      setPermissions(formattedPermissions);
    } catch (error) {
      setToastData({
        type: "error",
        message: extractErrorMessage(error),
      });
    }
  };
  const handlePermissionChange = (type: string) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.type === type
          ? { ...permission, isTicked: !permission.isTicked }
          : permission
      )
    );
  };

  const fetchUserRestaurants = async () => {
    try {
      const response = await sdk.getUserRestaurants();
      const options = response.getUserRestaurants.map(
        (restaurant: { name: { value: string }; id: string }) => ({
          label: restaurant.name.value,
          value: restaurant.id,
        })
      );
      setRestaurantDropdownOptions(options);
    } catch (error) {
      setToastData({
        type: "error",
        message: extractErrorMessage(error),
      });
    }
  };
  useEffect(() => {
    fetchPermissions();
    fetchUserRestaurants();
  }, [isAddTeamMemberModalOpen]);

  const handleBack = () => {
    setShowPermissions(false);
  };

  const handleContinueClick = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.role ||
      form.restaurant.length === 0
    ) {
      setToastData({
        message: "Please fill out all required fields.",
        type: "error",
      });
      return;
    }

    if (
      !isValidNameAlphabetic(form.firstName) ||
      !isValidNameAlphabetic(form.lastName)
    ) {
      setToastData({
        message: "Please use only alphabets for first and last names.",
        type: "error",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setToastData({
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    const phonePattern = /^[2-9]{1}[0-9]{9}$/;
    if (!phonePattern.test(form.phone)) {
      setToastData({
        message: "Please enter a valid phone number.",
        type: "error",
      });
      return;
    }

    setShowPermissions(true);
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
          {showPermissions ? "Assign Permissions" : "Add a new team member"}
        </h1>
        <p className="max-w-md text-accent-foreground/80 text-sm">
          {showPermissions
            ? "Select permissions to assign to the new team member."
            : "Fill in the details to add a new team member."}
        </p>
      </div>

      {!showPermissions ? (
        <form
          className="space-y-4 md:space-y-3 w-full max-w-2xl"
          onSubmit={onSubmit}
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
              id="firstName"
              className="input input-primary"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => setFormValue("firstName", e.target.value)}
            />
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
              id="lastName"
              className="input input-primary"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => setFormValue("lastName", e.target.value)}
            />
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
              id="email"
              className="input input-primary"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setFormValue("email", e.target.value)}
            />
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
              id="phone"
              className="input input-primary"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) => setFormValue("phone", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Role
            </label>
            <Select
              id="role"
              options={userRoleOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select role"
              value={form.role}
              onChange={(selectedOption) =>
                setFormValue("role", selectedOption)
              }
            />
          </div>

          {restaurantDropdownOptions.length > 0 ? (
            <div className="col-span-2">
              <label
                htmlFor="restaurant"
                className="block mb-2 text-sm font-medium text-left text-gray-700"
              >
                Restaurant
              </label>
              <Select
                isMulti
                id="restaurant"
                options={restaurantDropdownOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select restaurants"
                value={form.restaurant}
                onChange={(selectedOptions) =>
                  setFormValue("restaurant", selectedOptions)
                }
              />
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <div className="">
              <CustomSwitchCard
                classNameDiv="h-full"
                label="WhatsApp Notifications"
                title="Enable WhatsApp Notifications"
                caption="Toggle to enable or disable WhatsApp notifications"
                switchChecked={form.whatsApp}
                onSwitchChange={() => setFormValue("whatsApp", !form.whatsApp)}
              />
            </div>

            <div className="">
              <CustomSwitchCard
                classNameDiv="h-full"
                label="Email Notifications"
                title="Enable Email Notifications"
                caption="Toggle to enable or disable email notifications"
                switchChecked={form.emailPref}
                onSwitchChange={() =>
                  setFormValue("emailPref", !form.emailPref)
                }
              />
            </div>
          </div>

          <div className="pt-5 col-span-2 w-full flex justify-center items-center">
            <CButton
              loading={btnLoading}
              variant={ButtonType.Primary}
              type="button"
              className="w-full"
              onClick={handleContinueClick}
            >
              Save and Continue
            </CButton>
          </div>
        </form>
      ) : (
        <form
          className="space-y-4 md:space-y-3 w-full max-w-2xl"
          onSubmit={onSubmit}
        >
          <div
            onClick={handleBack}
            className="flex justify-between items-center mb-4"
          >
            <IoArrowBackCircleOutline className="text-3xl hover:text-primary cursor-pointer" />
          </div>

          {permissions.map((permission) => (
            <CustomSwitchCard
              key={permission._id}
              label={`Do you want to give this user permission for ${permission.type}?`}
              title={permission?.type || ""}
              caption={`Toggle to enable or disable ${permission.type} permission`}
              switchChecked={permission.isTicked}
              onSwitchChange={() => handlePermissionChange(permission.type)}
            />
          ))}

          <div className="pt-5 col-span-2 w-full flex justify-center items-center">
            <CButton
              loading={btnLoading}
              variant={ButtonType.Primary}
              type="submit"
              className="w-full"
            >
              Add Team Member
            </CButton>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default AddTeamMemberForm;
