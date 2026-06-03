"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Me from "@/public/assets/me/me.jpg";
import { Home, Section } from "../type/type";

const highlightBioText = (text: string) => {
    if (!text) return null;
    
    const highlights = [
        { pattern: /Laravel\s*&\s*Next\.js/gi, style: "text-emerald-400 font-bold" },
        { pattern: /Laravel/gi, style: "text-emerald-400 font-bold" },
        { pattern: /Next\.js/gi, style: "text-emerald-400 font-bold" },
        { pattern: /premium user interfaces/gi, style: "text-white font-bold" },
        { pattern: /database architectures/gi, style: "text-white font-bold" },
        { pattern: /live integrations/gi, style: "text-white font-bold" },
        { pattern: /scalable web ecosystems/gi, style: "text-emerald-400/90 font-bold" }
    ];
    
    const regex = /(Laravel\s*&\s*Next\.js|Laravel|Next\.js|premium user interfaces|database architectures|live integrations|scalable web ecosystems)/gi;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
        const match = highlights.find(h => {
            h.pattern.lastIndex = 0;
            return h.pattern.test(part);
        });
        if (match) {
            return (
                <span key={index} className={match.style}>
                    {part}
                </span>
            );
        }
        return part;
    });
};

const HomeSection = ({ onNavigate, data }: { onNavigate: (s: Section) => void, data: Home }) => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col lg:flex-row items-center justify-between min-h-[85vh] py-12 lg:py-20 gap-12"
        >
            {/* Grid Blueprint Styling Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Left Side: Holographic Radar HUD Avatar Scanner */}
            <div className="w-full lg:w-5/12 flex justify-center items-center relative py-8 select-none">
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 aspect-square shrink-0 flex items-center justify-center">
                    
                    {/* Glowing Backlight */}
                    <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full opacity-60 scale-125 pointer-events-none -z-20 animate-pulse" />

                    {/* Futuristic Multi-Layer Dials - Elegant slow border rotating styles */}
                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-[1.04] pointer-events-none -z-10" />
                    <div className="absolute inset-0 border border-dashed border-zinc-800 rounded-full scale-[1.08] pointer-events-none -z-10 animate-[spin_80s_linear_infinite]" />
                    <div className="absolute inset-0 border-2 border-dotted border-emerald-500/10 rounded-full scale-[1.14] pointer-events-none -z-10 animate-[spin_45s_linear_infinite_reverse]" />

                    {/* Corner Coordinates */}
                    <div className="absolute -top-4 -left-4 font-mono text-[7px] text-zinc-600 select-none hidden lg:block tracking-widest bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-900">
                        [SCAN_RAD_SYS_10A]
                    </div>
                    <div className="absolute -bottom-4 -right-4 font-mono text-[7px] text-zinc-600 select-none hidden lg:block tracking-widest bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-900">
                        [LOCK_NODE_D9]
                    </div>

                    {/* Perfect Circle Avatar */}
                    <div className="w-full h-full rounded-full border-2 border-zinc-800/80 overflow-hidden shadow-2xl bg-zinc-950 relative aspect-square shrink-0">
                        <Image
                            src={data?.image ?? Me}
                            alt={data.name || "Profile"}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-110 rounded-full"
                            priority
                        />
                        
                        {/* CRT Screen Blending Mask */}
                        <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Right Side: High-End Elegant Content Panel */}
            <div className="w-full lg:w-7/12 mt-12 lg:mt-0 lg:pl-16 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
                
                {/* Available Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-4 py-2 rounded-full mb-6 shadow-sm select-none"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-emerald-400">
                        Available for contracts & opportunities
                    </span>
                </motion.div>

                {/* Name Heading with Heavy Modern Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-3 block">
                        Full-Stack Engineer & Architect
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight italic text-white leading-[0.9]">
                        {data.name || "Nahian Khondokar"}
                        <span className="text-emerald-400 block not-italic mt-3 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            {data.subtitle || "Full-Stack Developer"}
                        </span>
                    </h1>
                </motion.div>

                {/* Highly Legible, Beautiful Bio Paragraph */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-zinc-300 text-base sm:text-lg leading-relaxed font-medium max-w-xl"
                >
                    {highlightBioText(data.bio || "I specialize in engineering scalable web ecosystems using the Laravel & Next.js pipeline. My focus is on crafting clean database architectures, seamless live integrations, and premium user interfaces that drive conversions and performance.")}
                </motion.p>

                {/* Key Stack Mini Capsules (Highly professional visual aid) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap gap-2.5 mt-6 justify-center lg:justify-start max-w-xl select-none"
                >
                    {["Laravel", "Next.js", "TypeScript", "MySQL", "TailwindCSS", "Realtime Web"].map((stack) => (
                        <span
                            key={stack}
                            className="bg-zinc-900/40 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono text-[10px] text-zinc-500 tracking-wider hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300"
                        >
                            {stack}
                        </span>
                    ))}
                </motion.div>

                {/* CTA Action Deck */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start select-none"
                >
                    <button
                        onClick={() => onNavigate("portfolio")}
                        className="group relative flex items-center justify-center gap-4 bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-white transition-all active:scale-95 shadow-[0_15px_40px_rgba(16,185,129,0.15)] text-xs sm:text-sm animate-[pulse_3s_infinite]"
                    >
                        Explore Projects
                        <div className="bg-black text-white p-1.5 rounded-lg group-hover:translate-x-1.5 transition-transform">
                            <ArrowRight size={14} />
                        </div>
                    </button>
                    
                    <button
                        onClick={() => onNavigate("contact")}
                        className="group relative flex items-center justify-center gap-3 bg-zinc-950/60 border border-zinc-800 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-zinc-900 hover:border-zinc-700 transition-all active:scale-95 text-xs sm:text-sm"
                    >
                        Get In Touch
                    </button>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HomeSection;