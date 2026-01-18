import { authService } from "@/features/auth/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (
    input: RequestInfo,
    init?: RequestInit,
    retry = true
): Promise<any> => {

    const headers = new Headers(init?.headers);

    const res = await fetch(`${API_URL}${input}`, { ...init, headers, credentials: "include" });

    if (res.status === 401) {
        if (retry) {
            // try refresh
            try {
                await authService.refresh();
                return apiFetch(input, init, false); // retry once
            } catch (e) {
                throw new Error("Not authenticated");
            }
        } else {
            // redirect to signin after failed refresh
            window.location.href = "/signin";
        }
    }

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "API Error");
    }

    return res;
};
