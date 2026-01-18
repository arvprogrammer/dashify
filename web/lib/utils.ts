import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function splitDueDate(dueDate?: string) {
    if (!dueDate) return {};

    const d = new Date(dueDate);

    return {
        date: d,
        time: d.toTimeString().slice(0, 5),
    };
}

export function buildDueDate(date?: Date, time?: string): string | undefined {
    if (!date) return undefined;
    console.log('build date', { date });

    const d = new Date(date);

    if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        d.setHours(hours, minutes, 0, 0);
    }

    return d.toISOString();
}