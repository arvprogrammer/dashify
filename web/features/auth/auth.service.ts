const API_URL = "/api/proxy/auth";

export const authService = {
    register: (name: string, email: string, password: string) =>
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "register", name, email, password }),
            credentials: "include",
        }).then(res => res.json()),

    login: (email: string, password: string) =>
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", email, password }),
            credentials: "include",
        }).then(res => res.json()),

    refresh: () =>
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "refresh" }),
            credentials: "include",
        }).then(res => res.json()),

    logout: () =>
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" }),
            credentials: "include",
        }).then(res => res.json()),
};
