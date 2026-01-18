"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/features/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";

// Validation schema
const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            await userService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success("Password changed successfully");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.message || "Failed to change password");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Change Password</h1>
                <p className="text-sm text-muted-foreground">
                    Update your password for your account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        {...register("currentPassword")}
                    />
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Use a strong new password"
                        {...register("newPassword")}
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter New Password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Lock />{isSubmitting ? "Saving..." : "Change Password"}
                </Button>
            </form>
        </div>
    );
}
