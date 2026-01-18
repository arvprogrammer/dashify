import { User } from "@/features/user/user.type";
import { apiFetch } from "@/lib/http";
import { ListResponse } from "@/shared/types/pagination";

const API_URL = "/api/proxy/admin/users";

export const adminUserService = {

    create: async (user: Partial<User>) => {
        const res = await apiFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create user");
        return await res.json();
    },

    getAll: async (params: { page?: number; limit?: number; }) => {
        const qs = new URLSearchParams({
            page: String(params.page ?? 1),
            limit: String(params.limit ?? 10),
        });
        const res = await apiFetch(`${API_URL}?${qs.toString()}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const users: ListResponse<User> = await res.json();
        return {
            items: users.items,
            meta: users.meta,
        };
    },

    get: async (userId: string) => {
        const res = await apiFetch(`${API_URL}/${userId}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        return await res.json();
    },

    update: (user: Partial<User>) =>
        apiFetch(`${API_URL}/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(user),
        }).then(res => res.json()),

    changePassword: async (data: { currentPassword: string, newPassword: string; }) => {
        const res = await apiFetch(`${API_URL}/change-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to change password");
        }

        return res.json();
    },

    remove: async (id: string) => {
        const res = await apiFetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete user");
        return await res.json();
    },
};
