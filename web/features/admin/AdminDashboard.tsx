'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTasksStore } from "./tasks/admin-tasks.store";
import { useEffect } from "react";
import { useAdminUsersStore } from "./users/admin-users.store";
import { Edit, Eye, ListTodo, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
    const { meta, tasks, fetchTasks } = useAdminTasksStore();
    const { meta: usersMeta, users, fetchUsers } = useAdminUsersStore();
    const router = useRouter();

    const handleUserView = (userId: string) => {
        router.push(`/admin/users/${userId}/update`);
    };

    const handleTaskView = (taskId: string) => {
        router.push(`/admin/tasks/${taskId}/update`);
    };

    useEffect(() => {
        fetchTasks(1, 5);
        fetchUsers(1, 5);
    }, [fetchTasks, fetchUsers]);

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-center">Total Users</CardTitle></CardHeader>
                    <CardContent className="text-center">{usersMeta?.total ?? 0}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-center">Total Tasks</CardTitle></CardHeader>
                    <CardContent className="text-center">{meta?.total ?? 0}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-center">Last 5 Users</CardTitle></CardHeader>
                    <CardContent>
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                                <span className="uppercase flex gap-1 items-center font-semibold">{user.email}</span>
                                <small className="hidden md:block">{user.role}</small>
                                <Button variant={'default'} size={'sm'} onClick={() => handleUserView(user.id)}><Eye /> View</Button>
                            </div>
                        ))}
                        {users.length > 0 && (
                            <Link className='mt-4 block text-center text-primary' href="/admin/users">View all users</Link>
                        )}

                        {users.length === 0 && (
                            <div className='text-center text-gray-500'>There are no users available.</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-center">Last 5 Tasks</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        {tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                                <span className="uppercase flex gap-1 items-center font-semibold">{task.title}</span>
                                <small>{task.status.toLocaleUpperCase()} | {task.priority}</small>
                                <Button variant={'default'} size={'sm'} onClick={() => handleTaskView(task.id)}><Eye /> View</Button>
                            </div>
                        ))}
                        {tasks.length > 0 && (
                            <Link className='mt-4 block text-center text-primary' href="/admin/tasks">View all tasks</Link>
                        )}

                        {tasks.length === 0 && (
                            <div className='text-center text-gray-500'>There are no tasks available.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
