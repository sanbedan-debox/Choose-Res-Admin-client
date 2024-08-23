import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import MainLayout from "@/components/layouts/mainBodyLayout";
import AddTeamMemberForm from "@/components/modules/userManagement/forms/addTeamMemberForm";
import EditTeamMemberForm from "@/components/modules/userManagement/forms/editTeamMemberForm";
import ManageResTeamMemberForm from "@/components/modules/userManagement/forms/manageRestaurantsTeamMemberForm";
import { PermissionTypeEnum, UserStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { hasAccess } from "@/utils/hasAccess";
import { redirectPathFromStatus } from "@/utils/redirectPathFromStatus";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { CiShop } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineAdminPanelSettings } from "react-icons/md";
import useAddTeamMemberFormStore from "../../store/addTeamMemberStore";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;

  status: string;
};

const formatUserStatus = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.Active:
      return "Active";
    case UserStatus.Blocked:
      return "Blocked";
    case UserStatus.InternalVerificationPending:
      return "Internal Verification Pending";
    case UserStatus.OnboardingPending:
      return "Onboarding Pending";
    case UserStatus.PaymentPending:
      return "Payment Pending";
    case UserStatus.RestaurantOnboardingPending:
      return "Restaurant Onboarding Pending";
    case UserStatus.SubUserEmailVerificationPending:
      return "Email Verification Pending";

    default:
      return "";
  }
};

const formatUserRole = (role: string): string => {
  switch (role) {
    case "owner":
      return "Owner";
    case "staff":
      return "Staff";
    case "manager":
      return "Manager";
    case "accountant":
      return "Accountant";
    case "marketingPartner":
      return "Marketing Partner";

    default:
      return "";
  }
};

