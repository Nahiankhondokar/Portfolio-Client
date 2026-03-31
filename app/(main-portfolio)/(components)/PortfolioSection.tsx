"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Portfolio } from "@/app/(main-portfolio)/type/type";

type Props = {
    data: Portfolio[]; // array of portfolio items
};

const PortfolioSection = ({ data }: Props) => {
    const portfolios = data ?? [];

    if (portfolios.length === 0) {
        return (
            <motion.section
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-20"
            >
                <h2 className="text-center text-4xl lg:text-5xl font-black uppercase mb-16">
                    My <span className="text-yellow-500">Portfolio</span>
                </h2>
                <p className="text-center text-muted-foreground">No portfolio items to show.</p>
            </motion.section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-20"
        >
            <h2 className="text-center text-4xl lg:text-5xl font-black uppercase mb-16">
                My <span className="text-yellow-500">Portfolio</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolios.map((portfolio) => (
                    <a
                        key={portfolio.id}
                        href={portfolio.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                        aria-label={portfolio.title}
                    >
                        <div className="bg-[#252525] h-64 flex items-center justify-center text-6xl">
                            {portfolio.media ? (
                                // media is a URL
                                <Image
                                    src={portfolio.media}
                                    alt={portfolio.title}
                                    width={800}
                                    height={512}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                // placeholder
                                <div className="text-gray-400">No preview</div>
                            )}
                        </div>

                        <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                            <h4 className="text-black font-bold text-xl uppercase tracking-tighter">
                                {portfolio.title}
                            </h4>
                        </div>
                    </a>
                ))}
            </div>
        </motion.section>
    );
};

export default PortfolioSection;