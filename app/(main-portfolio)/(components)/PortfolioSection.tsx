"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Folder } from "lucide-react";
import { Portfolio } from "@/app/(main-portfolio)/type/type";

type Props = {
    data: Portfolio[];
};

const PortfolioSection = ({ data }: Props) => {
    const portfolios = data ?? [];

    // Framer Motion Variants for Staggered Animation
    const containerVars = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (portfolios.length === 0) {
        return (
            <section className="py-24 text-center">
                <div className="inline-flex p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-zinc-500">
                    <Folder size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">No Projects Yet</h2>
                <p className="text-zinc-500">Check back soon for new updates.</p>
            </section>
        );
    }

    return (
        <section className="py-24 relative">
            {/* Section Header */}
            <div className="flex flex-col items-center mb-20 text-center">
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic text-zinc-800/30 absolute -top-4 select-none">
                    Works
                </h2>
                <h2 className="relative text-4xl lg:text-5xl font-black uppercase z-10">
                    My <span className="text-yellow-500">Portfolio</span>
                </h2>
                <div className="h-1.5 w-12 bg-yellow-500 mt-4 rounded-full" />
            </div>

            <motion.div
                variants={containerVars}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                {portfolios.map((portfolio) => (
                    <motion.a
                        key={portfolio.id}
                        variants={itemVars}
                        href={portfolio.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-colors duration-500 shadow-xl"
                    >
                        {/* Image Container */}
                        <div className="relative h-72 w-full overflow-hidden">
                            {portfolio.media ? (
                                <Image
                                    src={portfolio.media}
                                    alt={portfolio.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 italic">
                                    No Preview Available
                                </div>
                            )}

                            {/* Modern Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        </div>

                        {/* Content Area */}
                        <div className="p-8 relative">
                            {/* Category Tag (Optional - if you have it in your data) */}
                            <span className="text-[10px] uppercase tracking-[3px] text-yellow-500 font-bold mb-2 block">
                                Featured Project
                            </span>

                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-yellow-500 transition-colors">
                                    {portfolio.title}
                                </h4>

                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-black transition-all duration-300">
                                    <ExternalLink size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Hover Border Glow */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/20 rounded-[2rem] pointer-events-none transition-colors" />
                    </motion.a>
                ))}
            </motion.div>
        </section>
    );
};

export default PortfolioSection;