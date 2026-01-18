"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "./auth.service";

export function useProtected() {
    const router = useRouter();
    useEffect(() => {
        authService
            .refresh()
            .then((data) => {
                if (data.statusCode === 401) {
                    router.replace("/signin");
                }
            })
            .catch(() => router.replace("/signin"));
    }, [router]);
}