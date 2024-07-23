import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import RoopTable from "@/components/common/table/table";
import useGlobalStore from "@/store/global";
import useMenuOptionsStore from "@/store/menuOptions";
import useModStore from "@/store/modifiers";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoDuplicateOutline } from "react-icons/io5";

const Modifiers: React.FC = () => {
  const [modifier, setModifier] = useState<any>();
  const { setToastData } = useGlobalStore();
  const { setisAddModifierModalOpen, fetchMenuDatas } = useMenuOptionsStore();
  const [tableLoading, setTableLoading] = useState(false);
  const { setEditModId, setisEditMod, setisDuplicateMods } = useModStore();

  const fetchModifiers = async () => {
    setTableLoading(true);
    try {
      const response = await sdk.getModifiers();
      if (response && response.getModifiers) {
        setModifier(
          response.getModifiers.map((el) => ({
            _id: el._id,
            name: el.name.value,
            price: el.price.value,
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
    fetchModifiers();
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
    setAvailableCaption(
      "By clicking yes the selected Modifier / Modifiers will be deleted. This action cannot be undone."
    );
  };

  const handleEditItem = (_id: string) => {
    setisAddModifierModalOpen(true);
    setEditModId(_id);
    setisEditMod(true);
    setisDuplicateMods(false);
  };

  const handleDuplcateCategory = (_id: string) => {
    setisAddModifierModalOpen(true);
    setEditModId(_id);
    setisDuplicateMods(true);
    setisEditMod(false);
  };

  const renderActions = (rowData: { _id: string }) => (
    <div className="flex space-x-3 justify-center">
      <FaTrash
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDeleteItem(rowData._id)}
      />
      <FaEdit
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleEditItem(rowData._id)}
      />
      <IoDuplicateOutline
        className="text-primary text-lg cursor-pointer"
        onClick={() => handleDuplcateCategory(rowData._id)}
      />
    </div>
  );

  const headings = [
    { title: "Name", dataKey: "name" },
    { title: "Price", dataKey: "price" },
    { title: "Actions", dataKey: "_id", render: renderActions },
  ];

  const mainActions = [
    {
      label: "Add Modifiers",
      onClick: () => setisAddModifierModalOpen(true),
    },
  ];
  const handleDeleteCloseConfirmationModal = () => {
    setshowDeleteConfirmationModal(false);
    setSelectedItemId("");
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    setBtnLoading(true);
    try {
      const response = await sdk.deleteModifier({ id: selectedItemId });
      if (response && response.deleteModifier) {
        fetchModifiers();
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
        loading={tableLoading}
        itemsPerPage={10}
        headings={headings}
        data={modifier}
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
