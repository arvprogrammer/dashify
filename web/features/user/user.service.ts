import { apiFetch } from "@/lib/http";
import { User } from "./user.type";

const API_URL = "/api/proxy/user";

export const userService = {
    me: () =>
        apiFetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }).then(res => res.json()),

    profile: (user: Partial<User>) =>
        apiFetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(user),
        }).then(res => res.json()),

    changePassword: async ( data: { currentPassword: string, newPassword: string; }) => {
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
};
