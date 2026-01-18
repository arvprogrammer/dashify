"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/features/user/user.service";
import { useUserStore } from "@/features/user/user.store";
import { User } from "@/features/user/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Validation schema
const profileSchema = z
    .object({
        email: z.email(),
        name: z.string().optional(),
    });

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, setUser } = useUserStore();

    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email,
            });
        }
    }, [user, reset]);


    const onSubmit = async (data: ProfileFormData) => {
        const payload: Partial<User> = {};
        if (data.name !== user?.name) payload.name = data.name;

        if (user?.role === 'ADMIN' && data.email !== user?.email) payload.email = data.email;

        try {
            const updated = await userService.profile(
                payload
            );
            setUser(updated);
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent className="grid gap-4">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}

                        <Label htmlFor="email">Email</Label>
                        <Input id="email" {...register("email")} disabled={user?.role !== 'ADMIN'} />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}

                        <div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
