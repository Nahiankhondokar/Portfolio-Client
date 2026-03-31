"use client"

import React from "react";
import {Experience} from "@/app/(main-portfolio)/type/type";

const TimeLineItemSection = ({ data, icon }: { data: Experience; icon: React.ReactNode }) => {

    return (
        <>
            <li className="relative pl-16 mb-12 last:mb-0 before:content-[''] before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-[1px] before:bg-[#333]">
                <div className="absolute left-0 top-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white z-10 shadow-[0_0_20px_rgba(255,180,0,0.2)]">
                    {icon}
                </div>
                <span className="inline-block px-3 py-1 mb-3 text-[12px] font-semibold uppercase tracking-wide bg-[#252525] text-gray-300 rounded-full">
                  {data.year || "Year N/A"}
                </span>
                <h5 className="text-lg font-bold uppercase text-white mt-2">
                    {data.title || "Untitled Role"}
                    <span className="block text-sm font-medium text-gray-400 mt-1 opacity-80 before:content-['—'] before:mr-2">
                        {data.institute || "N/A"}
                      </span>
                </h5>
                {data.description && (
                    <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                        {data.description}
                    </p>
                )}
            </li>
        </>
    );
}

export default TimeLineItemSection;