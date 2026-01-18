"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusIcon, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { adminUserService } from "../admin-user.service";
import { useAdminUsersStore } from "../admin-users.store";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Zod schema ---
const userSchema = z.object({
    name: z.string().optional(),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(6, "Password is required"),
    role: z.enum(['ADMIN', 'USER']).optional(),
    isActive: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AdminCreateUser() {
    const { addUser } = useAdminUsersStore();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            password: undefined,
            role: 'USER',
            isActive: false
        }
    });

    const onSubmit = async (data: UserFormData) => {
        const finalData = { ...data };
        try {
            const user = await adminUserService.create(finalData);
            addUser(user);
            reset();
            toast.success("User created successfully");
            router.push('/admin/users');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCreate = async () => {
        router.push(`/admin/users`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                    <CardDescription>Use the form below to create a new user.</CardDescription>
                    <CardAction>
                        <Button variant={"outline"} type="button" onClick={handleCreate}><Users /> All Users</Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Title */}
                    <Label htmlFor="user-name">Name</Label>
                    <Input id="user-name" autoComplete="name" placeholder="Name of the user" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                    {/* Email */}
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" autoComplete="email" placeholder="Email of the user" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    {/* Password */}
                    <Label htmlFor="user-password">Password</Label>
                    <Input id="user-password" autoComplete="new-password" type="password" placeholder="Password of the user" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    {/* Role */}
                    <Label htmlFor="user-role">Role</Label>
                    <small>The role of the user indicates their permissions.</small>
                    <Select value={watch("role")}
                        onValueChange={(value) => setValue("role", value as any, { shouldValidate: true })}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Select a role" id="user-role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>User Role</SelectLabel>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

                    {/* Switch */}
                    <Label htmlFor="user-isActive">Active</Label>
                    <Switch checked={watch("isActive")} onCheckedChange={(checked) => setValue("isActive", checked)} id="user-isActive" />

                    <div className="flex gap-2">
                        <Button disabled={isSubmitting} type="submit">
                            <Plus /> {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};
