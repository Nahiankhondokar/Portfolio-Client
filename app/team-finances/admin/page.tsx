"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    Plus,
    LogOut,
    Loader2,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    Eye,
    Users,
} from "lucide-react";
import { teamFetch } from "@/lib/team-api";
import type {
    TeamFinanceResponse,
    TeamMember,
} from "@/type/team";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MemberFormState {
    name: string;
    amount: string;
    payment_date: string;
    paid: boolean;
    jersey_number: string;
    note: string;
}

const emptyForm: MemberFormState = {
    name: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    paid: false,
    jersey_number: "",
    note: "",
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

export default function TeamAdminPage() {
    const router = useRouter();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [summary, setSummary] = useState<TeamFinanceResponse["summary"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<MemberFormState>(emptyForm);
    const [busyId, setBusyId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            const res = await teamFetch<TeamFinanceResponse>(
                "v1/public/team-finances",
                { cache: "no-store" }
            );
            setMembers(res.members);
            setSummary(res.summary);
        } catch {
            toast.error("Failed to load members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem("team_auth_token")) {
            router.replace("/team-finances/login");
            return;
        }
        loadData();
    }, [router]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.amount || !form.payment_date) return;

        setSubmitting(true);
        try {
            const payload = {
                name: form.name.trim(),
                amount: Number(form.amount),
                payment_date: form.payment_date,
                paid: form.paid,
                jersey_number: form.jersey_number.trim() || null,
                note: form.note.trim() || null,
            };

            if (editingId) {
                await teamFetch(`team/members/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                toast.success("Member updated.");
            } else {
                await teamFetch("team/members", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                toast.success("Member added.");
            }

            resetForm();
            await loadData();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to save member."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (member: TeamMember) => {
        setEditingId(member.id);
        setForm({
            name: member.name,
            amount: String(member.amount),
            payment_date: member.payment_date,
            paid: member.paid,
            jersey_number: member.jersey_number ?? "",
            note: member.note ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const togglePaid = async (member: TeamMember) => {
        setBusyId(member.id);
        try {
            await teamFetch(`team/members/${member.id}`, {
                method: "PUT",
                body: JSON.stringify({ paid: !member.paid }),
            });
            toast.success(member.paid ? "Marked as unpaid." : "Marked as paid.");
            await loadData();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update status."
            );
        } finally {
            setBusyId(null);
        }
    };

    const removeMember = async (member: TeamMember) => {
        if (!window.confirm(`Delete ${member.name}?`)) return;
        setBusyId(member.id);
        try {
            await teamFetch(`team/members/${member.id}`, { method: "DELETE" });
            toast.success("Member deleted.");
            await loadData();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete member."
            );
        } finally {
            setBusyId(null);
        }
    };

    const logout = async () => {
        try {
            await teamFetch("team/logout", { method: "POST" });
        } catch {
            // ignore logout network errors; clear locally anyway
        }
        localStorage.removeItem("team_auth_token");
        router.replace("/team-finances/login");
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white py-12 px-4 sm:px-6 lg:px-20">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                            Team Finance Admin
                        </h1>
                        <p className="text-zinc-500 text-sm mt-2">
                            Add, edit, and manage member payments.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/team-finances">
                            <Button variant="outline" size="sm">
                                <Eye size="16" />
                                Public View
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={logout}>
                            <LogOut size="16" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Summary cards */}
                {summary && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-zinc-950/80 border-zinc-900">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-500">
                                    Total Collected
                                </CardDescription>
                                <CardTitle className="text-xl font-black text-indigo-400">
                                    {formatCurrency(summary.total_collected)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-zinc-950/80 border-zinc-900">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-500">
                                    Outstanding
                                </CardDescription>
                                <CardTitle className="text-xl font-black text-rose-400">
                                    {formatCurrency(summary.total_outstanding)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-zinc-950/80 border-zinc-900">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-500">Paid</CardDescription>
                                <CardTitle className="text-xl font-black text-emerald-400">
                                    {summary.paid_count}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-zinc-950/80 border-zinc-900">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-500">Unpaid</CardDescription>
                                <CardTitle className="text-xl font-black text-zinc-200">
                                    {summary.unpaid_count}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                )}

                {/* Add / edit form */}
                <Card className="bg-zinc-950/80 border-zinc-900">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Member" : "Add Member"}</CardTitle>
                        <CardDescription>
                            {editingId
                                ? "Update the member's details below."
                                : "Record a new team member payment."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Name</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, name: e.target.value }))
                                    }
                                    placeholder="Member name"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Jersey Number</Label>
                                <Input
                                    value={form.jersey_number}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, jersey_number: e.target.value }))
                                    }
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.amount}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, amount: e.target.value }))
                                    }
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Payment Date</Label>
                                <Input
                                    type="date"
                                    value={form.payment_date}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, payment_date: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <Label>Note</Label>
                                <Input
                                    value={form.note}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, note: e.target.value }))
                                    }
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Checkbox
                                    id="paid"
                                    checked={form.paid}
                                    onCheckedChange={(checked) =>
                                        setForm((f) => ({ ...f, paid: checked === true }))
                                    }
                                />
                                <Label htmlFor="paid" className="cursor-pointer">
                                    Mark as paid
                                </Label>
                            </div>

                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <Loader2 size="16" className="animate-spin" />
                                    ) : editingId ? (
                                        <Pencil size="16" />
                                    ) : (
                                        <Plus size="16" />
                                    )}
                                    {submitting
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Member"
                                        : "Add Member"}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="ghost" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Members table */}
                <Card className="bg-zinc-950/80 border-zinc-900">
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>
                            Toggle paid status, edit, or delete records.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-12 flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                <p className="text-zinc-500 text-sm">Loading...</p>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="py-12 text-center text-zinc-600">
                                <Users size={36} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-semibold">No members yet.</p>
                                <p className="text-xs text-zinc-600 mt-0.5">
                                    Add your first member above.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-900 hover:bg-transparent">
                                        <TableHead className="text-zinc-500">Name</TableHead>
                                        <TableHead className="text-zinc-500">Jersey</TableHead>
                                        <TableHead className="text-zinc-500">Date</TableHead>
                                        <TableHead className="text-zinc-500">Amount</TableHead>
                                        <TableHead className="text-zinc-500">Status</TableHead>
                                        <TableHead className="text-zinc-500 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => {
                                        const busy = busyId === member.id;
                                        return (
                                            <TableRow
                                                key={member.id}
                                                className="border-zinc-900 hover:bg-zinc-900/40"
                                            >
                                                <TableCell className="font-semibold">
                                                    {member.name}
                                                    {member.note ? (
                                                        <span className="block text-xs text-zinc-500 font-normal">
                                                            {member.note}
                                                        </span>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell className="text-zinc-400">
                                                    {member.jersey_number ?? "—"}
                                                </TableCell>
                                                <TableCell className="text-zinc-400">
                                                    {member.payment_date}
                                                </TableCell>
                                                <TableCell className="font-semibold tabular-nums">
                                                    {formatCurrency(member.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {member.paid ? (
                                                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                                                            Paid
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30">
                                                            Unpaid
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => togglePaid(member)}
                                                            disabled={busy}
                                                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                                                            title={member.paid ? "Mark unpaid" : "Mark paid"}
                                                        >
                                                            {member.paid ? (
                                                                <CheckCircle2 size={15} className="text-emerald-400" />
                                                            ) : (
                                                                <Circle size={15} />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => startEdit(member)}
                                                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeMember(member)}
                                                            disabled={busy}
                                                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-colors disabled:opacity-40"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
