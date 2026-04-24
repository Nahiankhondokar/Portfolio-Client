
import { create } from "zustand";
import {apiFetch} from "@/lib/api";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {Experience} from "@/app/(dashboard)/dashboard/experience/interface/Experience";
import {ApiResponse} from "@/type/api-response";
import {Portfolio} from "@/app/(dashboard)/dashboard/portfolio/interface/Portfolio";

type Mode = "create" | "edit";

interface portfolioState {
  selectedPortfolio: Portfolio | null;
  portfolios: Portfolio[];
  setPortfolios: (items: Portfolio[]) => void;
  loading: boolean;
  error?: string | null;
  pagination: PaginationResponse<Experience>["meta"] | null;

  // actions
  openCreateModal: () => void;
  openEditModal: (portfolio: Portfolio) => void;
  closeModal: () => void;

  // Modals details
  mode: Mode,
  modalOpen : boolean

  // Methods
  fetchPortfolio: (page?: number, limit?: number) => Promise<void>;
  createPortfolio: (data: FormData) => Promise<Portfolio>
  updatePortfolio: (id: number, data: FormData) => Promise<void>
  deletePortfolio: (id: number) => Promise<void>
}

export const usePortfolioStore = create<portfolioState>((set, get) => ({
  selectedPortfolio: null,
  portfolios: [],
  pagination: null,
  loading: false,
  error: null,

  modalOpen: false,
  mode: "create",

  setPortfolios: (items) => set({ portfolios: items }),
  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedPortfolio: null,
      }),

  openEditModal: (Portfolio: Portfolio) => {
    set({
      modalOpen: true,
      mode: "edit",
      selectedPortfolio: Portfolio,
    });
    console.log("openEditModal called with:", get().selectedPortfolio);
  },
  closeModal: () =>
      set({
        modalOpen: false,
        selectedPortfolio: null,
        error: null,
      }),

  fetchPortfolio: async (page = 1, limit = 10) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<PaginationResponse<Portfolio>>(
          `portfolios?page=${page}&limit=${limit}`
      );

      set({
        portfolios: res.data,
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
  createPortfolio: async (data: FormData) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<ApiResponse<Portfolio>>('portfolios',{
        method : "POST",
        body : data
      })

      set((state)=> ({
        loading: false,
        portfolios: [res.data, ...state.portfolios],
        modalOpen: false,
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
  updatePortfolio: async (id: number, data: FormData) => {
    set({ loading: true });

    try {
      await apiFetch<{ data: Portfolio }>(
          `portfolios/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchPortfolio();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedPortfolio: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: "Update failed" });
      throw err;
    }
  },
  deletePortfolio: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`portfolios/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        portfolios: state.portfolios.filter((portfolio) => portfolio.id !== id),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        loading: false,
        error:  "Delete failed",
      });

      throw err;
    }
  }
}));
