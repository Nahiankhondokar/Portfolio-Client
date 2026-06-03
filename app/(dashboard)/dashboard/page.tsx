"use client"

import React, { useEffect, useMemo } from "react";
import AppChartArea from '@/components/common/AppChartArea'
import AppChartBar from '@/components/common/AppChartBar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { 
    Newspaper, 
    Briefcase, 
    Monitor, 
    FolderKanban, 
    ArrowUpRight, 
    Calendar,
    LayoutDashboard,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
    const { overview, fetchOverview } = useDashboardStore();
    const { profile } = useProfileStore();

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    const statsConfig = useMemo(() => [
        { 
            key: 'blogs', 
            label: 'Blogs', 
            icon: Newspaper, 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10',
            desc: 'Articles published'
        },
        { 
            key: 'portfolios', 
            label: 'Portfolio', 
            icon: Briefcase, 
            color: 'text-yellow-500', 
            bg: 'bg-yellow-500/10',
            desc: 'Showcase items'
        },
        { 
            key: 'services', 
            label: 'Services', 
            icon: Monitor, 
            color: 'text-indigo-500', 
            bg: 'bg-indigo-500/10',
            desc: 'Service offerings'
        },
        { 
            key: 'projects', 
            label: 'Projects', 
            icon: FolderKanban, 
            color: 'text-purple-500', 
            bg: 'bg-purple-500/10',
            desc: 'Active projects'
        },
    ], []);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-10 pb-10 px-2 md:px-6">
            {/* ================= Header ================= */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-yellow-500">{profile?.name?.split(' ')[0] || "User"}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                        <Calendar size={14} />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-1.5 rounded-2xl">
                    <div className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-yellow-500/20">
                        System Online
                    </div>
                    <div className="px-3 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        v2.0.4
                    </div>
                </div>
            </header>

            {/* ================= Overview Stats ================= */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Activity size={18} className="text-yellow-500" />
                    <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[4px]">Quick Stats</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsConfig.map((stat, index) => {
                        const Icon = stat.icon;
                        const value = overview?.[stat.key as keyof typeof overview] || 0;
                        
                        return (
                            <motion.div
                                key={stat.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group cursor-default overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] opacity-20 -mr-12 -mt-12 group-hover:opacity-40 transition-opacity`} />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="text-zinc-600 group-hover:text-white transition-colors">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-black text-white tabular-nums tracking-tight">
                                                {value}
                                            </p>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
                                                {stat.label}
                                            </p>
                                        </div>
                                        <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${stat.color.replace('text', 'bg')} opacity-50`} 
                                                style={{ width: `${Math.min((value / 20) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ================= Charts ================= */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-zinc-900/20 border-zinc-800 p-4">
                    <CardHeader className="px-2">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Visitor Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[300px]">
                            <AppChartBar />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/20 border-zinc-800 p-4">
                    <CardHeader className="px-2">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Engagement Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[300px]">
                            <AppChartArea />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ================= Recent Activity ================= */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <LayoutDashboard size={18} className="text-yellow-500" />
                    <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[4px]">System Overview</h2>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card className="bg-zinc-900/10 border-zinc-800 overflow-hidden">
                        <CardHeader className="bg-zinc-900/30 border-b border-zinc-800">
                            <CardTitle className="text-sm font-bold text-zinc-400">Recent Invoices</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-zinc-900/20">
                                    <TableRow className="border-zinc-800">
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Invoice</TableHead>
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Customer</TableHead>
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-transparent">
                                        <TableCell colSpan={3} className="text-center py-12 text-zinc-600 italic text-sm">
                                            No recent transactions found
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/10 border-zinc-800 overflow-hidden">
                        <CardHeader className="bg-zinc-900/30 border-b border-zinc-800">
                            <CardTitle className="text-sm font-bold text-zinc-400">Popular Content</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-zinc-900/20">
                                    <TableRow className="border-zinc-800">
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Item</TableHead>
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Category</TableHead>
                                        <TableHead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">Views</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-transparent">
                                        <TableCell colSpan={3} className="text-center py-12 text-zinc-600 italic text-sm">
                                            No analytics data available
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;