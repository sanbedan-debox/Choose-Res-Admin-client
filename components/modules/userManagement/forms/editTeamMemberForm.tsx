import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import { PermissionTypeEnum, UserRole } from "@/generated/graphql";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

type FormData = {
  role: string;
  permissions: { _id: string; status: boolean }[];
};

const userRoleOptions = [
  { value: UserRole.Owner, label: "Owner" },
  { value: UserRole.Manager, label: "Manager" },
  { value: UserRole.MarketingPartner, label: "Marketing Partner" },
  { value: UserRole.Accountant, label: "Accountant" },
];
const EditTeamMemberForm: React.FC = () => {
  const { isEditTeamMemberId, isEditTeamRole, resetEditStates } =
    useUserManagementStore();

  const { register, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    defaultValues: {
      role: "",
      permissions: [],
    },
  });

  const [permissionsList, setPermissionsList] = useState<
    { id: string; type: PermissionTypeEnum; status: boolean }[]
  >([]);
  const getUser = async () => {
    if (isEditTeamMemberId) {
      try {
        const res = await sdk.getUser({ id: isEditTeamMemberId });
        if (res.getUser) {
          const role = res.getUser.role || "";
          setValue("role", role);
          setPermissionsList(
            res.getUser.permissions.map((permission) => ({
              id: permission.id,
              type: permission.type,
              status: permission.status,
            }))
          );

          reset({
            role: role,
            permissions: res.getUser.permissions.map((p) => ({
              id: p.id,
              status: p.status,
              type: p.type,
            })),
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [isEditTeamMemberId]);

  const onSubmit = async (formData: FormData) => {
    try {
      if (isEditTeamRole) {
        await sdk.updateSubuserRole({
          input: {
            id: isEditTeamMemberId ?? "",
            role: formData.role as UserRole,
          },
        });
      } else {
        //       const updatedPermissions = permissionsList
        // .filter((perm) =>
        //   formData.permissions.some(
        //     (fp) => fp.id === perm.id && fp.status !== perm.status
        //   )
        // )
        // .map((perm) => ({
        //   id: perm.id,
        //   type: perm.type,
        //   status:
        //     formData.permissions.find((p) => p.id === perm.id)?.status ?? false,
        // }));

        await sdk.updateSubuserPermissions({
          input: {
            id: isEditTeamMemberId ?? "",
            permissions: permissionsList,
          },
        });
      }
      resetEditStates();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handlePermissionChange = (type: string) => {
    setPermissionsList((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.type === (type as PermissionTypeEnum)
          ? { ...permission, status: !permission.status }
          : permission
      )
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isEditTeamRole ? (
        <div className="col-span-2">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Role
          </label>
          <Select
            classNames={{
              option: (state) =>
                `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent ${
                  state.isSelected ? "!bg-primary text-white" : ""
                }`,
            }}
            id="role"
            options={userRoleOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select role"
            value={userRoleOptions.find(
              (option) => option.value === watch("role")
            )}
            onChange={(selectedOption) =>
              setValue("role", (selectedOption as any)?.value)
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {permissionsList.map((permission) => (
            <CustomSwitchCard
              key={permission.id}
              label={permission.type}
              switchChecked={permission.status}
              onSwitchChange={() => handlePermissionChange(permission.type)}
              title={permission.type}
              caption={`Do you want ${"hello"} user to have the access`}
            />
          ))}
        </div>
      )}
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isEditTeamRole ? "Update User Role" : "Update User Permissions"}
      </button>
    </form>
  );
};

export default EditTeamMemberForm;
