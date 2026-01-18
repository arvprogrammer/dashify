import { Session } from "@/features/user/session/session.type";
import { PaginationMeta } from "@/shared/types/pagination";
import { create } from "zustand";
import { adminSessionService } from "./admin-session.service";

type SessionsState = {
    loading: boolean;
    meta?: PaginationMeta;
    sessions: Session[];
    fetchSessions: (userId: string, page?: number, limit?: number) => Promise<void>;
};

export const useAdminSessionStore = create<SessionsState>((set) => ({
    loading: false,
    meta: undefined,
    sessions: [],
    fetchSessions: async (userId, page = 1, limit = 10) => {
        set({ loading: true });
        const data = await adminSessionService.getAll({ userId, page, limit });
        set({
            sessions: data.items,
            meta: data.meta,
            loading: false,
        });
    }
}));
