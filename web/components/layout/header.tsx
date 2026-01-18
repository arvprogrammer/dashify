'use client';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authService } from "@/features/auth/auth.service";
import { useUserStore } from "@/features/user/user.store";
import {
    LockIcon,
    LogOutIcon,
    User,
    UserIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
    const router = useRouter();
    const handleProfile = async () => {
        router.push("/dashboard/profile");
    };
    const handleChangePassword = async () => {
        router.push("/dashboard/change-password");
    };
    const handleLogout = async () => {
        await authService.logout();
        router.replace("/signin");
    };
    const { user } = useUserStore();
    return (
        <header className="h-16 border-b px-6 flex items-center justify-between bg-white gap-4 mb-8">
            <SidebarTrigger />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><User /> {user?.name ? 'Welcome, ' + user?.name : "Account"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleProfile}>
                        <UserIcon />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleChangePassword}>
                        <LockIcon />
                        Change Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                        <LogOutIcon />
                        Signout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}