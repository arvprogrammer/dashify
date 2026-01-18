import { Session } from "@/features/user/session/session.type";
import { apiFetch } from "@/lib/http";
import { ListResponse } from "@/shared/types/pagination";

const API_URL = "/api/proxy/admin/users";

export const adminSessionService = {
    getAll: async (params: { userId: string, page?: number; limit?: number; }) => {
        const qs = new URLSearchParams({
            page: String(params.page ?? 1),
            limit: String(params.limit ?? 10),
        });
        const res = await apiFetch(`${API_URL}/${params.userId}/sessions?${qs.toString()}`, {
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

    revokeAll: async (userId: string) => {
        const res = await apiFetch(`${API_URL}/${userId}/sessions`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to logout session");
    },

    revoke: async (userId: string, sessionId: string) => {
        const res = await apiFetch(`${API_URL}/${userId}/sessions/${sessionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to logout session");
    }
};