const Teams: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu, isShowSetupPanel } = useGlobalStore();

  useEffect(() => {
    setSelectedMenu("Team Management");
  }, [setSelectedMenu]);

  const [tableLoading, setTableLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string;
      onboardingStatus: string;
    }[]
  >([]);
  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );
  const [SelectedMemberId, setSelectedMemberId] = useState<string>("");
  const {
    setIsEditTeamMember,
    setIsEditTeamMemberId,
    setIsEditTeamRole,
    isEditTeamMember,
    setisEditRestaurantTeamMember,
    isEditRestaurantTeamMember,
  } = useUserManagementStore();
  const onEditRole = (id: string) => {
    setIsEditTeamMember(true);
    setIsEditTeamMemberId(id);
    setIsEditTeamRole(true);
  };

  const onEditPermissions = (id: string) => {
    setIsEditTeamMember(true);
    setIsEditTeamMemberId(id);
    setIsEditTeamRole(false);
  };
  const onManageResPermissions = (id: string) => {
    setIsEditTeamMember(false);
    setIsEditTeamMemberId(id);
    setIsEditTeamRole(false);
    setisEditRestaurantTeamMember(true);
  };

  const { setToastData } = useGlobalStore();
  const { isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen } =
    useUserManagementStore();
  const fetchTeamMembers = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getTeamMembers();
      if (response && response?.getTeamMembers) {
        setTeamMembers(
          response?.getTeamMembers?.map(
            (el: {
              firstName: string;
              lastName: string;
              email: string;
              phone: string;
              role: string;
              status: string;
              _id?: { _id: string } | null;
            }) => ({
              _id: el?._id?._id ?? "",
              firstName: el?.firstName ?? "",
              lastName: el?.lastName ?? "",
              email: el?.email ?? "",
              phone: el?.phone ?? "",
              role: el?.role ?? "",
              onboardingStatus: el?.status ?? "",
            })
          )
        );
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [isAddTeamMemberModalOpen, isEditTeamMember]);

  const handleDeleteMember = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedMemberId(_id);
    setAvailableCaption(
      " By clicking yes the selected Team Member / Members will be deleted. This action cannot be undone."
    );
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      <MdDeleteOutline
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDeleteMember(rowData._id)}
      />
      <IoSettingsOutline
        className="text-primary text-lg cursor-pointer"
        onClick={() => onEditRole(rowData._id)}
      />
      <MdOutlineAdminPanelSettings
        className="text-primary text-lg cursor-pointer"
        onClick={() => onEditPermissions(rowData._id)}
      />
      <CiShop
        className="text-primary text-lg cursor-pointer"
        onClick={() => onManageResPermissions(rowData._id)}
      />
    </div>
  );
  const headings = [
    { title: "First Name", dataKey: "firstName" },
    { title: "Last Name", dataKey: "lastName" },
    { title: "Email", dataKey: "email" },
    { title: "Phone", dataKey: "phone" },
    {
      title: "Role",
      dataKey: "role",
      render: (rowData: { role: string }) => {
        return <p>{formatUserRole(rowData.role)}</p>;
      },
    },
    {
      title: "Status",
      dataKey: "onboardingStatus",
      render: (rowData: { onboardingStatus: UserStatus }) => {
        return <p>{formatUserStatus(rowData.onboardingStatus)}</p>;
      },
    },

    {
      title: "Actions",
      dataKey: "name.value",
      render: renderActions,
    },
  ];
  const { resetForm } = useAddTeamMemberFormStore();

  const mainActions = [
    {
      label: "Add Team Member",
      onClick: () => {
        setIsAddTeamMemberModalOpen(true);
        resetForm();
      },
    },
  ];

  const handleAddMemberModalClose = () => {
    setIsAddTeamMemberModalOpen(false);
  };
  const handleEditMemberModalClose = () => {
    setIsEditTeamMember(false);
    setIsEditTeamMemberId("");
    setIsEditTeamRole(false);
  };
  const handleManageteamMemberModalClose = () => {
    setIsEditTeamMember(false);
    setIsEditTeamMemberId("");
    setIsEditTeamRole(false);
    setisEditRestaurantTeamMember(false);
  };
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedMemberId("");
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.deleteTeamMember({
        id: SelectedMemberId,
      });
      if (response && response.deleteTeamMember) {
        fetchTeamMembers();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
      setshowDeleteConfirmationModal(false);
    }
  };
  return (
    <div className="py-2">
      <RoopTable
        itemsPerPage={20}
        loading={tableLoading}
        headings={headings}
        data={teamMembers}
        mainActions={mainActions}
      />
      {/* DELETE MEMBER MODAL */}
      <ReusableModal
        isOpen={showDeleteConfirmationModal}
        onClose={handleDeleteCloseConfirmationModal}
        title="Are you sure ?"
        comments={availableCaption}
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            // className=""
            onClick={handleDeleteConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
      <FullPageModal
        isOpen={isAddTeamMemberModalOpen}
        title="Add Team Member"
        onClose={handleAddMemberModalClose}
        actionButtonLabel="Add Member"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <AddTeamMemberForm />
        </div>
      </FullPageModal>
      <FullPageModal
        isOpen={isEditTeamMember}
        title="Edit Team Member"
        onClose={handleEditMemberModalClose}
        actionButtonLabel="Edit Member"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <EditTeamMemberForm />
        </div>
      </FullPageModal>
      <FullPageModal
        isOpen={isEditRestaurantTeamMember}
        title="Edit Team Member"
        onClose={handleManageteamMemberModalClose}
        actionButtonLabel="Edit Member"
        // onActionButtonClick={handleAddMenuItemClick}
        onActionButtonClick={() => {}}
      >
        <div className="flex justify-center">
          <ManageResTeamMemberForm />
        </div>
      </FullPageModal>
    </div>
  );
};

Teams.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Teams;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";

  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.MeCheckUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, status, permissions } = response.meUser;

      const canAccessMenu = hasAccess(
        permissions,
        PermissionTypeEnum.UserManagement
      );
      if (!canAccessMenu) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      if (status === UserStatus.Active) {
        return {
          props: {
            repo: {
              _id,
              status,
            },
          },
        };
      }
      const redirectResult = redirectPathFromStatus(status);

      return redirectResult;
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    // console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
