import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModGroupStore from "@/store/modifierGroup";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShieldAlt } from "react-icons/fa";

const Modifiers: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddModifierGroupModalOpen, fetchMenuDatas } =
    useMenuOptionsStore();
  const [tableLoading, setTableLoading] = useState(false);

  const fetchModifierGroups = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getModifierGroups();
      if (response && response.getModifierGroups) {
        setModifierGroups(
          response.getModifierGroups.map((el) => ({
            _id: el._id,
            name: el.name.value,
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

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [availableCaption, setAvailableCaption] = useState(
    "are you sure you want to block the user."
  );
  const handleDeleteItem = (_id: string) => {
    setshowDeleteConfirmationModal(true);
    setSelectedItemId(_id);
    setAvailableCaption("are you sure you want to delete this item?");
  };
  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-3 justify-center">
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-blue-500 cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
    </div>
  );

  const { setEditModGroupId, setisEditModGroup } = useModGroupStore();

  const handleEditItem = (_id: string) => {
    setisAddModifierGroupModalOpen(true);
    setEditModGroupId(_id);
    setisEditModGroup(true);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.deleteModifier({ id: selectedItemId });
      if (response && response.deleteModifier) {
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
  const headings = [
    { title: "Name", dataKey: "name" },

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
            // className=""
            onClick={handleDeleteConfirmation}
          >
            Yes
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default Modifiers;
