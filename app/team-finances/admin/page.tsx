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
    Save,
    Receipt,
} from "lucide-react";
import { teamFetch } from "@/lib/team-api";
import type {
    TeamAdminListResponse,
    TeamExpense,
    TeamExpenseListResponse,
    TeamMember,
    TeamSettingsResponse,
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
    segment: string;
}

const emptyForm: MemberFormState = {
    name: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    paid: false,
    jersey_number: "",
    note: "",
    segment: "current_match",
};

interface SettingsFormState {
    team_name: string;
    match_name: string;
    match_time: string;
    location: string;
}

const emptySettings: SettingsFormState = {
    team_name: "",
    match_name: "",
    match_time: "",
    location: "",
};

interface ExpenseFormState {
    title: string;
    amount: string;
    expense_date: string;
    note: string;
}

const emptyExpense: ExpenseFormState = {
    title: "",
    amount: "",
    expense_date: new Date().toISOString().slice(0, 10),
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
    const [summary, setSummary] = useState<TeamAdminListResponse["summary"] | null>(null);
    const [segments, setSegments] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<MemberFormState>(emptyForm);
    const [settings, setSettings] = useState<SettingsFormState>(emptySettings);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [expenses, setExpenses] = useState<TeamExpense[]>([]);
    const [expenseSummary, setExpenseSummary] = useState<TeamExpenseListResponse["summary"] | null>(null);
    const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(emptyExpense);
    const [savingExpense, setSavingExpense] = useState(false);
    const [expenseBusyId, setExpenseBusyId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            const res = await teamFetch<TeamAdminListResponse>("team/members");
            setMembers(res.members);
            setSummary(res.summary);
        } catch {
            toast.error("Failed to load members.");
        } finally {
            setLoading(false);
        }
    };

    const loadExpenses = async () => {
        try {
            const res = await teamFetch<TeamExpenseListResponse>("team/expenses");
            setExpenses(res.expenses);
            setExpenseSummary(res.summary);
        } catch {
            toast.error("Failed to load expenses.");
        }
    };

    const loadSettings = async () => {
        try {
            const res = await teamFetch<TeamSettingsResponse>("team/settings");
            setSegments(res.segments);
            setSettings({
                team_name: res.team?.name ?? "",
                match_name: res.next_match?.name ?? "",
                match_time: res.next_match
                    ? new Date(res.next_match.match_time).toISOString().slice(0, 16)
                    : "",
                location: res.next_match?.location ?? "",
            });
        } catch {
            // settings are optional; ignore load failure
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem("team_auth_token")) {
            router.replace("/team-finances/login");
            return;
        }
        loadData();
        loadSettings();
        loadExpenses();
    }, [router]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const onSubmitExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseForm.title.trim() || !expenseForm.amount) return;

        setSavingExpense(true);
        try {
            await teamFetch("team/expenses", {
                method: "POST",
                body: JSON.stringify({
                    title: expenseForm.title.trim(),
                    amount: Number(expenseForm.amount),
                    expense_date: expenseForm.expense_date,
                    note: expenseForm.note.trim() || null,
                }),
            });
            toast.success("Expense added.");
            setExpenseForm(emptyExpense);
            await loadExpenses();
            await loadData();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to add expense."
            );
        } finally {
            setSavingExpense(false);
        }
    };

    const removeExpense = async (expense: TeamExpense) => {
        if (!window.confirm(`Delete expense "${expense.title}"?`)) return;
        setExpenseBusyId(expense.id);
        try {
            await teamFetch(`team/expenses/${expense.id}`, { method: "DELETE" });
            toast.success("Expense deleted.");
            await loadExpenses();
            await loadData();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete expense."
            );
        } finally {
            setExpenseBusyId(null);
        }
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
                segment: form.segment,
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

    const onSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings.team_name.trim() || !settings.match_name.trim()) {
            toast.error("Team name and match name are required.");
            return;
        }

        setSavingSettings(true);
        try {
            await teamFetch("team/settings", {
                method: "PUT",
                body: JSON.stringify({
                    team_name: settings.team_name.trim(),
                    match_name: settings.match_name.trim(),
                    match_time: settings.match_time
                        ? new Date(settings.match_time).toISOString()
                        : null,
                    location: settings.location.trim() || null,
                }),
            });
            toast.success("Settings saved.");
            await loadSettings();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to save settings."
            );
        } finally {
            setSavingSettings(false);
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
            segment: member.segment,
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
                            Manage team details, next match, and member payments.
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

                {/* Team & next match settings */}
                <Card className="bg-zinc-950/80 border-zinc-900">
                    <CardHeader>
                        <CardTitle>Team & Next Match</CardTitle>
                        <CardDescription>
                            Set the team name and the next match details shown on the public page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Team Name</Label>
                                <Input
                                    value={settings.team_name}
                                    onChange={(e) =>
                                        setSettings((s) => ({ ...s, team_name: e.target.value }))
                                    }
                                    placeholder="e.g. Green Warriors FC"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Match Name</Label>
                                <Input
                                    value={settings.match_name}
                                    onChange={(e) =>
                                        setSettings((s) => ({ ...s, match_name: e.target.value }))
                                    }
                                    placeholder="e.g. vs Blue Lions"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Match Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={settings.match_time}
                                    onChange={(e) =>
                                        setSettings((s) => ({ ...s, match_time: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Location</Label>
                                <Input
                                    value={settings.location}
                                    onChange={(e) =>
                                        setSettings((s) => ({ ...s, location: e.target.value }))
                                    }
                                    placeholder="e.g. City Stadium"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Button type="submit" disabled={savingSettings}>
                                    {savingSettings ? (
                                        <Loader2 size="16" className="animate-spin" />
                                    ) : (
                                        <Save size="16" />
                                    )}
                                    {savingSettings ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

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

                {/* Remaining fund */}
                {expenseSummary && (
                    <Card className="bg-indigo-500/10 border-indigo-500/30">
                        <CardContent className="py-5 flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                                    Remaining Fund
                                </p>
                                <p className="text-2xl font-black text-indigo-400">
                                    {formatCurrency(expenseSummary.remaining_fund)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                    Total Expenses
                                </p>
                                <p className="text-lg font-black text-rose-400">
                                    {formatCurrency(expenseSummary.total_expenses)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
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
                                <Label>Segment</Label>
                                <select
                                    value={form.segment}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, segment: e.target.value }))
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-zinc-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    {Object.entries(segments).map(([key, label]) => (
                                        <option key={key} value={key} className="bg-zinc-950">
                                            {label}
                                        </option>
                                    ))}
                                </select>
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
                                        <TableHead className="text-zinc-500">Segment</TableHead>
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
                                                    {member.added_by ? (
                                                        <span className="block text-xs text-zinc-500 font-normal">
                                                            by {member.added_by}
                                                        </span>
                                                    ) : null}
                                                    {member.note ? (
                                                        <span className="block text-xs text-zinc-600 font-normal">
                                                            {member.note}
                                                        </span>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell className="text-zinc-400">
                                                    {segments[member.segment] ?? member.segment}
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

                {/* Expenses */}
                <Card className="bg-zinc-950/80 border-zinc-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt size={18} className="text-zinc-500" />
                            Expenses
                        </CardTitle>
                        <CardDescription>
                            Record and manage team expenses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmitExpense} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <Label>Title</Label>
                                <Input
                                    value={expenseForm.title}
                                    onChange={(e) =>
                                        setExpenseForm((f) => ({ ...f, title: e.target.value }))
                                    }
                                    placeholder="e.g. Ball purchase"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={expenseForm.amount}
                                    onChange={(e) =>
                                        setExpenseForm((f) => ({ ...f, amount: e.target.value }))
                                    }
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={expenseForm.expense_date}
                                    onChange={(e) =>
                                        setExpenseForm((f) => ({ ...f, expense_date: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Note</Label>
                                <Input
                                    value={expenseForm.note}
                                    onChange={(e) =>
                                        setExpenseForm((f) => ({ ...f, note: e.target.value }))
                                    }
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Button type="submit" disabled={savingExpense}>
                                    {savingExpense ? (
                                        <Loader2 size="16" className="animate-spin" />
                                    ) : (
                                        <Plus size="16" />
                                    )}
                                    {savingExpense ? "Saving..." : "Add Expense"}
                                </Button>
                            </div>
                        </form>

                        {expenses.length === 0 ? (
                            <p className="py-8 text-center text-zinc-600 text-sm font-semibold">
                                No expenses recorded.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-900 hover:bg-transparent">
                                        <TableHead className="text-zinc-500">Title</TableHead>
                                        <TableHead className="text-zinc-500">Date</TableHead>
                                        <TableHead className="text-zinc-500">Amount</TableHead>
                                        <TableHead className="text-zinc-500 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map((expense) => (
                                        <TableRow
                                            key={expense.id}
                                            className="border-zinc-900 hover:bg-zinc-900/40"
                                        >
                                            <TableCell className="font-semibold">
                                                {expense.title}
                                                {expense.added_by ? (
                                                    <span className="block text-xs text-zinc-500 font-normal">
                                                        by {expense.added_by}
                                                    </span>
                                                ) : null}
                                                {expense.note ? (
                                                    <span className="block text-xs text-zinc-600 font-normal">
                                                        {expense.note}
                                                    </span>
                                                ) : null}
                                            </TableCell>
                                            <TableCell className="text-zinc-400">
                                                {expense.expense_date}
                                            </TableCell>
                                            <TableCell className="font-semibold tabular-nums text-rose-400">
                                                {formatCurrency(expense.amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button
                                                    onClick={() => removeExpense(expense)}
                                                    disabled={expenseBusyId === expense.id}
                                                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-colors disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
