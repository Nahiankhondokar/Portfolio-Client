// stores/useServiceStore.ts
import { Service } from "@/app/(dashboard)/dashboard/service/interface/Service";
import { create } from "zustand";
import {apiFetch} from "@/lib/api";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {Experience} from "@/app/(dashboard)/dashboard/experience/interface/Experience";
import {ApiResponse} from "@/type/api-response";

type Mode = "create" | "edit";

interface serviceState {
  selectedService: Service | null;
  services: Service[];
  setServices: (items: Service[]) => void;
  loading: boolean;
  error?: string | null;
  pagination: PaginationResponse<Experience>["meta"] | null;

  // actions
  openCreateModal: () => void;
  openEditModal: (service: Service) => void;
  closeModal: () => void;

  // Modals details
  mode: Mode,
  modalOpen : boolean

  // Methods
  fetchService: (page?: number, limit?: number) => Promise<void>;
  createService: (data: FormData) => Promise<Service>
  updateService: (id: number, data: FormData) => Promise<void>
  deleteService: (id: number) => Promise<void>
}

export const useServiceStore = create<serviceState>((set, get) => ({
  selectedService: null,
  services: [],
  pagination: null,
  loading: false,
  error: null,

  modalOpen: false,
  mode: "create",

  setServices: (items) => set({ services: items }),
  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedService: null,
      }),

  openEditModal: (service: Service) => {
    set({
      modalOpen: true,
      mode: "edit",
      selectedService: service,
    });
    console.log("openEditModal called with:", get().selectedService);
  },

  closeModal: () =>
      set({
        modalOpen: false,
        selectedService: null,
        error: null,
      }),

  fetchService: async (page = 1, limit = 10) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<PaginationResponse<Service>>(
          `services?page=${page}&limit=${limit}`
      );

      set({
        services: res.data,
        pagination: res.meta,
        loading: false,
      });
    }catch (err: unknown){
      if (err instanceof Error) {
        set({ loading: false, error: err.message ?? "Fetching failed" });
      } else {
        set({ loading: false, error: "An unknown error occurred" });
      }
      throw err;
    }
  },
  createService: async (data: FormData) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<ApiResponse<Service>>('services',{
        method : "POST",
        body : data
      })

      set((state)=> ({
        loading: false,
        services: [res.data, ...state.services],
        modalOpen: false,          // 🔥 close modal
      }));

      return res.data;
    }catch (err: unknown){
      if (err instanceof Error) {
        set({ loading: false, error: err.message ?? "Create failed" });
      } else {
        set({ loading: false, error: "An unknown error occurred" });
      }
      throw err;
    }
  },
  updateService: async (id: number, data: FormData) => {
    set({ loading: true });

    try {
      await apiFetch<{ data: Service }>(
          `services/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchService();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedService: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: "Update failed" });
      throw err;
    }
  },
  deleteService: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`services/${id}`, {
        method: "DELETE",
      });

      // ✅ Remove from store instantly
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        loading: false,
        error: "Delete failed",
      });
      throw err;
    }
  }
}));
