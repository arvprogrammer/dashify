"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/features/auth/auth.service";
import { useUserStore } from "@/features/user/user.store";
import logo from "@/public/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sign } from "crypto";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignIn() {
    const { setUser } = useUserStore();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (formData: LoginFormData) => {
        try {
            const data = await authService.login(formData.email, formData.password);
            if ("statusCode" in data) {
                toast.error(data.message);
                return;
            }
            setUser(data);
            if (data.role === 'ADMIN') {
                router.push("/admin");
                return;
            }
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-center items-center w-full">
                <p className="text-sm text-muted-foreground w-full border rounded-sm p-2">
                    You can use the following demo accounts<br /><br />
                    <b>Admin User</b><br />
                    Email: admin@dashify.demo<br />
                    Password: Admin123!<br />
                    <br />
                    <b>Normal User</b><br />
                    Email: user@dashify.demo<br />
                    Password: User123!<br />
                </p>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back to Dashify
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                {isSubmitting && <p className="text-orange-500 font-semibold text-sm">Waking up server, please wait…</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
