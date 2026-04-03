"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, X, User, MapPin, Phone, Mail, Briefcase, Globe } from "lucide-react";
import { About, Metrics } from "@/app/(main-portfolio)/type/type";
import ExAndEduSection from "@/app/(main-portfolio)/(components)/About/ExAndEduSection";
import SkillSection from "@/app/(main-portfolio)/(components)/About/SkillSection";

const AboutSection = ({ data }: { data: About }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const {
        expertise: skills = [],
        metrics = [],
        experiences = [],
        educations = [],
        name = "User",
        location = "N/A",
        phone,
        email = "N/A",
        job_type = "N/A",
        nationality = "N/A",
        resume_url = null,
    } = data || {};

    const infoItems = [
        { icon: <User size={14} />, label: "Name", value: name },
        { icon: <MapPin size={14} />, label: "Address", value: location },
        { icon: <Phone size={14} />, label: "Phone", value: phone || "Not Shared" },
        { icon: <Mail size={14} />, label: "Email", value: email },
        { icon: <Briefcase size={14} />, label: "Freelance", value: job_type },
        { icon: <Globe size={14} />, label: "Nationality", value: nationality },
    ];

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 lg:py-24 relative bg-black text-white overflow-hidden"
        >
            {/* Ambient Background Accent - Hidden on mobile to prevent horizontal overflow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none hidden md:block">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[12rem] font-black uppercase tracking-tighter opacity-[0.02] select-none whitespace-nowrap italic">
                    Resume
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <header className="mb-12 lg:mb-20 text-center lg:text-left">
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none">
                        About <span className="text-yellow-500">Me.</span>
                    </h2>
                    <div className="h-1 w-16 sm:w-20 bg-yellow-500 mt-4 mx-auto lg:mx-0" />
                </header>

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    {/* Left: Personal Info */}
                    <div className="lg:col-span-7 space-y-8 lg:space-y-12">
                        {/* Responsive Grid: 1 column on mobile, 2 on tablet/desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            {infoItems.map((item, idx) => (
                                <div key={idx} className="group border-b border-zinc-900 pb-3 sm:border-none sm:pb-0">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                        {item.icon}
                                        <span className="text-[10px] uppercase tracking-[2px] font-black">{item.label}</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-zinc-200 font-medium group-hover:text-yellow-500 transition-colors truncate">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Button Group: Full-width on mobile */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => resume_url && window.open(resume_url, "_blank")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all active:scale-95"
                            >
                                <Download size={18} strokeWidth={2.5} />
                                Download CV
                            </button>

                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                            >
                                <Eye size={18} strokeWidth={2.5} />
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Right: Metrics Bento Grid - Stacked on mobile */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                        {metrics.map((stat: Metrics, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-zinc-900/40 border border-zinc-800/50 p-6 sm:p-8 rounded-2xl flex flex-col justify-center items-center text-center group hover:border-yellow-500 transition-colors"
                            >
                                <span className="text-3xl sm:text-4xl font-black text-yellow-500 mb-1 group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </span>
                                <span className="text-[9px] uppercase tracking-[2px] text-zinc-500 font-black leading-tight max-w-[80%]">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="my-16 lg:my-24 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                <SkillSection skills={skills} />
                <div className="my-16 lg:my-24 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                <ExAndEduSection experiences={experiences} educations={educations} />
            </div>

            {/* Modal - Optimized for mobile screens */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-4"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-5xl h-[95vh] sm:h-[90vh] bg-zinc-950 rounded-t-[2.5rem] sm:rounded-3xl overflow-hidden border-t sm:border border-zinc-800 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-zinc-900">
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Preview</span>
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ml-auto"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="flex-grow bg-white">
                                <iframe src={`${resume_url}#toolbar=0`} className="w-full h-full" title="CV Preview" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default AboutSection;