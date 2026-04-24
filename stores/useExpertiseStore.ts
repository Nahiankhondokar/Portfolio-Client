// stores/useExpertiseStore.ts
import { Expertise } from "@/app/(dashboard)/dashboard/expertise/interface/Expertise";
import { create } from "zustand";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {apiFetch} from "@/lib/api";
import {ApiResponse} from "@/type/api-response";

type Mode = "create" | "edit";

interface ExpertiseState {
  // modal actions
  openCreateModal: () => void;
  openEditModal: (expertise: Expertise) => void;
  closeModal: () => void;
  mode: Mode;
  modalOpen: boolean;

  pagination: PaginationResponse<Expertise>['meta'] | null;
  expertises: Expertise[];
  setExpertises: (items: Expertise[]) => void;
  selectedExpertise: Expertise | null;

  fetchExpertise: (page?: number, limit?: number) => Promise<void>
  createExpertise: (data: FormData) => Promise<Expertise>
  updateExpertise: (id: number, data: FormData) => Promise<void>;
  deleteExpertise: (id: number) => Promise<void>;

  loading: boolean;
  error?: string | null;
}

export const useExpertiseStore = create<ExpertiseState>((set, get) => ({
  expertises: [],
  setExpertises:  (items) => set({ expertises: items }),
  selectedExpertise: null,
  pagination: null,

  loading: false,
  error: null,
  mode: "create",
  modalOpen: false,

  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedExpertise: null,
      }),
  openEditModal: (expertise: Expertise) =>
      set({
        modalOpen: true,
        mode: "edit",
        selectedExpertise: expertise,
      }),
  closeModal: () =>
      set({
        modalOpen: false,
        error: null,
        selectedExpertise: null,
      }),

  fetchExpertise: async (page = 1, limit = 10) => {
    set({loading: true, error: null});

    try {
      const res = await apiFetch<PaginationResponse<Expertise>>(
          `expertise?page=${page}&limit=${limit}`
      );

      set({
        expertises: res.data,
        pagination: res.meta,
        loading: false,
      });
    }catch (err: unknown){
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },
  createExpertise: async (data: FormData) => {
    set({ loading: true, error: null});

    try {
      const res = await apiFetch<ApiResponse<Expertise>>("expertise",{
        method : "POST",
        body: data
      });

      set((state) => ({
        expertises: [res.data, ...state.expertises],
        loading: false,
        modalOpen: false,
        selectedExpertise: null,
      }));

      return res.data;
    }catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },

  updateExpertise: async (id: number, data: FormData) => {
    set({ loading: true, error: null });

    try {
      await apiFetch<ApiResponse<Expertise>>(
          `expertise/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchExpertise();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedExpertise: null,
      }));
    } catch (err: unknown){
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  },

  deleteExpertise: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`expertise/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        expertises: state.expertises.filter((exp) => exp.id !== id),
        loading: false,
      }));
    } catch (err: unknown){
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: message });
      throw err;
    }
  }
}));
