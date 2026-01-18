import { create } from "zustand";
import { Task } from "./task.type";
import { PaginationMeta } from "@/shared/types/pagination";
import { apiFetch } from "@/lib/http";

type TasksState = {
    loading: boolean;
    meta?: PaginationMeta;
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    removeTask: (id: string) => void;
    fetchTasks: (page?: number, limit?: number) => Promise<void>;
};

export const useTasksStore = create<TasksState>((set) => ({
    loading: false,
    meta: undefined,
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (task) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
    removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    fetchTasks: async (page = 1, limit = 10) => {
        set({ loading: true });
        const data = await apiFetch(`/api/proxy/task?page=${page}&limit=${limit}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }).then((r) =>
            r.json()
        );

        set({
            tasks: data.items,
            meta: data.meta,
            loading: false,
        });
    }
}));
