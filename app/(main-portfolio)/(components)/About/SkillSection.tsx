"use client";

import React from "react";
import { motion } from "framer-motion";
import { Expertise } from "@/app/(main-portfolio)/type/type";
import EmptyStateSection from "@/app/(main-portfolio)/(components)/About/EmptyStateSection";

const SkillSection = ({ skills }: { skills: Expertise[] }) => {
    // Animation variants for the container
    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Animation variants for the text
    const itemVars = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="mb-32 relative">
            {/* Background Label */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
                <span className="text-8xl font-black uppercase tracking-tighter italic">Expertise</span>
            </div>

            <h3 className="text-center text-3xl lg:text-4xl font-black uppercase mb-20 relative z-10 tracking-tight">
                My <span className="text-yellow-500">Skills</span>
            </h3>

            {skills.length > 0 ? (
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8"
                >
                    {skills.map((skill) => (
                        <motion.div key={skill.name} variants={itemVars} className="flex flex-col items-center group">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                {/* SVG Circular Progress */}
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Background Circle */}
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="transparent"
                                        className="text-zinc-900"
                                    />
                                    {/* Animated Progress Circle */}
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={364.4} // 2 * PI * r
                                        initial={{ strokeDashoffset: 364.4 }}
                                        whileInView={{
                                            strokeDashoffset: 364.4 - (364.4 * skill.progress) / 100
                                        }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                        viewport={{ once: true }}
                                        strokeLinecap="round"
                                        className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                                    />
                                </svg>

                                {/* Percentage Text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white group-hover:scale-110 transition-transform duration-300">
                                        {skill.progress}%
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="uppercase font-black tracking-[3px] text-[11px] text-zinc-500 group-hover:text-yellow-500 transition-colors duration-300">
                                    {skill.name}
                                </p>
                                {/* Small decorative bar */}
                                <div className="h-0.5 w-4 bg-zinc-800 mx-auto mt-2 group-hover:w-8 group-hover:bg-yellow-500 transition-all duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <EmptyStateSection message="No expertise data found" />
            )}
        </div>
    );
};

export default SkillSection;