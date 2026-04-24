"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {User} from "@/type/user";
import {LogInIcon, StepBackIcon} from "lucide-react";
import Link from "next/link";
import GoogleLoginBtn from "@/app/(auth)/login/components/GoogleLoginBtn";
import errorMessage from "@/lib/errorMessage";


export interface LoginResponse {
    token: string;
    user: User;
}

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setLoading(true);

            const res = await apiFetch<LoginResponse>("login", {
                method: "POST",
                body: JSON.stringify(data),
            });

            // store in cookie (for middleware)
            // 7 days
            document.cookie = `auth_token=${res.token}; path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
            localStorage.setItem("auth_token", res.token);


            router.push("/dashboard");
        } catch (error: unknown) {
            form.setError("root", {
                message: errorMessage(error),
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[380px]">
                <CardHeader className="text-center border-b-2 mb-1">
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Login to access your dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Email */}
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Root Error */}
                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                        >
                            <LogInIcon size="16" />
                            {loading ? "Logging in..." : "Login"}
                        </Button>

                        {/* Divider */}
                        <div className="relative flex items-center my-1">
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                            <span className="mx-3 text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                                or
                            </span>
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                        </div>

                        <GoogleLoginBtn />

                        <Link href="/" className="flex justify-center items-center gap-2 text-yellow-500">
                            <StepBackIcon size="16" />
                            Home Page
                        </Link>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
