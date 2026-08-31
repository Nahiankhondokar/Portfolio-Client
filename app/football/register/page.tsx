"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlusIcon, StepBackIcon } from "lucide-react";
import { teamRegisterSchema, TeamRegisterInput } from "@/schemas/team.schema";
import { teamFetch } from "@/lib/team-api";
import { ApiError } from "@/type/api-error";
import errorMessage from "@/lib/errorMessage";
import type { TeamAuthResponse } from "@/type/team";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeamRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<TeamRegisterInput>({
        resolver: zodResolver(teamRegisterSchema),
    });

    const onSubmit = async (data: TeamRegisterInput) => {
        try {
            setLoading(true);
            const res = await teamFetch<TeamAuthResponse>("team/register", {
                method: "POST",
                body: JSON.stringify(data),
            });

            toast.success("Account registered successfully.");
            localStorage.setItem("team_auth_token", res.token);
            router.push("/football/admin");
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 403) {
                toast.error("Registration is closed — maximum 2 accounts allowed.");
            } else {
                toast.error(errorMessage(error));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="w-full max-w-[380px] bg-zinc-950/80 border-zinc-900">
                <CardHeader className="text-center border-b-2 mb-1 border-zinc-900">
                    <CardTitle>Team Admin Register</CardTitle>
                    <CardDescription>
                        Create an account to manage team finances
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input {...form.register("name")} placeholder="Your name" />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                {...form.register("password")}
                                placeholder="At least 6 characters"
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button className="w-full" type="submit" disabled={loading}>
                            <UserPlusIcon size="16" />
                            {loading ? "Registering..." : "Register"}
                        </Button>

                        <div className="flex flex-col items-center gap-2 text-sm">
                            <Link
                                href="/football/login"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Already have an account? Login
                            </Link>
                            <Link
                                href="/football"
                                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <StepBackIcon size="14" />
                                View public summary
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
