import Link from "next/link";
import {
    Users,
    CircleCheck,
    CircleAlert,
    Wallet,
    MapPin,
    CalendarDays,
    Receipt,
    PiggyBank,
    Home,
} from "lucide-react";
import TeamAuthLink from "./team-auth-link";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { TeamFinanceResponse } from "@/type/team";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

async function getTeamFinances(): Promise<TeamFinanceResponse | null> {
    try {
        const res = await fetch(`${API_BASE}v1/public/team-finances`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as TeamFinanceResponse;
    } catch {
        return null;
    }
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

function formatMatchTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default async function TeamFinancesPage() {
    const data = await getTeamFinances();

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white py-12 px-4 sm:px-6 lg:px-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                            {data?.team?.name ?? "Team Finance Summary"}
                        </h1>
                        <p className="text-zinc-500 text-sm mt-2">
                            Track who has paid and who still owes for the team.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                        >
                            <Home size={16} className="text-indigo-400" />
                            Go to Portfolio
                        </Link>
                        <TeamAuthLink />
                    </div>
                </div>

                {!data ? (
                    <Card className="bg-zinc-950/80 border-zinc-900">
                        <CardContent className="py-16 text-center text-zinc-500">
                            <Users size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-semibold">No data available.</p>
                            <p className="text-xs text-zinc-600 mt-1">
                                Check back later or contact the team admin.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Next match */}
                        {data.next_match && (
                            <Card className="bg-zinc-950/80 border-zinc-900">
                                <CardHeader className="pb-3">
                                    <CardDescription className="flex items-center gap-1.5 text-zinc-500 uppercase tracking-widest text-xs">
                                        <CalendarDays size={14} className="text-indigo-400" />
                                        Next Match
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black">
                                        {data.next_match.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-2">
                                        <CalendarDays size={15} className="text-zinc-500" />
                                        {formatMatchTime(data.next_match.match_time)}
                                    </span>
                                    {data.next_match.location && (
                                        <span className="flex items-center gap-2">
                                            <MapPin size={15} className="text-zinc-500" />
                                            {data.next_match.location}
                                        </span>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Remaining fund banner */}
                        <Card className="bg-indigo-500/10 border-indigo-500/30">
                            <CardContent className="py-6 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400">
                                    <PiggyBank size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                                        Remaining Fund
                                    </p>
                                    <p className="text-3xl font-black text-indigo-400">
                                        {formatCurrency(data.summary.remaining_fund)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-zinc-950/80 border-zinc-900">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-1.5 text-zinc-500">
                                        <Wallet size={14} className="text-indigo-400" />
                                        Total Collected
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black text-indigo-400">
                                        {formatCurrency(data.summary.total_collected)}
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="bg-zinc-950/80 border-zinc-900">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-1.5 text-zinc-500">
                                        <CircleAlert size={14} className="text-rose-400" />
                                        Total Outstanding
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black text-rose-400">
                                        {formatCurrency(data.summary.total_outstanding)}
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="bg-zinc-950/80 border-zinc-900">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-1.5 text-zinc-500">
                                        <CircleCheck size={14} className="text-emerald-400" />
                                        Paid
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black text-emerald-400">
                                        {data.summary.paid_count}
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="bg-zinc-950/80 border-zinc-900">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-1.5 text-zinc-500">
                                        <Users size={14} className="text-zinc-400" />
                                        Unpaid
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black text-zinc-200">
                                        {data.summary.unpaid_count}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        {/* Members table */}
                        <Card className="bg-zinc-950/80 border-zinc-900">
                            <CardHeader>
                                <CardTitle>Members</CardTitle>
                                <CardDescription>
                                    {data.summary.total_members} total member
                                    {data.summary.total_members === 1 ? "" : "s"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.members.length === 0 ? (
                                    <p className="py-10 text-center text-zinc-600 text-sm font-semibold">
                                        No members added yet.
                                    </p>
                                ) : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="sm:hidden space-y-3">
                                            {data.members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-semibold">{member.name}</span>
                                                        {member.paid ? (
                                                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                                                                Paid
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30">
                                                                Unpaid
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                                                        <span>Segment: {data.segments[member.segment] ?? member.segment}</span>
                                                        <span>Jersey: {member.jersey_number ?? "—"}</span>
                                                        <span>Date: {member.payment_date}</span>
                                                        <span className="font-semibold text-white tabular-nums">
                                                            {formatCurrency(member.amount)}
                                                        </span>
                                                    </div>
                                                    {member.added_by ? (
                                                        <p className="mt-2 text-xs text-zinc-500">
                                                            added by {member.added_by}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop table */}
                                        <div className="hidden sm:block">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-zinc-900 hover:bg-transparent">
                                                        <TableHead className="text-zinc-500">Name</TableHead>
                                                        <TableHead className="text-zinc-500">Segment</TableHead>
                                                        <TableHead className="text-zinc-500">Jersey</TableHead>
                                                        <TableHead className="text-zinc-500">Date</TableHead>
                                                        <TableHead className="text-zinc-500">Amount</TableHead>
                                                        <TableHead className="text-zinc-500">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.members.map((member) => (
                                                        <TableRow
                                                            key={member.id}
                                                            className="border-zinc-900 hover:bg-zinc-900/40"
                                                        >
                                                            <TableCell className="font-semibold">
                                                                {member.name}
                                                                {member.added_by ? (
                                                                    <span className="block text-xs text-zinc-500 font-normal">
                                                                        added by {member.added_by}
                                                                    </span>
                                                                ) : null}
                                                                {member.note ? (
                                                                    <span className="block text-xs text-zinc-600 font-normal">
                                                                        {member.note}
                                                                    </span>
                                                                ) : null}
                                                            </TableCell>
                                                            <TableCell className="text-zinc-400">
                                                                {data.segments[member.segment] ?? member.segment}
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
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
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
                                    Total spent: {formatCurrency(data.summary.total_expenses)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.expenses.length === 0 ? (
                                    <p className="py-8 text-center text-zinc-600 text-sm font-semibold">
                                        No expenses recorded.
                                    </p>
                                ) : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="sm:hidden space-y-3">
                                            {data.expenses.map((expense) => (
                                                <div
                                                    key={expense.id}
                                                    className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-2"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="font-semibold truncate">{expense.title}</p>
                                                        <p className="text-xs text-zinc-500">{expense.expense_date}</p>
                                                    </div>
                                                    <span className="font-semibold tabular-nums text-rose-400 shrink-0">
                                                        {formatCurrency(expense.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop table */}
                                        <div className="hidden sm:block">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-zinc-900 hover:bg-transparent">
                                                        <TableHead className="text-zinc-500">Title</TableHead>
                                                        <TableHead className="text-zinc-500">Date</TableHead>
                                                        <TableHead className="text-zinc-500">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.expenses.map((expense) => (
                                                        <TableRow
                                                            key={expense.id}
                                                            className="border-zinc-900 hover:bg-zinc-900/40"
                                                        >
                                                            <TableCell className="font-semibold">
                                                                {expense.title}
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
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
