"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/features/auth/auth.service";
import { useUserStore } from "@/features/user/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUp() {
    const router = useRouter();
    const { setUser } = useUserStore();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (formData: SignupFormData) => {
        try {
            const data = await authService.register(formData.name, formData.email, formData.password);
            if ("statusCode" in data) {
                toast.error(data.message);
                return;
            }
            setUser(data);
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Create account</h1>
                <p className="text-sm text-muted-foreground">
                    Start using Dashify today
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" autoComplete="name" placeholder="John Doe" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" autoComplete="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" autoComplete="new-password" placeholder="********" type="password" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
