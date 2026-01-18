import { AppSidebar } from "@/components/layout/appSidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminProvider from "@/features/admin/admin.provider";
import UserProvider from "@/features/user/user.provider";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
    return (
        <AdminProvider>
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
        </AdminProvider>
    );
}
