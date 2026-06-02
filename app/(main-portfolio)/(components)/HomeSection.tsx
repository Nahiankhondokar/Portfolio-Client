"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import Me from "@/public/assets/me/me.jpg";
import { Home, Section } from "../type/type";

const HomeSection = ({ onNavigate, data }: { onNavigate: (s: Section) => void, data: Home }) => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col lg:flex-row items-center min-h-[90vh] py-12 lg:py-20 overflow-hidden"
        >
            {/* Subtle Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Left: Image Side with Interactive Terminal Wrapper */}
            <div className="w-full lg:w-5/12 flex justify-center items-center relative py-6 lg:py-12">
                {/* Emerald Ambient Background Glow */}
                <div className="absolute -inset-10 bg-emerald-500/[0.04] blur-3xl rounded-full opacity-60 pointer-events-none -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[420px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden relative group"
                >
                    {/* Terminal Header */}
                    <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-3 flex items-center justify-between select-none">
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/80" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider font-bold">
                            nahian@portfolio:~ (zsh)
                        </span>
                        <div className="w-10" /> {/* Spacer to center the title */}
                    </div>

                    {/* Terminal Body */}
                    <div className="p-5 font-mono text-[11px] leading-relaxed flex flex-row items-center justify-between gap-4 h-[250px] relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black">
                        
                        {/* Terminal Scanline/Blueprint overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-20 animate-[pulse_8s_infinite]" />

                        {/* Left Side: SSH Console Logs */}
                        <div className="flex-1 flex flex-col justify-between h-full text-zinc-400 select-none">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-emerald-500">~ %</span>
                                    <span className="text-white font-bold animate-[pulse_1.5s_infinite]">whoami</span>
                                </div>
                                <div className="text-zinc-500 pl-4 mb-2">nahiankhondokar</div>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-emerald-500">~ %</span>
                                    <span className="text-white font-bold">cat status.json</span>
                                </div>
                                <div className="text-emerald-400/80 font-bold pl-4 leading-normal">
                                    {`{\n  "role": "Developer",\n  "status": "CODING",\n  "ping": "ACTIVE"\n}`}
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-auto">
                                <span className="text-emerald-500">~ %</span>
                                <span className="text-zinc-400">run feed.sh</span>
                                <span className="w-1.5 h-3 bg-emerald-500 animate-pulse inline-block align-middle ml-1" />
                            </div>
                        </div>

                        {/* Right Side: Floating dossiers portrait */}
                        <div className="relative w-[150px] h-[190px] rounded-xl overflow-hidden border border-zinc-800 group-hover:border-emerald-500/40 transition-colors duration-500 shadow-xl bg-zinc-900/40 shrink-0">
                            
                            {/* Camera Details Overlay */}
                            <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                CAM_01
                            </div>
                            
                            <Image
                                src={data?.image ?? Me}
                                alt={data.name || "Profile"}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                priority
                            />
                            
                            {/* CRT monitor green shade overlay */}
                            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right: Content Side */}
            <div className="w-full lg:w-7/12 mt-16 lg:mt-0 lg:pl-16 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 bg-zinc-950/60 border border-zinc-900 px-4 py-2.5 rounded-full mb-6 shadow-[0_0_15px_rgba(16, 185, 129,0.05)]"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#34d399]"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-emerald-400/90">
                        Active & swimming in code
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                        Hello, I'm
                    </span>
                    <h1 className="text-5xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter italic">
                        {data.name || "Carlos Yang"}
                        <span className="text-emerald-400 block not-italic mt-2">
                            {data.subtitle || "Full Stack Dev"}
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-zinc-400 max-w-lg text-lg leading-relaxed font-medium"
                >
                    {data.bio ||
                        "I specialize in building high-performance web applications using the Laravel & Next.js ecosystem. Focused on clean architecture and simple, professional user experiences."
                    }
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10"
                >
                    <button
                        onClick={() => onNavigate("about")}
                        className="group relative flex items-center gap-6 bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_20px_50px_rgba(16, 185, 129,0.2)]"
                    >
                        More About Me
                        <div className="bg-black text-white p-2 rounded-lg group-hover:translate-x-2 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                    </button>
                </motion.div>
            </div>
        </motion.section>
    );
}

export default HomeSection;