"use client";

import React, { useEffect, useState } from "react";
import {
    Home, User, Briefcase, Mail, FileText,
    LogInIcon, BookIcon
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import MobileHeader from "@/app/(main-portfolio)/(components)/MobileHeader";
import { Section } from "@/app/(main-portfolio)/type/type";

type HeaderProps = {
    activeSection: Section;
    setActiveSection: Dispatch<SetStateAction<Section>>;
};


const HeaderSection = (
    { activeSection, setActiveSection }: HeaderProps
) => {

    // --- Navigation Items ---
    const navItems = [
        { id: "home", icon: <Home size={20} />, label: "Home" },
        { id: "about", icon: <User size={20} />, label: "About" },
        { id: "portfolio", icon: <Briefcase size={20} />, label: "Portfolio" },
        { id: "contact", icon: <Mail size={20} />, label: "Contact" },
        { id: "blog", icon: <BookIcon size={20} />, label: "Blog" },
    ];


    return (
        <>
            <div className="fixed top-8 right-8 z-[60] hidden lg:block">
                <Link href="/login">
                    <button className="flex items-center gap-3 bg-[#2b2b2b] border border-yellow-500/30 px-6 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition-all font-bold uppercase text-xs tracking-widest">
                        <LogInIcon size={16} />
                        Sign In
                    </button>
                </Link>
            </div>

            {/* Fixed Desktop Navigation */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-5">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as Section)}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${activeSection === item.id ? "bg-yellow-500 text-white" : "bg-[#2b2b2b] hover:bg-yellow-500"
                            }`}
                    >
                        <span className={activeSection === item.id ? "text-white" : "group-hover:text-white"}>
                            {item.icon}
                        </span>
                        <span className="absolute right-14 px-4 py-2 bg-yellow-500 text-black font-bold opacity-0 group-hover:opacity-100 transition-all rounded-l-full uppercase text-xs tracking-widest pointer-events-none">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Fixed Mobile Navigation */}
            <MobileHeader
                navItems={navItems}
                activeSection={activeSection}       // The string value ("home", "about", etc)
                setActiveSection={setActiveSection} // The function to change it
            />
        </>
    );
}

export default HeaderSection;