import { User } from "../user/user.type";

export interface Task {
    id: string;
    title: string;
    description?: string;
    date?: Date;
    time?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'DONE' | 'TODO' | 'IN_PROGRESS';
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    userId?: string;
    user?: User;
}