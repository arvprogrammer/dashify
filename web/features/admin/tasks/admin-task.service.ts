import { Task } from "@/features/task/task.type";
import { apiFetch } from "@/lib/http";
import { buildDueDate, splitDueDate } from "@/lib/utils";
import { PaginationMeta } from "@/shared/types/pagination";

export interface TaskListResponse {
    items: Task[];
    meta: PaginationMeta;
}

const API_URL = "/api/proxy/admin/tasks";

export const adminTasksService = {
    getAll: async (params: { page?: number; limit?: number; }) => {
        const qs = new URLSearchParams({
            page: String(params.page ?? 1),
            limit: String(params.limit ?? 10),
        });
        const res = await apiFetch(`${API_URL}?${qs.toString()}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const tasks: TaskListResponse = await res.json();
        return {
            items: tasks.items.map(({ dueDate, ...task }: any) => ({ ...task, ...splitDueDate(dueDate) })),
            meta: tasks.meta,
        };
    },

    get: async (taskId: string) => {
        const res = await apiFetch(`${API_URL}/${taskId}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const { dueDate, ...task } = await res.json();
        return { ...task, ...splitDueDate(dueDate) };
    },

    create: async (task: Partial<Task>) => {
        const payload = { ...task, dueDate: buildDueDate(task.date, task.time) };
        const res = await apiFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create task");
        const { dueDate, ...createdTask } = await res.json();
        return { ...createdTask, ...splitDueDate(dueDate) };
    },

    update: async (task: Task) => {
        const payload = { ...task, dueDate: buildDueDate(task.date, task.time) };
        const res = await apiFetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to update task");
        const { dueDate, ...updatedTask } = await res.json();
        return { ...updatedTask, ...splitDueDate(dueDate) };
    },

    remove: async (id: string) => {
        const res = await apiFetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete task");
        const { dueDate, ...removedTask } = await res.json();
        return { ...removedTask, ...splitDueDate(dueDate) };

    },
};
