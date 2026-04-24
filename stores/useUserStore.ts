"use client";

import { create } from "zustand";
import {mockUsers} from "@/app/(dashboard)/dashboard/user/mockUsers/mockUsers";
import { User } from "@/app/(dashboard)/dashboard/user/type/user";
import {apiFetch} from "@/lib/api";
import {PaginationResponse} from "@/type/pagination/PaginationType";
import {Service} from "@/app/(dashboard)/dashboard/service/interface/Service";
import {ApiResponse} from "@/type/api-response";


interface UserState {
  users: User[];
  selectedUser: User | null,
  loading: boolean,
  error?: string | null,
  pagination: PaginationResponse<User>["meta"] | null;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  createUser: (data: FormData) => Promise<User>;
  updateUser: (id: number, data: FormData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  // detailsUser: (id: number) => Promise<User | undefined>;

  // actions
  openCreateModal: () => void;
  openEditModal: (user : User) => void;
  closeModal: () => void;
  modalOpen: boolean,
  mode: string,

}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: null,
  modalOpen: false,
  mode: "create",

  // actions
  openCreateModal: () =>
      set({
        modalOpen: true,
        mode: "create",
        selectedUser: null,
      }),
  openEditModal: (user: User) => {
    set({
          modalOpen: true,
          mode: "edit",
          selectedUser: user,
        });
  },
  closeModal: () =>
      set({
        modalOpen: false,
        selectedUser: null,
        error: null,
      }),

  // Fetch all users
  fetchUsers: async (page = 1, limit=10) => {
    try {
      const res = await apiFetch<PaginationResponse<User>>(`users?page=${page}&limit=${limit}`);

      return set({
        users: res.data,
        pagination: res.meta
      });
      
    } catch (err) {
      console.error("Fetch users failed", err);
    }
  },

  // Create a new user
  createUser: async (data) => {
    set({loading: true, error: null});
    try {
      const res = await apiFetch<ApiResponse<User>>('users',{
        method : "POST",
        body : data
      })

      set((state)=> ({
        loading: false,
        users: [res.data, ...state.users],
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

  // Update existing user
  updateUser: async (id: number, data: FormData) => {
    set({ loading: true });

    try {
      await apiFetch<{ data: User }>(
          `users/${id}`,
          {
            method: "POST", // _method: PUT is appended in the form via FormData
            body: data,
          }
      );

      await get().fetchUsers();
      set(() => ({
        loading: false,
        modalOpen: false,
        selectedUser: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: "Update failed" });
      throw err;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    set({ loading: true, error: null });

    try {
      await apiFetch(`users/${id}`, {
        method: "DELETE",
      });

      // ✅ Remove from store instantly
      set((state) => ({
        users: state.users.filter((users) => users.id !== id),
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
