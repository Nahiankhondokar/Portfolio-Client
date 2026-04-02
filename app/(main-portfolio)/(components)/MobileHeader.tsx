"use client";

import React, { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/app/(main-portfolio)/type/type";
import Link from "next/link";

type propsType = {
    navItems: {
        id: string;
        icon: React.ReactNode;
        label: string;
    }[];
    activeSection: Section;
    setActiveSection: Dispatch<SetStateAction<Section>>;
}

const MobileHeader = ({ navItems, activeSection, setActiveSection }: propsType) => {
    return (
        <nav className="fixed bottom-6 left-0 right-0 z-50 flex lg:hidden justify-center px-4 pointer-events-none">
            {/* The "Dock" Container */}
            <div className="flex items-center gap-2 p-2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
                {navItems.map((item) => {
                    const isSignin = item.id === "signin";
                    const isActive = activeSection === item.id;

                    const Content = (
                        <div className="relative flex flex-col items-center justify-center px-4 py-2 transition-colors duration-300">
                            {/* Animated Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-yellow-500 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <div className={`transition-transform duration-300 ${isActive ? "scale-110 text-black" : "text-zinc-500"}`}>
                                {item.icon}
                            </div>

                            {/* Hidden label that only appears when active (Optional for ultra-clean look) */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[9px] uppercase font-black tracking-widest text-black mt-0.5 absolute -bottom-5 whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    );

                    if (isSignin) {
                        return (
                            <Link key={item.id} href="/login" className="relative group">
                                {Content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as Section)}
                            className="relative group outline-none"
                        >
                            {Content}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

export default MobileHeader;