import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import RoopTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { BsCopy } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

const Modifiers: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<
    {
      _id: string;
      name: string;
    }[]
  >();
  const { setToastData } = useGlobalStore();
  const { setIsAddModifierGroupModalOpen, refreshMenuBuilderData } =
    useMenuOptionsStore();
  const [tableLoading, setTableLoading] = useState(false);
  const [showStatusConfirmationModal, setShowStatusConfirmationModal] =
    useState(false);
  const fetchModifierGroups = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getModifierGroups();
      if (response && response.getModifierGroups) {
        setModifierGroups(
          response.getModifierGroups.map(
            (el: { _id: string; name: string }) => ({
              _id: el?._id,
              name: el?.name,
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
    fetchModifierGroups();
  }, [refreshMenuBuilderData]);

  const { setEditModGroupId, setIsEditModGroup, setisDuplicateModifierGroup } =
    useModGroupStore();

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );

  const handleEditItem = (_id: string) => {
    setIsAddModifierGroupModalOpen(true);
    setEditModGroupId(_id);
    setIsEditModGroup(true);
    setisDuplicateModifierGroup(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setIsAddModifierGroupModalOpen(true);
    setEditModGroupId(_id);
    setisDuplicateModifierGroup(true);
    setIsEditModGroup(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-3 justify-end">
      <MdOutlineEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />

      <BsCopy
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      />
    </div>
  );

  const [btnLoading, setBtnLoading] = useState(false);

  const handleToggleSwitch = (rowData: { status: string; _id: string }) => {
    setShowStatusConfirmationModal(true);
    setSelectedItemId(rowData._id);
    setAvailableCaption(
      rowData.status === StatusEnum.Inactive
        ? "are you sure you want to activate the Modifier Group?"
        : "are you sure you want to deactivate the Modifier Group?"
    );
  };

  const renderSwitch = (rowData: { status: StatusEnum; _id: string }) => (
    <div>
      <CustomSwitch
        checked={rowData.status === StatusEnum.Active}
        onChange={() => handleToggleSwitch(rowData)}
        label={`Toggle switch for ${rowData._id}`}
      />
    </div>
  );
  const headings = [
    { title: "Name", dataKey: "name" },

    // { title: "Toggle Status", dataKey: "status", render: renderSwitch },
    { title: "Actions", dataKey: "_id", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Modifiers Groups",
      onClick: () => setIsAddModifierGroupModalOpen(true),
    },
  ];

  // const handleStatusCloseConfirmationModal = () => {
  //   setShowStatusConfirmationModal(false);
  //   setSelectedItemId("");
  // };
  // const handleStatusConfirmation = async () => {
  //   setBtnLoading(true);
  //   setShowStatusConfirmationModal(false);
  //   try {
  //     const response = await sdk.changeModifierGroupStatus({
  //       id: selectedItemId,
  //     });
  //     if (response && response.changeModifierGroupStatus) {
  //       fetchModifierGroups();
  //     }
  //   } catch (error) {
  //     const errorMessage = extractErrorMessage(error);
  //     setToastData({
  //       type: "error",
  //       message: errorMessage,
  //     });
  //   } finally {
  //     setBtnLoading(false);
  //   }
  // };
  return (
    <div className="py-2">
      <RoopTable
        loading={tableLoading}
        itemsPerPage={20}
        headings={headings}
        data={modifierGroups ?? []}
        mainActions={mainActions}
      />

      {/* STATUS CHANGE MODAL */}
      {/* <ReusableModal
        isOpen={showStatusConfirmationModal}
        onClose={handleStatusCloseConfirmationModal}
        title="Are you sure ?"
        comments={availableCaption}
      >
        <div className="flex justify-end space-x-4">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            onClick={handleStatusConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal> */}
    </div>
  );
};

export default Modifiers;
