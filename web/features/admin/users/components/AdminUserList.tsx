"use client";

import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";
import { useAdminUsersStore } from "@/features/admin/users/admin-users.store";
import { Edit, Laptop, PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { User } from "../../../user/user.type";
import { adminUserService } from "../admin-user.service";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmButton from "@/components/ConfirmButton";

export default function AdminUserList({ page = 1 }: { page: number; }) {
    const { users, meta, updateUser, fetchUsers, loading, removeUser } = useAdminUsersStore();
    const router = useRouter();

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const toggleActive = async (user: User) => {
        try {
            user.isActive = !user.isActive;
            const updated = await adminUserService.update(user);
            updateUser(updated);
            toast.success(`User ${updated.isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (user: User) => {
        try {
            await adminUserService.remove(user.id);
            removeUser(user.id);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCreate = async () => {
        router.push(`/admin/users/create`);
    };

    const handleUpdate = async (user: User) => {
        router.push(`/admin/users/${user.id}/update`);
    };

    const handleSessions = async (user: User) => {
        router.push(`/admin/users/${user.id}/sessions`);
    };

    if (loading) {
        return <div className="text-center mt-8 text-gray-500">Loading users...</div>;
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Users</h2>
                <Button variant={"outline"} onClick={handleCreate}><PlusIcon /> Create New User</Button>
            </div>
            {users.length > 0 && <>
                {users.map((user) => (
                    <Card key={user.id} className="max-w-2xl mx-auto mt-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <b>
                                            {user.email} ({user.name})
                                        </b>
                                    </div>
                                    <small><i>{user.role}</i> | <i>Created At {new Date(user.createdAt).toLocaleString()}</i></small>
                                </div>
                            </div>
                            <CardAction className="flex gap-2 items-center">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Switch checked={user.isActive} onCheckedChange={() => toggleActive(user)} id="user-isActive" />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{user.isActive ? 'Active' : 'Inactive'}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Button variant={'outline'} size="sm" onClick={() => handleSessions(user)}>
                                    <Laptop /> Devices
                                </Button>
                                <Button variant={'secondary'} size="sm" onClick={() => handleUpdate(user)}>
                                    <Edit /> Update
                                </Button>
                                <ConfirmButton
                                    title="Delete User"
                                    description={`Are you sure you want to delete this user?`}
                                    size={'sm'}
                                    onClick={() => handleDelete(user)}>
                                    <Trash /> Delete
                                </ConfirmButton>
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
                <Pagination page={page} meta={meta} />
            </>}

            {users.length === 0 && (
                <p className="text-center mt-32 text-gray-500">No users found. Create a new user to get started!</p>
            )}

        </div>
    );
}

