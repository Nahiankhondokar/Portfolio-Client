"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { TeamAdminInfo } from "@/type/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    admins: TeamAdminInfo[];
    onUpdated: () => void;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

export default function TeamAdminsCard({ admins, onUpdated }: Props) {
    const [editing, setEditing] = useState<TeamAdminInfo | null>(null);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const openEdit = (admin: TeamAdminInfo) => {
        setEditing(admin);
        setName(admin.name);
        setPassword("");
    };

    const handleSave = async () => {
        if (!editing) return;
        if (!name.trim()) {
            toast.error("Name is required.");
            return;
        }

        setSaving(true);
        try {
            await apiFetch(`dashboard/team-finance/admins/${editing.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: name.trim(),
                    password: password || null,
                }),
            });
            toast.success("Team admin updated.");
            setEditing(null);
            onUpdated();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update admin."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="space-y-3">
                {admins.length === 0 ? (
                    <p className="py-8 text-center text-zinc-600 italic text-sm">
                        No team admins registered yet.
                    </p>
                ) : (
                    admins.map((admin) => (
                        <div
                            key={admin.id}
                            className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
                        >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-semibold text-white">{admin.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500">
                                        Joined {new Date(admin.created_at).toLocaleDateString()}
                                    </span>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() => openEdit(admin)}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-400">
                                <span>Members: {admin.stats.total_members}</span>
                                <span>Paid: {admin.stats.paid_count}</span>
                                <span>Unpaid: {admin.stats.unpaid_count}</span>
                                <span>
                                    Collected:{" "}
                                    <span className="text-emerald-400 font-semibold tabular-nums">
                                        {formatCurrency(admin.stats.collected)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Team Admin</DialogTitle>
                        <DialogDescription>
                            Update the admin name or set a new password.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Admin name"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Password (leave blank to keep current)</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditing(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
