import { AppSidebar } from "@/components/layout/appSidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthProvider from "@/features/auth/auth.provider";
import UserProvider from "@/features/user/user.provider";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default async function DashboardLayout({ children }: { children: ReactNode; }) {

    return (
        <AuthProvider>
            <UserProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full flex flex-col h-screen bg-gray-50">
                        <Header />
                        <Toaster richColors position="top-center" />
                        <div className="w-full p-4">{children}</div>
                    </main>
                </SidebarProvider>
            </UserProvider>
        </AuthProvider>
    );
}