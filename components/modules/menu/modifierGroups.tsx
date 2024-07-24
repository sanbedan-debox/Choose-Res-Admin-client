import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import CustomSwitch from "@/components/common/customSwitch/customSwitch";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import { StatusEnum } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoDuplicateOutline } from "react-icons/io5";

const Modifiers: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddModifierGroupModalOpen, fetchMenuDatas } =
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
          response.getModifierGroups.map((el) => ({
            _id: el?._id,
            name: el?.name.value,
            status: el?.status,
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
    fetchModifierGroups();
  }, [fetchMenuDatas]);

  const [showDeleteConfirmationModal, setshowDeleteConfirmationModal] =
    useState(false);
  const { setEditModGroupId, setisEditModGroup, setisDuplicateModifierGroup } =
    useModGroupStore();

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );
  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption(
      " By clicking yes the selected Modifer Group / Modifier Groups will be deleted. This action cannot be undone."
    );
  };

  const handleEditItem = (_id: string) => {
    setisAddModifierGroupModalOpen(true);
    setEditModGroupId(_id);
    setisEditModGroup(true);
    setisDuplicateModifierGroup(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setisAddModifierGroupModalOpen(true);
    setEditModGroupId(_id);
    setisDuplicateModifierGroup(true);
    setisEditModGroup(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-3 justify-end">
      <FaTrash
        className="text-primary text-md cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-primary text-md cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
      <IoDuplicateOutline
        className="text-primary text-md cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      />
    </div>
  );

  const [btnLoading, setBtnLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.removeModifierGroup({ id: selectedItemId });
      if (response && response.removeModifierGroup) {
        fetchModifierGroups();
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

    { title: "Toggle Status", dataKey: "status", render: renderSwitch },
    { title: "Actions", dataKey: "_id", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Modifiers Groups",
      onClick: () => setisAddModifierGroupModalOpen(true),
    },
  ];
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedItemId("");
  };
  const handleStatusCloseConfirmationModal = () => {
    setShowStatusConfirmationModal(false);
    setSelectedItemId("");
  };
  const handleStatusConfirmation = async () => {
    setBtnLoading(true);
    setShowStatusConfirmationModal(false);
    try {
      const response = await sdk.changeModifierGroupStatus({
        id: selectedItemId,
      });
      if (response && response.changeModifierGroupStatus) {
        fetchModifierGroups();
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="py-2">
      <RoopTable
        loading={tableLoading}
        itemsPerPage={20}
        headings={headings}
        data={modifierGroups}
        mainActions={mainActions}
      />
      {/* DELETE ITEM MODAL */}
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
            onClick={handleDeleteConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
      {/* STATUS CHANGE MODAL */}
      <ReusableModal
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
      </ReusableModal>
    </div>
  );
};

export default Modifiers;
