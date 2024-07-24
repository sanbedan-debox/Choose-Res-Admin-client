import { create } from "zustand";

type UserManagementState = {
    isAddTeamMemberModalOpen: boolean;
    setIsAddTeamMemberModalOpen: (open: boolean) => void;

};

const useUserManagementStore = create<UserManagementState>((set) => ({
    isAddTeamMemberModalOpen: false,
    setIsAddTeamMemberModalOpen: (open: boolean) =>
        set({ isAddTeamMemberModalOpen: open }),

}));

export default useUserManagementStore;
