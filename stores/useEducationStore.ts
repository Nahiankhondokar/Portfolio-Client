// stores/useExperienceStore.ts

import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { PaginationResponse } from "@/type/pagination/PaginationType";
import { ApiResponse } from "@/type/api-response";
import { Education } from "@/app/(dashboard)/dashboard/education/interface/Education";

type Mode = "create" | "edit";

interface EducationState {
  selectedEducation: Education | null;
  educations: Education[];
  pagination: PaginationResponse<Education>["meta"] | null;
  setEducations: (items: Education[]) => void;

  fetchEducations: (page?: number) => Promise<void>;
  createEducation: (data: FormData) => Promise<Education>;
  updateEducation: (id: number, data: FormData) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>

  loading: boolean;
  error?: string | null;

  // modal
  modalOpen: boolean;
  mode: Mode;

  // actions
  openCreateModal: () => void;
  openEditModal: (exp: Education) => void;
  closeModal: () => void;
}

export const useEducationStore = create<EducationState>((set, get) => ({
  selectedEducation: null,
  educations: [],
  setEducations: (items) => set({ educations: items }),

  pagination: null,
  modalOpen: false,
  mode: "create",

  loading: false,
  error: null,

  openCreateModal: () =>
    set({
      modalOpen: true,
      mode: "create",
      selectedEducation: null,
    }),

  openEditModal: (exp: Education) => {
    set({
      modalOpen: true,
      mode: "edit",
      selectedEducation: exp,
    });
    console.log("openEditModal called with:", get().selectedEducation);
  },

  closeModal: () =>
    set({
      modalOpen: false,
      selectedEducation: null,
      error: null,
    }),

  fetchEducations: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch<PaginationResponse<Education>>(
        `educations?page=${page}&limit=${limit}`
      );

      set({
        educations: res.data,
        pagination: res.meta,
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },
  createEducation: async (data: FormData) => {
    set({ loading: true, error: null });

    try {
      const res = await apiFetch<ApiResponse<Education>>("educations", {
        method: "POST",
        body: data
      });

      set((state) => ({
        educations: [res.data, ...state.educations],
        loading: false,
        modalOpen: false,
        selectedEducation: null,
      }));

      return res.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },
  updateEducation: async (id, data) => {
    set({ loading: true });

    try {
      const res = await apiFetch<{ data: Education }>(
        `educations/${id}`,
        {
          method: "POST", // or PUT with _method
          body: data,
        }
      );
    } catch (err: unknown) {
      set({
        loading: false,
        error: "Update failed",
      });
      throw err;
    }

    await get().fetchEducations();
    set((state) => ({
      loading: false,
      modalOpen: false,          // 🔥 close modal
      selectedEducation: null,  // 🔥 reset
    }));
  },
  deleteEducation: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`educations/${id}`, {
        method: "DELETE",
      });

      // ✅ Remove from store instantly
      set((state) => ({
        educations: state.educations.filter((edu) => edu.id !== id),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        loading: false,
        error: "Delete failed",
      });
      throw err;
    }
  },
}));