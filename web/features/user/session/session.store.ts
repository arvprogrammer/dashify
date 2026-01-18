import { apiFetch } from "@/lib/http";
import { PaginationMeta } from "@/shared/types/pagination";
import { create } from "zustand";
import { Session } from "./session.type";
import { sessionService } from "./session.service";

type SessionsState = {
    loading: boolean;
    meta?: PaginationMeta;
    sessions: Session[];
    fetchSessions: (page?: number, limit?: number) => Promise<void>;
};

export const useSessionStore = create<SessionsState>((set) => ({
    loading: false,
    meta: undefined,
    sessions: [],
    fetchSessions: async (page = 1, limit = 10) => {
        set({ loading: true });
        const data = await sessionService.getAll({ page, limit });
        set({
            sessions: data.items,
            meta: data.meta,
            loading: false,
        });
    }
}));
