"use client"


import TimeLineItemSection from "@/app/(main-portfolio)/_components/About/TiemLineItemSection";
import { Briefcase, GraduationCapIcon } from "lucide-react";
import { Education, Experience } from "@/app/(main-portfolio)/type/type";

function EmptyState(props: { message: string }) {
    return null;
}

const ExAndEduSection = ({ experiences, educations }: { experiences: Experience[], educations: Education[] }) => {

    return (
        <>
            <div className="max-w-6xl mx-auto pb-10">
                <h3 className="text-center text-3xl font-bold uppercase mb-16">
                    Experience <span className="text-yellow-500">&</span> Education
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                    {/* Experience Column */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 uppercase text-gray-400">Experience</h4>
                        {experiences.length > 0 ? (
                            <ul className="list-none p-0">
                                {experiences.map((item: Experience, idx) => (
                                    <TimeLineItemSection key={idx} data={item} icon={<Briefcase size={18} />} />
                                ))}
                            </ul>
                        ) : (
                            <EmptyState message="No professional history" />
                        )}
                    </div>

                    {/* Education Column */}
                    <div className="mt-12 lg:mt-0">
                        <h4 className="text-xl font-bold mb-8 uppercase text-gray-400">Education</h4>
                        {educations.length > 0 ? (
                            <ul className="list-none p-0">
                                {educations.map((item, idx) => (
                                    <TimeLineItemSection key={idx} data={item} icon={<GraduationCapIcon size={18} />} />
                                ))}
                            </ul>
                        ) : (
                            <EmptyState message="No educational records" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ExAndEduSection;