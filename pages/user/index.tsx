import FullPageModal from "@/components/common/modal/fullPageModal";
import RoopTable from "@/components/common/table/table";
import MainLayout from "@/components/layouts/mainBodyLayout";
import Loader from "@/components/loader";
import AddTeamMemberForm from "@/components/modules/userManagement/forms/addTeamMemberForm";
import useGlobalStore from "@/store/global";
import useUserManagementStore from "@/store/userManagement";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Users: NextPageWithLayout = () => {
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
  const { setToastData } = useGlobalStore();
  const { isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen } =
    useUserManagementStore();
  const fetchTeamMembers = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getTeamMembers();
      if (response && response.getTeamMembers) {
        setTeamMembers(
          response.getTeamMembers.map((el) => ({
            _id: el?._id,
            name: el?.firstName,
            email: el?.email,
            phone: el?.phone,
            role: el?.role,
            onboardingStatus: el?.onboardingStatus,
            createdAt: el?.createdAt,
            updatedAt: el?.updatedAt,
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
  }, []);

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Desc", dataKey: "desc" },
    { title: "Price", dataKey: "price" },
  ];

  const mainActions = [
    {
      label: "Add Team Member",
      onClick: () => {
        setIsAddTeamMemberModalOpen(true);
      },
    },
  ];

  const handleAddMenuItemClose = () => {
    setIsAddTeamMemberModalOpen(false);
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
      <FullPageModal
        isOpen={isAddTeamMemberModalOpen}
        title="Add Team Member"
        onClose={handleAddMenuItemClose}
        actionButtonLabel="Save Item"
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

Users.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Users;
