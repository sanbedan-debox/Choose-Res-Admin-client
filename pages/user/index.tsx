import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import AddTeamMemberForm from "@/components/modules/userManagement/forms/addTeamMemberForm";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const User: NextPageWithLayout = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      onboardingStatus: string;
      createdAt: string;
      updatedAt: string;
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
      if (response && response.getTeamMembers) {
        // setTeamMembers(
        //   response?.getTeamMembers?.subUsers.map((el) => ({
        //     _id: el?._id,
        //     name: el?.firstName,
        //     email: el?.email,
        //     phone: el?.phone,
        //     role: el?.role,
        //     onboardingStatus: el?.onboardingStatus,
        //     createdAt: el?.createdAt,
        //     updatedAt: el?.updatedAt,
        //   }))
        // );
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
  }, []);

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
      {/* <FaEdit
        className="text-primary text-md cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
      <IoDuplicateOutline
        className="text-primary text-md cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      /> */}
    </div>
  );
  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Price", dataKey: "price" },
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

User.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default User;
