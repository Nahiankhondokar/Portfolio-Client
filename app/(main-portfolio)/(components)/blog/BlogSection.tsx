"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, X, BookOpen, ChevronRight } from "lucide-react";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import { useState, useEffect } from "react";

type Props = {
    data: Blog[];
};

const INITIAL_COUNT = 3;

/* ─── Shared Blog Card ─────────────────────────────────────────── */
const BlogCard = ({
    blog,
    variants,
    compact = false,
}: {
    blog: Blog;
    variants?: Variants;
    compact?: boolean;
}) => (
    <motion.div variants={variants}>
        <Link
            href={`/blog/${blog.slug}`}
            className="group block relative bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden hover:border-yellow-500/50 transition-all duration-500 shadow-xl"
        >
            {/* Image Header */}
            <div className={`${compact ? "h-44" : "h-60"} relative overflow-hidden`}>
                {blog?.image ? (
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized={process.env.NODE_ENV === "development"}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-zinc-800 text-zinc-600">
                        No Preview
                    </div>
                )}

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <Calendar size={12} className="text-yellow-500" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {blog.created_at
                            ? new Date(blog.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                              })
                            : "New"}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
                <span className="text-[10px] uppercase tracking-[3px] text-zinc-500 font-bold mb-3 block">
                    Article
                </span>

                <h4
                    className={`${
                        compact ? "text-base" : "text-xl"
                    } font-bold text-white leading-snug group-hover:text-yellow-500 transition-colors line-clamp-2 min-h-[3rem]`}
                >
                    {blog.title}
                </h4>

                <div className="mt-5 pt-5 border-t border-zinc-800 flex items-center justify-between">
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
);

/* ─── Modal List Row ───────────────────────────────────────────── */
const ModalBlogRow = ({ blog, index }: { blog: Blog; index: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
    >
        <Link
            href={`/blog/${blog.slug}`}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-yellow-500/50 hover:bg-zinc-800/60 transition-all duration-300"
        >
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                {blog.image ? (
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        unoptimized={process.env.NODE_ENV === "development"}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                        <BookOpen size={20} />
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {blog.title}
                </p>
                {blog.created_at && (
                    <p className="text-zinc-500 text-[11px] mt-1 flex items-center gap-1">
                        <Calendar size={10} className="text-yellow-500" />
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                )}
            </div>

            {/* Arrow */}
            <ChevronRight
                size={18}
                className="text-zinc-600 group-hover:text-yellow-500 flex-shrink-0 transition-colors"
            />
        </Link>
    </motion.div>
);

/* ─── Main Section ─────────────────────────────────────────────── */
const BlogSection = ({ data }: Props) => {
    const blogs = data ?? [];
    const visibleBlogs = blogs.slice(0, INITIAL_COUNT);
    const remainingBlogs = blogs.slice(INITIAL_COUNT);
    const hasMore = remainingBlogs.length > 0;

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    const containerVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <>
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

                {/* Grid — first 6 */}
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
                >
                    {visibleBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} variants={itemVars} />
                    ))}
                </motion.div>

                {/* Load More Button */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex justify-center mt-14"
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-700 hover:border-yellow-500 rounded-2xl text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] overflow-hidden"
                        >
                            {/* Animated fill on hover */}
                            <span className="absolute inset-0 bg-yellow-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl" />

                            <BookOpen
                                size={18}
                                className="relative z-10 text-yellow-500 group-hover:scale-110 transition-transform"
                            />
                            <span className="relative z-10">
                                Load More
                                <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-black">
                                    +{remainingBlogs.length}
                                </span>
                            </span>
                            <ArrowUpRight
                                size={16}
                                className="relative z-10 text-zinc-500 group-hover:text-yellow-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                            />
                        </button>
                    </motion.div>
                )}
            </section>

            {/* ─── Modal ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
                        />

                        {/* Panel */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            className="fixed inset-x-4 bottom-0 top-[5vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-[201] flex flex-col bg-zinc-950 border border-zinc-800 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0">
                                <div>
                                    <h3 className="text-white font-black text-lg uppercase tracking-wider">
                                        More <span className="text-yellow-500">Posts</span>
                                    </h3>
                                    <p className="text-zinc-500 text-xs mt-0.5">
                                        {remainingBlogs.length} article{remainingBlogs.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Scrollable List */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                                {remainingBlogs.map((blog, i) => (
                                    <ModalBlogRow key={blog.id} blog={blog} index={i} />
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0">
                                <p className="text-center text-zinc-600 text-xs">
                                    Click any post to read the full article
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default BlogSection;
