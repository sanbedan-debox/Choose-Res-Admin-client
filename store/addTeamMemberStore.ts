// store/useAddTeamMemberFormStore.ts
import { create } from 'zustand';

interface IFormInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: { value: string; label: string };
    restaurant: { value: string; label: string }[];
    whatsApp: boolean;
    emailPref: boolean;
}

interface AddTeamMemberFormState {
    form: IFormInput;
    setFormValue: (field: keyof IFormInput, value: any) => void;
    resetForm: () => void;
}

const useAddTeamMemberFormStore = create<AddTeamMemberFormState>((set) => ({
    form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: { value: '', label: '' },
        restaurant: [],
        whatsApp: false,
        emailPref: false,
    },
    setFormValue: (field, value) => set((state) => ({
        form: {
            ...state.form,
            [field]: value,
        },
    })),
    resetForm: () => set({
        form: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: { value: '', label: '' },
            restaurant: [],
            whatsApp: false,
            emailPref: false,
        },
    }),
}));

export default useAddTeamMemberFormStore;
