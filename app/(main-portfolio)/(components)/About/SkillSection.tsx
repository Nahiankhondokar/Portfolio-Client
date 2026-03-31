import React from "react";
import { Expertise } from "@/app/(main-portfolio)/type/type";
import EmptyStateSection from "@/app/(main-portfolio)/(components)/About/EmptyStateSection";


const SkillSection = ({ skills }: { skills: Expertise[] }) => {


    return (
        <>
            <div className="mb-24">
                <h3 className="text-center text-3xl font-bold uppercase mb-12 tracking-tight">My Skills</h3>
                {skills.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {skills.map((skill) => (
                            <div key={skill.name} className="flex flex-col items-center">
                                <div
                                    className="relative w-28 h-28 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                                    style={{
                                        background: `conic-gradient(#eab308 ${skill.progress}%, #252525 0)`,
                                    }}
                                >
                                    <div className="absolute inset-[6px] bg-[#111] rounded-full flex items-center justify-center">
                                        <span className="text-white">{skill.progress}%</span>
                                    </div>
                                </div>
                                <p className="mt-6 uppercase font-bold tracking-widest text-sm text-gray-300">
                                    {skill.name}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyStateSection message="No expertise data found" />
                )}
            </div>
        </>
    );
}

export default SkillSection;