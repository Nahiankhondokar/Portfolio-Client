// stores/useProjectStore.ts
import {Project} from "@/app/(dashboard)/dashboard/project/interface/Project";
import { create } from "zustand";
import {apiFetch} from "@/lib/api";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {ApiResponse} from "@/type/api-response";

type Mode = "create" | "edit";

interface projectState {
  selectedProject: Project | null;
  projects: Project[];
  setProjects: (items: Project[]) => void;
  loading: boolean;
  error?: string | null;
  pagination: PaginationResponse<Project>["meta"] | null;

  // actions
  openCreateModal: () => void;
  openEditModal: (project: Project) => void;
  closeModal: () => void;

  // Modals details
  mode: Mode,
  modalOpen : boolean

  // Methods
  fetchProject: (page?: number, limit?: number) => Promise<void>;
  createProject: (data: FormData) => Promise<Project>
  updateProject: (id: number, data: FormData) => Promise<void>
  deleteProject: (id: number) => Promise<void>
}

export const useProjectStore = create<projectState>((set, get) => ({
  selectedProject: null,
  projects: [],
  pagination: null,
  loading: false,
  error: null,

  modalOpen: false,
  mode: "create",

  setProjects: (items) => set({ projects: items }),
  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedProject: null,
      }),

  openEditModal: (project: Project) => {
    set({
      modalOpen: true,
      mode: "edit",
      selectedProject: project,
    });
    console.log("openEditModal called with:", get().selectedProject);
  },

  closeModal: () =>
      set({
        modalOpen: false,
        selectedProject: null,
        error: null,
      }),

  fetchProject: async (page = 1, limit = 10) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<PaginationResponse<Project>>(
          `projects?page=${page}&limit=${limit}`
      );

      set({
        projects: res.data,
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
  createProject: async (data: FormData) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<ApiResponse<Project>>('projects',{
        method : "POST",
        body : data
      })

      set((state)=> ({
        loading: false,
        projects: [res.data, ...state.projects],
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
  updateProject: async (id: number, data: FormData) => {
    set({ loading: true });

    try {
      await apiFetch<{ data: Project }>(
          `projects/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchProject();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedProject: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: "Update failed" });
      throw err;
    }
  },
  deleteProject: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`projects/${id}`, {
        method: "DELETE",
      });

      // ✅ Remove from store instantly
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
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
