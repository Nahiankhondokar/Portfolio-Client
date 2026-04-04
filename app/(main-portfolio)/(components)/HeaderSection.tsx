"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, User, Briefcase, Mail, LogInIcon, BookIcon
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import MobileHeader from "@/app/(main-portfolio)/(components)/MobileHeader";
import { Section } from "@/app/(main-portfolio)/type/type";

type HeaderProps = {
    activeSection: Section;
    setActiveSection: Dispatch<SetStateAction<Section>>;
};

const HeaderSection = ({ activeSection, setActiveSection }: HeaderProps) => {
    const navItems = [
        { id: "home", icon: <Home size={20} />, label: "Home" },
        { id: "about", icon: <User size={20} />, label: "About" },
        { id: "portfolio", icon: <Briefcase size={20} />, label: "Portfolio" },
        { id: "blog", icon: <BookIcon size={20} />, label: "Blog" },
        { id: "contact", icon: <Mail size={20} />, label: "Contact" },
    ];

    return (
        <>
            {/* Top Right: Utility Navigation */}
            <div className="fixed top-8 right-8 z-[60] hidden lg:block">
                <Link href="/login">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-6 py-2.5 rounded-2xl text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all font-bold uppercase text-[10px] tracking-[2px]"
                    >
                        <LogInIcon size={14} />
                        Sign In
                    </motion.button>
                </Link>
            </div>

            {/* Right: Vertical Dock Navigation */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-0 hidden lg:flex flex-col items-center p-3 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-full shadow-2xl">
                <div className="flex flex-col gap-4">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as Section)}
                                className="group relative flex items-center justify-center w-12 h-12 rounded-full outline-none"
                            >
                                {/* Active Indicator Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-yellow-500 rounded-full"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}

                                {/* Icon */}
                                <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black" : "text-zinc-500 group-hover:text-yellow-500"
                                    }`}>
                                    {item.icon}
                                </span>

                                {/* Premium Tooltip */}
                                <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="relative flex items-center">
                                        <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 ease-out flex items-center">
                                            <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-[2px] py-2 px-4 rounded-xl whitespace-nowrap shadow-xl">
                                                {item.label}
                                            </span>
                                            {/* Tooltip Arrow */}
                                            <div className="w-2 h-2 bg-yellow-500 rotate-45 -ml-1 rounded-sm" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Navigation Integration */}
            <MobileHeader
                navItems={navItems}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
        </>
    );
}

export default HeaderSection;