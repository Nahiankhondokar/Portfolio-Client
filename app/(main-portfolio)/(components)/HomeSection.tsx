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
            exit={{ opacity: 0 }}
            className="relative flex flex-col lg:flex-row items-center min-h-[90vh] py-12 lg:py-20 overflow-hidden"
        >
            {/* Subtle Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Left: Image Side */}
            <div className="w-full lg:w-5/12 flex justify-center lg:justify-start relative">
                {/* Decorative Glow */}
                <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-full opacity-50" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-72 h-80 lg:w-[420px] lg:h-[520px] z-10"
                >
                    <div className="absolute inset-0 border-2 border-zinc-800 rounded-[2rem] translate-x-4 translate-y-4 -z-10" />
                    <div className="w-full h-full rounded-[2rem] border border-zinc-700/50 overflow-hidden shadow-2xl bg-zinc-900 group">
                        <Image
                            src={data?.image ?? Me}
                            alt={data.name || "Profile"}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            priority
                        />
                    </div>
                </motion.div>
            </div>

            {/* Right: Content Side */}
            <div className="w-full lg:w-7/12 mt-16 lg:mt-0 lg:pl-16 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-full mb-6"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[2px] text-zinc-400">Available for hire</span>
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
                        <span className="text-yellow-500 block not-italic mt-2">
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
                        className="group relative flex items-center gap-6 bg-yellow-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-wider hover:bg-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(234,179,8,0.2)]"
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