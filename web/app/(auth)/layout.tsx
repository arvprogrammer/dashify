import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: ReactNode; }) {
    return (
        <div className="min-h-screen flex items-center bg-primary justify-center px-4">
            <div className="w-full max-w-sm rounded-lg border bg-background p-6">
                {children}
                <Toaster richColors position="top-center" />
            </div>
        </div>
    );
}
