'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/features/user/user.store";
import { LayoutDashboard, ListTodo, Users } from "lucide-react";
import Link from "next/link";

const adminSidebarLinks = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { href: '/admin/tasks', label: 'All Tasks', icon: <ListTodo size={16} /> },
    { href: '/admin/users', label: 'All Users', icon: <Users size={16} /> },
];

const userSidebarLinks = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/tasks', label: 'My Tasks', icon: <ListTodo size={16} /> },
    { href: '/dashboard/devices', label: 'My Devices', icon: <ListTodo size={16} /> },
];

export function AppSidebar() {
    const { user } = useUserStore();
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                {user?.role === 'ADMIN' && <SidebarGroup>
                    <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminSidebarLinks.map(link => (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild>
                                        <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-sm">
                                            {link.icon} {link.label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>}
                <SidebarGroup>
                    <SidebarGroupLabel>User Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {userSidebarLinks.map(link => (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild>
                                        <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-sm">
                                            {link.icon} {link.label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}