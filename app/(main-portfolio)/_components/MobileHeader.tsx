"use client"

import React, { Dispatch, SetStateAction } from "react";
import { Section } from "@/app/(main-portfolio)/type/type";
import Link from "next/link"; // FIX: Import from next/link, not lucide

type propsType = {
    navItems: {
        id: string;
        icon: React.ReactNode; // FIX: Use React.ReactNode
        label: string;
    }[];
    activeSection: Section; // FIX: Add the current state value
    setActiveSection: Dispatch<SetStateAction<Section>>; // FIX: Keep the setter separate
}

const MobileHeader = ({ navItems, activeSection, setActiveSection }: propsType) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden justify-center pb-6 pt-3 px-4 bg-[#111]/80 backdrop-blur-lg border-t border-white/10">
            <div className="flex flex-row gap-4 sm:gap-8 items-center justify-center w-full max-w-md">
                {navItems.map((item) => {
                    const isSignin = item.id === "signin";
                    const isActive = activeSection === item.id; // Now this comparison works

                    const buttonStyles = `group relative flex flex-col items-center justify-center transition-all duration-300 ${
                        isActive ? "text-yellow-500 scale-110" : "text-gray-400 hover:text-yellow-500"
                    }`;

                    if (isSignin) {
                        return (
                            <Link key={item.id} href="/login" className={buttonStyles}>
                                <div className={`p-3 rounded-full ${isActive ? "bg-yellow-500 text-black" : "bg-[#2b2b2b]"}`}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] uppercase mt-1 font-bold tracking-tighter">{item.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as Section)}
                            className={buttonStyles}
                        >
                            <div className={`p-3 rounded-full transition-colors ${
                                isActive ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(255,180,0,0.3)]" : "bg-[#2b2b2b]"
                            }`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] uppercase mt-1 font-bold tracking-tighter ${
                                isActive ? "text-yellow-500" : "text-gray-400"
                            }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

export default MobileHeader;