import { create } from "zustand";
import { User } from "./user.type";

interface UserState {
    user: User | null;
    setUser: (user: UserState["user"]) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
