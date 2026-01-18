import { User } from "@/features/user/user.type";
import { PaginationMeta } from "@/shared/types/pagination";
import { create } from "zustand";
import { adminUserService } from "./admin-user.service";

type UsersState = {
    loading: boolean;
    meta?: PaginationMeta;
    users: User[];
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    removeUser: (id: string) => void;
    fetchUsers: (page?: number, limit?: number) => Promise<void>;
};

export const useAdminUsersStore = create<UsersState>((set) => ({
    loading: false,
    meta: undefined,
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (user) =>
        set((state) => ({
            users: state.users.map((u) => (u.id === user.id ? user : u)),
        })),
    removeUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
    fetchUsers: async (page = 1, limit = 10) => {
        set({ loading: true });
        const data = await adminUserService.getAll({ page, limit });
        set({
            users: data.items,
            meta: data.meta,
            loading: false,
        });
    }
}));
