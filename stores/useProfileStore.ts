
import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/type/api-response";
import { Profile } from "@/app/(dashboard)/dashboard/profile/interface/Profile";


interface ProfileState {
    profile: Profile | null;
    setProfile: (items: Profile) => void;
    loading: boolean;
    error?: string | null;

    // Methods
    fetchProfile: () => Promise<void>;
    updateProfile: (data: FormData) => Promise<void>;
    updatePassword: (data: FormData) => Promise<void>;
    uploadResume: (file: FormData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    setProfile: (items) => set({ profile: items }),
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiFetch<ApiResponse<Profile>>(
                `profile`
            );

            set({
                profile: res.data,
                loading: false,
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ loading: false, error: err.message ?? "Fetching failed" });
            } else {
                set({ loading: false, error: "An unknown error occurred" });
            }
            throw err;
        }
    },
    updateProfile: async (data: FormData) => {
        set({ loading: true, error: null });
        try {
            const res = await apiFetch<ApiResponse<Profile>>(
                `profile/update`, {
                method: "POST",
                body: data
            }
            );

            set({
                profile: res.data,
                loading: false,
            });

            get().fetchProfile();
        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ loading: false, error: err.message ?? "Fetching failed" });
            } else {
                set({ loading: false, error: "An unknown error occurred" });
            }
            throw err;
        }
    },
    updatePassword: async (data: FormData) => {
        set({ loading: true, error: null });
        try {
            await apiFetch<ApiResponse<Profile>>(
                `password/update`, {
                method: "PATCH",
                body: data
            }
            );

        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ loading: false, error: err.message ?? "Fetching failed" });
            } else {
                set({ loading: false, error: "An unknown error occurred" });
            }
            throw err;
        }
    },
    uploadResume: async (formData: FormData) => {
        const res = await apiFetch<ApiResponse<unknown>>('resume/upload', {
            method: 'POST',
            body: formData,
        });

        // Refresh your overview data here
    }
}));
