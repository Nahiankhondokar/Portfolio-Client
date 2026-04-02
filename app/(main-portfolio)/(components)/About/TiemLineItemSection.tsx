"use client";

import React from "react";
import { motion } from "framer-motion";
import { Experience } from "@/app/(main-portfolio)/type/type";

const TimeLineItemSection = ({ data, icon }: { data: Experience; icon: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-12 pb-12 last:pb-0 group"
        >
            {/* The Node Dot/Icon */}
            <div className="absolute left-[-20px] top-0 z-20 transition-transform duration-500 group-hover:scale-110">
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-yellow-500 shadow-xl group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/10 transition-all">
                    {icon}
                </div>
            </div>

            {/* Date Tag */}
            <div className="inline-flex items-center">
                <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[2px] bg-zinc-900/50 border border-zinc-800 text-zinc-400 rounded-lg backdrop-blur-sm group-hover:text-yellow-500 group-hover:border-yellow-500/30 transition-colors">
                    {data.year || "Present"}
                </span>
            </div>

            {/* Content Card */}
            <div className="mt-5">
                <h5 className="text-xl font-black uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
                    {data.title || "Untitled Role"}
                </h5>

                <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-px bg-yellow-500/50" />
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                        {data.institute || "Freelance"}
                    </span>
                </div>

                {data.description && (
                    <p className="mt-4 text-zinc-400 text-sm leading-relaxed max-w-xl font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {data.description}
                    </p>
                )}
            </div>

            {/* Subtle Hover Glow Backdrop */}
            <div className="absolute -inset-y-2 -inset-x-4 bg-yellow-500/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </motion.div>
    );
};

export default TimeLineItemSection;