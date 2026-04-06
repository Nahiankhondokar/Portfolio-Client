"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";

type Props = {
    data: Blog[];
};

const BlogSection = ({ data }: Props) => {
    const blogs = data ?? [];

    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Section Header */}
            <div className="flex flex-col items-center mb-20 text-center">
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic text-zinc-800/30 absolute -top-4 select-none">
                    Journal
                </h2>
                <h2 className="relative text-4xl lg:text-5xl font-black uppercase z-10 text-white">
                    Latest <span className="text-yellow-500">Posts</span>
                </h2>
                <div className="h-1.5 w-12 bg-yellow-500 mt-4 rounded-full" />
            </div>

            <motion.div
                variants={containerVars}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
            >
                {blogs.map((blog: Blog) => (
                    <motion.div key={blog.id} variants={itemVars}>
                        <Link
                            href={`/blog/${blog.slug}`}
                            className="group block relative bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden hover:border-yellow-500/50 transition-all duration-500 shadow-xl"
                        >
                            {/* Image Header */}
                            <div className="h-60 relative overflow-hidden">
                                {blog?.image ? (
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized={process.env.NODE_ENV === 'development'}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-zinc-800 text-zinc-600">No Preview</div>
                                )}

                                {/* Date Badge Overlay */}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                    <Calendar size={12} className="text-yellow-500" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                        {/* Fallback to today if date is missing */}
                                        {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "New"}
                                    </span>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8">
                                <span className="text-[10px] uppercase tracking-[3px] text-zinc-500 font-bold mb-3 block">
                                    Article
                                </span>

                                <h4 className="text-xl font-bold text-white leading-snug group-hover:text-yellow-500 transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {blog.title}
                                </h4>

                                <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                        Read More
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Bottom Bar */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-500 group-hover:w-full transition-all duration-500" />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default BlogSection;