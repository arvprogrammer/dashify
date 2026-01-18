'use client';

import { useProtected } from "./useProtected";

export default function AuthProvider({ children }: { children: React.ReactNode; }) {

    useProtected();

    return children;
}
