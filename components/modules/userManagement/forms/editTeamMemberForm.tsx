import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitchCard from "@/components/common/customSwitchCard/customSwitchCard";
import ReusableModal from "@/components/common/modal/modal";
import { PermissionTypeEnum, UserRole } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
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
  const {
    isEditTeamMemberId,
    isEditTeamRole,
    resetEditStates,
    setIsEditTeamMember,
    setIsEditTeamMemberId,
    setIsEditTeamRole,
  } = useUserManagementStore();

  const { register, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    defaultValues: {
      role: "",
      permissions: [],
    },
  });
  const [showAddRestaurantModal, setShowAddRestaurantModal] =
    useState<boolean>(false);

  const [permissionsList, setPermissionsList] = useState<
    { id: string; type: PermissionTypeEnum; status: boolean }[]
  >([]);

  const [userRestaurants, setUserRestaurants] = useState<
    { id: string; name: string; status: string; city: string }[]
  >([]);
  const [allRestaurants, setAllRestaurants] = useState<
    { id: string; name: string; status: string; city: string }[]
  >([]);

  const [selectedRestaurants, setSelectedRestaurants] = useState<
    { id: string; name: string }[]
  >([]);

  const getUser = async () => {
    if (isEditTeamMemberId) {
      try {
        const res = await sdk.getUser({ id: isEditTeamMemberId });
        const allRestaurantsRes = await sdk.userRestaurants();

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

          if (res.getUser.restaurants) {
            setUserRestaurants(
              res.getUser.restaurants.map((restaurant) => ({
                id: restaurant.id,
                name: restaurant.name,
                status: restaurant.status,
                city: restaurant.city ?? "",
              })) || []
            );
          } else {
            setUserRestaurants([]);
          }

          setAllRestaurants(
            allRestaurantsRes.userRestaurants.map((restaurant: any) => ({
              id: restaurant.id,
              name: restaurant.name,
              status: restaurant.status,
              city: restaurant.city,
            })) || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
  };

  const handleRemoveRestaurant = async (restaurantId: string) => {
    try {
      await sdk.removeRestaurantSubuser({
        restaurantSubUser: {
          id: isEditTeamMemberId ?? "",
          restaurants: [restaurantId],
        },
      });
      setUserRestaurants((prev) =>
        prev.filter((restaurant) => restaurant.id !== restaurantId)
      );
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
  };

  const handleAddRestaurants = async () => {
    try {
      const selectedIds = selectedRestaurants.map(
        (restaurant) => restaurant.id
      );
      await sdk.addRestaurantSubuser({
        restaurantSubUser: {
          id: isEditTeamMemberId ?? "",
          restaurants: selectedIds,
        },
      });
      setUserRestaurants((prev) => [
        ...prev,
        ...selectedRestaurants.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          status: "",
          city: "",
        })),
      ]);
      setSelectedRestaurants([]);
      setShowAddRestaurantModal(false);
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
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
        setToastData({
          message: "Successfully updated user role",
          type: "success",
        });
      } else {
        await sdk.updateSubuserPermissions({
          input: {
            id: isEditTeamMemberId ?? "",
            permissions: permissionsList,
          },
        });
        setToastData({
          message: "Successfully updated user permission",
          type: "success",
        });
      }
      handleEditMemberModalClose();
      resetEditStates();
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
  };
  const handleEditMemberModalClose = () => {
    setIsEditTeamMember(false);
    setIsEditTeamMemberId("");
    setIsEditTeamRole(false);
  };

  const { setToastData } = useGlobalStore();

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="max-w-4xl mx-auto">
        {isEditTeamRole ? (
          <div className="w-full">
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
          <div className="space-y-4  w-full">
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

        <div className="flex justify-end mt-4">
          <CButton
            variant={ButtonType.Primary}
            type="submit"
            className="w-full"
          >
            {isEditTeamRole ? "Update User Role" : "Update User Permissions"}
          </CButton>
        </div>
      </div>
      {showAddRestaurantModal && (
        <ReusableModal
          isOpen={showAddRestaurantModal}
          onClose={() => setShowAddRestaurantModal(false)}
          title="Add Restaurant Access"
          width="md"
        >
          <Select
            isMulti
            options={allRestaurants.map((restaurant) => ({
              value: restaurant.id,
              label: restaurant.name,
            }))}
            onChange={(selectedOptions) =>
              setSelectedRestaurants(
                selectedOptions.map((option: any) => ({
                  id: option.value,
                  name: option.label,
                }))
              )
            }
            className="basic-single"
            classNamePrefix="select"
          />
          <div className="flex justify-end mt-4">
            <CButton
              onClick={handleAddRestaurants}
              variant={ButtonType.Primary}
            >
              Add Restaurants
            </CButton>
          </div>
        </ReusableModal>
      )}
    </form>
  );
};

export default EditTeamMemberForm;
