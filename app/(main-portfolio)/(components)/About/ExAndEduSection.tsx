"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCapIcon, Award, MapPin, Calendar, TrendingUp, Clock } from "lucide-react";
import { Education, Experience } from "@/app/(main-portfolio)/type/type";

const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
        return dateStr;
    }
};

const yearDiff = (start: string, end?: string) => {
    try {
        const s = new Date(start);
        const e = end ? new Date(end) : new Date();
        const diff = e.getTime() - s.getTime();
        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 365)));
    } catch {
        return 1;
    }
};

const TimelineCard = ({
    data,
    icon,
    index,
    isLatest,
    accent,
}: {
    data: Experience | Education;
    icon: React.ReactNode;
    index: number;
    isLatest: boolean;
    accent: string;
}) => {
    const [expanded, setExpanded] = useState(false);
    const displayInstitution = "company" in data ? data.company : data.institute;
    const startDate = formatDate(data.start_date);
    const endDate = formatDate(data.end_date);
    const hasMedia = !!(data.media);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
            className="group relative"
        >
            {/* Timeline spine segment */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-zinc-800 via-zinc-800/50 to-transparent" />

            {/* Card wrapper with offset for timeline */}
            <div className="pl-14 pb-12 last:pb-0">
                {/* Node */}
                <div className="absolute left-[11px] top-1 z-20">
                    <div
                        className="relative w-[17px] h-[17px] rounded-full border-2 bg-zinc-950 flex items-center justify-center transition-all duration-500"
                        style={{
                            borderColor: isLatest ? "rgb(129, 140, 248)" : "rgb(63, 63, 70)",
                            boxShadow: isLatest ? "0 0 20px rgba(99, 102, 241, 0.5)" : "none",
                        }}
                    >
                        <div
                            className="w-[6px] h-[6px] rounded-full transition-all duration-500"
                            style={{
                                backgroundColor: isLatest ? "rgb(129, 140, 248)" : "rgb(82, 82, 91)",
                            }}
                        />
                        {isLatest && (
                            <div className="absolute inset-0 w-[17px] h-[17px] rounded-full border border-indigo-400/40 animate-ping" />
                        )}
                    </div>
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/20 backdrop-blur-sm hover:border-zinc-700/70 transition-all duration-500">
                    {/* Subtle grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, rgb(99 102 241 / 0.3) 1px, transparent 1px)",
                            backgroundSize: "12px 12px",
                        }}
                    />

                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04]" />

                    <div className="relative p-6">
                        {isLatest && (
                            <div
                                className="absolute top-3 right-3 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[2px]"
                                style={{
                                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                                    borderColor: "rgba(99, 102, 241, 0.3)",
                                    color: "rgb(165, 180, 252)",
                                }}
                            >
                                Current
                            </div>
                        )}

                        {/* Date + Duration row */}
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                                    border: "1px solid rgba(99, 102, 241, 0.15)",
                                    color: "rgb(165, 180, 252)",
                                }}
                            >
                                <Calendar size={12} />
                                <span>{startDate || "?"} — {endDate || "Present"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-mono text-zinc-500">
                                <Clock size={11} />
                                <span>{yearDiff(data.start_date, data.end_date)} yrs</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white group-hover:text-zinc-100 transition-colors mb-2">
                            {data.title || "Untitled"}
                        </h4>

                        {/* Institution */}
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-7 h-7 rounded-md flex items-center justify-center"
                                style={{
                                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                                    border: "1px solid rgba(99, 102, 241, 0.2)",
                                    color: "rgb(165, 180, 252)",
                                }}
                            >
                                {icon}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                                {displayInstitution || "Freelance"}
                            </span>
                            {data.position && (
                                <>
                                    <span className="text-zinc-600 text-sm">·</span>
                                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                                        {data.position}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {data.description && (
                            <div>
                                <motion.div
                                    animate={{ height: expanded ? "auto" : "68px" }}
                                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-base text-zinc-400 leading-relaxed">
                                        {data.description}
                                    </p>
                                </motion.div>
                                {data.description.length > 120 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="mt-2 text-xs font-black uppercase tracking-[3px] text-indigo-400/80 hover:text-indigo-300 transition-colors"
                                    >
                                        {expanded ? "Collapse" : "Continue reading →"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Accent bar at bottom */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const StatBlock = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="flex flex-col items-center p-5 rounded-2xl bg-zinc-950/30 border border-zinc-800/40 hover:border-indigo-500/20 transition-colors duration-500">
        <div className="text-indigo-400/70 mb-2">{icon}</div>
        <span className="text-3xl font-black text-white font-mono tabular-nums">{value}</span>
        <span className="text-xs uppercase tracking-[2px] text-zinc-500 font-bold mt-1">{label}</span>
    </div>
);

const ExAndEduSection = ({ experiences, educations }: { experiences: Experience[]; educations: Education[] }) => {
    const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

    const stats = useMemo(() => {
        const expTotal = experiences.reduce((sum, e) => sum + yearDiff(e.start_date, e.end_date), 0);
        const uniqueCompanies = new Set(experiences.map((e) => e.company).filter(Boolean)).size;
        const eduCount = educations.length;
        return { expTotal, uniqueCompanies, eduCount };
    }, [experiences, educations]);

    const activeData = activeTab === "experience" ? experiences : educations;
    const accentColor = activeTab === "experience" ? "rgb(99, 102, 241)" : "rgb(139, 92, 246)";

    return (
        <section className="max-w-6xl mx-auto py-12 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <span className="text-indigo-400/70 font-mono text-xs uppercase tracking-[5px] font-black mb-4 block">
                    My Journey
                </span>
                <h3 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                    Career <span className="text-indigo-400">&</span> Education
                </h3>
                <div className="mt-5 flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700" />
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                    />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700" />
                </div>
            </div>

            {/* Stats bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-3 gap-3 mb-14 max-w-md mx-auto"
            >
                <StatBlock
                    label="Years Exp."
                    value={`${stats.expTotal}+`}
                    icon={<TrendingUp size={16} />}
                />
                <StatBlock
                    label="Companies"
                    value={`${stats.uniqueCompanies}`}
                    icon={<Briefcase size={16} />}
                />
                <StatBlock
                    label="Degrees"
                    value={`${stats.eduCount}`}
                    icon={<Award size={16} />}
                />
            </motion.div>

            {/* Tab switcher */}
            <div className="flex justify-center mb-14">
                <div className="flex bg-zinc-950/40 border border-zinc-800/50 rounded-full p-1 backdrop-blur-sm">
                    {([
                        { key: "experience" as const, label: "Experience", icon: <Briefcase size={14} /> },
                        { key: "education" as const, label: "Education", icon: <GraduationCapIcon size={14} /> },
                    ]).map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="relative px-7 py-3 rounded-full text-sm font-black uppercase tracking-[2px] transition-colors duration-300"
                        >
                            {activeTab === tab.key && (
                                <motion.div
                                    layoutId="pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{ backgroundColor: "rgb(99, 102, 241)" }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <span
                                className={`relative z-10 flex items-center gap-2 ${
                                    activeTab === tab.key ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="max-w-3xl mx-auto relative"
                >
                    {activeData.length > 0 ? (
                        <div>
                            {activeData.map((item, idx) => (
                                <TimelineCard
                                    key={idx}
                                    data={item}
                                    icon={
                                        activeTab === "experience" ? (
                                            <Briefcase size={12} />
                                        ) : (
                                            <GraduationCapIcon size={12} />
                                        )
                                    }
                                    index={idx}
                                    isLatest={idx === 0}
                                    accent={accentColor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800/60 rounded-3xl bg-zinc-950/20">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
                                <Briefcase size={22} className="text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[3px]">
                                {activeTab === "experience"
                                    ? "No experience records yet"
                                    : "No education records yet"}
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default ExAndEduSection;