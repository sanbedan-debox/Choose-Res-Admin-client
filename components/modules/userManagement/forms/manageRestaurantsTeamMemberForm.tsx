import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import { PermissionTypeEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Select from "react-select";

const ManageResTeamMemberForm: React.FC = () => {
  const {
    isEditTeamMemberId,
    isEditTeamRole,
    resetEditStates,
    setIsEditTeamMember,
    setIsEditTeamMemberId,
    setIsEditTeamRole,
  } = useUserManagementStore();

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
    <form className="space-y-4 w-full">
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
          Restaurant Access
        </label>{" "}
        <div className="space-y-4">
          {userRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="text-lg font-semibold">{restaurant.name}</h4>
                <p className="text-sm">{`${restaurant.city}`}</p>
              </div>
              <IoIosCloseCircleOutline
                className="text-red-400 text-lg cursor-pointer"
                onClick={() => handleRemoveRestaurant(restaurant.id)}
              />
            </div>
          ))}
          <CButton
            type="button"
            className="w-full"
            onClick={() => setShowAddRestaurantModal(true)}
            variant={ButtonType.Outlined}
          >
            Add Restaurant Access
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

export default ManageResTeamMemberForm;
