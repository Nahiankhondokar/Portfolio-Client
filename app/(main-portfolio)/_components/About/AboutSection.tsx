"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Download, Eye, GraduationCapIcon, Info } from "lucide-react";
import { About, Metrics } from "@/app/(main-portfolio)/type/type";
import ExAndEduSection from "@/app/(main-portfolio)/_components/About/ExAndEduSection";
import EmptyStateSection from "@/app/(main-portfolio)/_components/About/EmptyStateSection";
import SkillSection from "@/app/(main-portfolio)/_components/About/SkillSection";

const AboutSection = ({ data }: { data: About }) => {

    // Resume review
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Destructure with fallbacks to avoid crashes
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

    console.log(resume_url)

    const handleDownload = async (url: string, filename: string) => {
        if (!url) return;

        try {
            // 1. Fetch the data into the browser's memory (RAM)
            // This is the "hidden" download part
            const response = await fetch(url);
            const blob = await response.blob();

            // 2. Create a "Virtual Link" to that data in memory
            const blobUrl = window.URL.createObjectURL(blob);

            // 3. Create a hidden <a> element in the background
            const link = document.createElement('a');
            link.href = blobUrl;

            // 4. THE KEY: The 'download' attribute forces the save dialog
            // instead of opening a new tab
            link.download = filename;

            // 5. Programmatically click the hidden link
            document.body.appendChild(link);
            link.click();

            // 6. Cleanup: Remove the link and free up memory
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error("Download failed", error);
            // Fallback: If fetch is blocked by CORS, we have to use the new tab
            window.open(url, "_blank");
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 relative overflow-hidden"
        >
            {/* Background Text Accent */}
            <div className="absolute top-10 left-0 w-full text-center pointer-events-none select-none">
                <span className="text-7xl lg:text-9xl font-black uppercase opacity-[0.03] text-white">
                    Resume
                </span>
            </div>

            <h2 className="text-center text-4xl lg:text-5xl font-black uppercase mb-20 relative z-10">
                About <span className="text-yellow-500">Me</span>
            </h2>

            {/* Personal Info & Stats */}
            <div className="grid lg:grid-cols-2 gap-16 mb-24">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Personal Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-300">
                        <p><span className="opacity-60 font-medium">Name:</span> {name}</p>
                        <p><span className="opacity-60 font-medium">Address:</span> {location}</p>
                        <p><span className="opacity-60 font-medium">Phone:</span> {phone || "Not Shared"}</p>
                        <p><span className="opacity-60 font-medium">Email:</span> {email}</p>
                        <p><span className="opacity-60 font-medium">Freelance:</span> {job_type}</p>
                        <p><span className="opacity-60 font-medium">Nationality:</span> {nationality}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Download Button */}
                        <button
                            onClick={() => resume_url && handleDownload(resume_url, `${name}_CV`)}
                            className="group mt-6 flex items-center gap-4 border-2 border-yellow-500 rounded-full px-8 py-3 font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-all"
                        >
                            Download CV
                            <span className="bg-yellow-500 group-hover:bg-black p-2 rounded-full transition-colors">
                                <Download size={16} className="text-white" />
                            </span>
                        </button>

                        {/* Improved Preview Button */}
                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="group mt-6 flex items-center gap-4 border-2 border-white/20 rounded-full px-8 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                        >
                            Preview CV
                            <span className="bg-white/10 group-hover:bg-black p-2 rounded-full transition-colors">
                                <Eye size={16} className="text-white" />
                            </span>
                        </button>
                    </div>

                    {/* --- PREVIEW MODAL --- */}
                    {isPreviewOpen && (
                        <div className="fixed h-auto inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10">
                            <div className="relative w-full max-w-5xl h-full bg-[#111] rounded-xl overflow-hidden flex flex-col border border-white/10">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#181818]">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Curriculum Vitae</h3>
                                    <button
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="text-white/60 hover:text-yellow-500 transition-colors p-2"
                                    >
                                        <span className="text-xs mr-2 font-bold uppercase">Close</span>
                                        ✕
                                    </button>
                                </div>

                                {/* PDF Viewer */}
                                <div className="flex-grow bg-white">
                                    <iframe
                                        src={`${resume_url}#toolbar=0`}
                                        className="w-full h-full"
                                        title="CV Preview"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {metrics.length > 0 ? (
                        metrics.map((stat: Metrics, i) => (
                            <div key={i} className="border border-[#252525] p-6 rounded-xl hover:border-yellow-500/30 transition-colors">
                                <h4 className="text-4xl font-bold text-yellow-500">{stat.value}</h4>
                                <p className="uppercase text-xs tracking-[2px] mt-2 text-gray-300">{stat.label}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2"><EmptyStateSection message="No metrics available" /></div>
                    )}
                </div>
            </div>

            <hr className="border-[#252525] mb-20 max-w-2xl mx-auto" />

            {/* Skills Section */}
            <SkillSection skills={skills} />

            <hr className="border-[#252525] mb-20 max-w-2xl mx-auto" />

            {/* Experience & Education Section */}
            <ExAndEduSection experiences={experiences} educations={educations} />
        </motion.section>
    );
};

export default AboutSection;