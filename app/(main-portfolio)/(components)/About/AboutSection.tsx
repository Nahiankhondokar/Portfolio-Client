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
        { icon: <User size={16} />, label: "Name", value: name },
        { icon: <MapPin size={16} />, label: "Address", value: location },
        { icon: <Phone size={16} />, label: "Phone", value: phone || "Not Shared" },
        { icon: <Mail size={16} />, label: "Email", value: email },
        { icon: <Briefcase size={16} />, label: "Freelance", value: job_type },
        { icon: <Globe size={16} />, label: "Nationality", value: nationality },
    ];

    const handleDownload = async (url: string, filename: string) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            window.open(url, "_blank");
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 relative bg-black text-white"
        >
            {/* Ambient Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[12rem] font-black uppercase tracking-tighter opacity-[0.02] select-none whitespace-nowrap italic">
                    Resume
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <header className="mb-20 text-center lg:text-left">
                    <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tight">
                        About <span className="text-yellow-500">Me.</span>
                    </h2>
                    <div className="h-1.5 w-20 bg-yellow-500 mt-4 mx-auto lg:mx-0" />
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Personal Info */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {infoItems.map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex items-center gap-3 text-zinc-500 mb-1">
                                        {item.icon}
                                        <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
                                    </div>
                                    <p className="text-zinc-200 font-medium group-hover:text-yellow-500 transition-colors">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-5 pt-6">
                            <button
                                onClick={() => resume_url && handleDownload(resume_url, `${name}_CV`)}
                                className="flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-yellow-400 transition-all active:scale-95"
                            >
                                <Download size={18} />
                                Download CV
                            </button>

                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-zinc-800 transition-all active:scale-95"
                            >
                                <Eye size={18} />
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Right: Metrics Bento Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {metrics.map((stat: Metrics, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-center items-center text-center group hover:border-yellow-500/50 transition-colors"
                            >
                                <span className="text-4xl font-black text-yellow-500 mb-2 group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </span>
                                <span className="text-[10px] uppercase tracking-[3px] text-zinc-500 font-bold leading-tight">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="my-24 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                <SkillSection skills={skills} />

                <div className="my-24 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                <ExAndEduSection experiences={experiences} educations={educations} />
            </div>

            {/* Modal - Modernized with Framer Motion AnimatePresence */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl h-[90vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 bg-zinc-900 border-b border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Document_Preview.pdf</span>
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors"
                                >
                                    <X size={20} />
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