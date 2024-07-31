import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import AddTeamMemberForm from "@/components/modules/userManagement/forms/addTeamMemberForm";
import { UserRole, UserStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
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

const formatUserRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.Owner:
      return "Owner";
    case UserRole.Staff:
      return "Staff";
    case UserRole.Manager:
      return "Manager";
    case UserRole.Accountant:
      return "Accountant";
    case UserRole.MarketingPartner:
      return "Marketing Partner";

    default:
      return "";
  }
};

const Teams: NextPageWithLayout = () => {
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

  const { setToastData } = useGlobalStore();
  const { isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen } =
    useUserManagementStore();
  const fetchTeamMembers = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getTeamMembers();
      if (response && response?.getTeamMembers) {
        setTeamMembers(
          response?.getTeamMembers?.map((el) => ({
            _id: el?._id?._id ?? "",
            firstName: el?.firstName ?? "",
            lastName: el?.lastName ?? "",
            email: el?.email ?? "",
            phone: el?.phone ?? "",
            role: el?.role ?? "",
            onboardingStatus: el?.status ?? "",
          }))
        );
      }
    } catch (error: any) {
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
  }, [isAddTeamMemberModalOpen]);

  const handleDeleteMember = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedMemberId(_id);
    setAvailableCaption(
      " By clicking yes the selected Team Member / Members will be deleted. This action cannot be undone."
    );
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-2 justify-end">
      <FaTrash
        className="text-primary text-md cursor-pointer"
        onClick={() => handleDeleteMember(rowData._id)}
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
      // render: (rowData: { role: string }) => {
      //   return <p>{formatUserRole(rowData.role as UserRole)}</p>;
      // },
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

  const mainActions = [
    {
      label: "Add Team Member",
      onClick: () => {
        setIsAddTeamMemberModalOpen(true);
      },
    },
  ];

  const handleAddMemberModalClose = () => {
    setIsAddTeamMemberModalOpen(false);
  };
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedMemberId("");
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.removeTeamMember({ teamId: SelectedMemberId });
      if (response && response.removeTeamMember) {
        fetchTeamMembers();
      }
    } catch (error: any) {
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
        onActionButtonClick={() => console.log("hello")}
      >
        <div className="flex justify-center">
          <AddTeamMemberForm />
        </div>
      </FullPageModal>
    </div>
  );
};

Teams.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Teams;
