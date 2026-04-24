// stores/useExperienceStore.ts
import {Experience} from "@/app/(dashboard)/dashboard/experience/interface/Experience";
import { create } from "zustand";
import {apiFetch} from "@/lib/api";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {ApiResponse} from "@/type/api-response";

type Mode = "create" | "edit";

interface ExperienceState {
  selectedExperience: Experience | null;
  experiences: Experience[];
  pagination: PaginationResponse<Experience>["meta"] | null;
  setExperiences: (items: Experience[]) => void;

  fetchExperiences: (page?: number) => Promise<void>;
  createExperience: (data: FormData) => Promise<Experience>;
  updateExperience: (id: number, data: FormData) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>

  loading: boolean;
  error?: string | null;

  // modal
  modalOpen: boolean;
  mode: Mode;

  // actions
  openCreateModal: () => void;
  openEditModal: (exp: Experience) => void;
  closeModal: () => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  selectedExperience: null,
  experiences: [],
  setExperiences: (items) => set({ experiences: items }),

  pagination: null,
  modalOpen: false,
  mode: "create",

  loading: false,
  error: null,

  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedExperience: null,
      }),

  openEditModal: (exp: Experience) => {
    set({
      modalOpen: true,
      mode: "edit",
      selectedExperience: exp,
    });
    console.log("openEditModal called with:", get().selectedExperience);
  },

  closeModal: () =>
      set({
        modalOpen: false,
        selectedExperience: null,
        error: null,
      }),

  fetchExperiences: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch<PaginationResponse<Experience>>(
          `experiences?page=${page}&limit=${limit}`
      );

      set({
        experiences: res.data,
        pagination: res.meta,
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },
  createExperience: async (data: FormData) => {
    set({ loading: true, error: null});

    try {
      const res = await apiFetch<ApiResponse<Experience>>("experiences",{
        method : "POST",
        body: data
      });

      set((state) => ({
        experiences: [res.data, ...state.experiences],
        loading: false,
        modalOpen: false,
        selectedExperience: null,
      }));

      return res.data;
    }catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },
  updateExperience: async (id, data) => {
    set({ loading: true });

    try {
      await apiFetch<{ data: Experience }>(
          `experiences/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchExperiences();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedExperience: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: "Update failed" });
      throw err;
    }
  },
  deleteExperience: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`experiences/${id}`, {
        method: "DELETE",
      });

      // ✅ Remove from store instantly
      set((state) => ({
        experiences: state.experiences.filter((exp) => exp.id !== id),
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