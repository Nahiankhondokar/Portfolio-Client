"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCapIcon, Inbox } from "lucide-react";
import { Education, Experience } from "@/app/(main-portfolio)/type/type";
import TimeLineItemSection from "@/app/(main-portfolio)/(components)/About/TiemLineItemSection";

// Refined Empty State with a professional look
const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-10 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
        <Inbox className="text-zinc-700 mb-4" size={32} />
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">{message}</p>
    </div>
);

const ExAndEduSection = ({ experiences, educations }: { experiences: Experience[], educations: Education[] }) => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const columnVariants = (direction: number) => ({
        hidden: { opacity: 0, x: direction },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    });

    return (
        <section className="max-w-6xl mx-auto py-12 relative">
            {/* Editorial Header */}
            <div className="text-center mb-20">
                <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                    Career <span className="text-yellow-500">&</span> Education
                </h3>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-px w-8 bg-zinc-800" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[4px] font-bold">My Journey</span>
                    <div className="h-px w-8 bg-zinc-800" />
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-20"
            >
                {/* Experience Column */}
                <motion.div variants={columnVariants(-30)} className="relative">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-yellow-500 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            <Briefcase size={20} className="text-black" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-white">Experience</h4>
                    </div>

                    <div className="relative pl-2">
                        {/* The Timeline Track Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/50 via-zinc-800 to-transparent ml-[-1px]" />

                        {experiences.length > 0 ? (
                            <div className="space-y-2">
                                {experiences.map((item, idx) => (
                                    <TimeLineItemSection
                                        key={idx}
                                        data={item}
                                        icon={<Briefcase size={16} />}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No professional history" />
                        )}
                    </div>
                </motion.div>

                {/* Education Column */}
                <motion.div variants={columnVariants(30)} className="relative mt-12 lg:mt-0">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <GraduationCapIcon size={20} className="text-yellow-500" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-white">Education</h4>
                    </div>

                    <div className="relative pl-2">
                        {/* The Timeline Track Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent ml-[-1px]" />

                        {educations.length > 0 ? (
                            <div className="space-y-2">
                                {educations.map((item, idx) => (
                                    <TimeLineItemSection
                                        key={idx}
                                        data={item}
                                        icon={<GraduationCapIcon size={16} />}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No educational records" />
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default ExAndEduSection;