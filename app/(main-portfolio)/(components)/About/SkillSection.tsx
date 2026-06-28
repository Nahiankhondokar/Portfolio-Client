"use client";

import React from "react";
import { motion } from "framer-motion";
import { Expertise } from "@/app/(main-portfolio)/type/type";
import EmptyStateSection from "@/app/(main-portfolio)/(components)/About/EmptyStateSection";

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVars = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
};

const SkillSection = ({ skills }: { skills: Expertise[] }) => {
    return (
        <div className="mb-32 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
                <span className="text-8xl font-black uppercase tracking-tighter italic">Expertise</span>
            </div>

            <div className="text-center mb-16 relative z-10">
                <span className="text-indigo-400/80 font-mono text-[10px] uppercase tracking-[4px] font-black mb-3 block">
                    Technical Proficiency
                </span>
                <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tight">
                    My <span className="text-indigo-400">Skills</span>
                </h3>
            </div>

            {skills.length > 0 ? (
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {skills.map((skill) => {
                        const progress = parseFloat(skill.progress) || 0;
                        return (
                            <motion.div
                                key={skill.name}
                                variants={itemVars}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group relative bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors duration-500 overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                {/* Top accent line */}
                                <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent group-hover:via-indigo-500/40 transition-all duration-500" />

                                <div className="relative z-10">
                                    {/* Header row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {/* Skill icon dot */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-shadow duration-500" />
                                                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping opacity-40 group-hover:opacity-60 transition-opacity" />
                                            </div>
                                            <h4 className="font-black uppercase tracking-[2px] text-xs text-zinc-300 group-hover:text-white transition-colors duration-300">
                                                {skill.name}
                                            </h4>
                                        </div>
                                        <span className="font-mono text-lg font-black text-indigo-400 tabular-nums">
                                            {progress}
                                            <span className="text-[10px] text-zinc-600 ml-0.5">%</span>
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                        {/* Background shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 via-zinc-700/30 to-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        {/* Fill */}
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${progress}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                                        />
                                        {/* Fill glow */}
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full bg-indigo-400 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${progress}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                                        />
                                    </div>

                                    {/* Description */}
                                    {skill.description && (
                                        <p className="mt-3 text-[11px] text-zinc-500 leading-relaxed line-clamp-2 group-hover:text-zinc-400 transition-colors duration-300">
                                            {skill.description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <EmptyStateSection message="No expertise data found" />
            )}
        </div>
    );
};

export default SkillSection;