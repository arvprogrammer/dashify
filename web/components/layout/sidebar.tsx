'use client';

import { useUserStore } from "@/features/user/user.store";
import logo from "@/public/logo.png";
import { LayoutDashboard, ListTodo, Users } from "lucide-react";
import Image from "next/image";
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

export function Sidebar() {
    const { user } = useUserStore();
    return (
        <aside className="w-64 bg-white border-r p-4 flex flex-col">
            <div className="flex justify-center w-full">
                <Image src={logo} alt="Dashify Logo" width={150} className="mb-8" loading="eager" />
            </div>
            <nav className="flex flex-col space-y-2 text-sm">
                {user?.role === 'ADMIN' &&
                    (<>
                        <h2 className="mb-0 text-gray-500 text-center">Admin Dashboard</h2>
                        <hr className="my-1" />
                        {adminSidebarLinks.map(link => (
                            <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-sm">
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </>)
                }

                <h2 className="mt-8 mb-0 text-gray-500 text-center">User Dashboard</h2>
                <hr className="my-2" />
                {userSidebarLinks.map(link => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-sm">
                        {link.icon} {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}