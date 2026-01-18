import { apiFetch } from "@/lib/http";
import { ListResponse } from "@/shared/types/pagination";
import { Session } from "./session.type";

const API_URL = "/api/proxy/user/sessions";

export const sessionService = {
    getAll: async (params: { page?: number; limit?: number; }) => {
        const qs = new URLSearchParams({
            page: String(params.page ?? 1),
            limit: String(params.limit ?? 10),
        });
        const res = await apiFetch(`${API_URL}?${qs.toString()}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const sessions: ListResponse<Session> = await res.json();
        return {
            items: sessions.items,
            meta: sessions.meta,
        };
    },

    revokeAll: async () => {
        const res = await apiFetch(`${API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to revoke all sessions");
    },

    revoke: async (sessionId: string) => {
        const res = await apiFetch(`${API_URL}?sessionId=${sessionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to revoke session");
    }
};
