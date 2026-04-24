"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Tag } from "lucide-react";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";

// Note: Since this uses Framer Motion hooks, it must be a 'use client' component.
// If you want to keep the data fetching on the server, keep the parent as 'async' 
// and move this UI into a client-side "Inner" component.

const BlogDetailsContent = ({ blog }: { blog: Blog }) => {
    // Reading progress bar logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <main className="relative min-h-screen bg-black text-zinc-300 pb-24">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-yellow-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* Sticky Navigation Top */}
            <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 mb-12">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link
                        href="/#blog"
                        className="group flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors font-bold uppercase text-[10px] tracking-[2px]"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Journal
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="text-zinc-500 hover:text-white transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <article className="max-w-4xl mx-auto px-6">
                {/* Header Meta */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-[3px] mb-8"
                    >
                        <div className="flex items-center gap-2 text-yellow-500">
                            <Tag size={12} />
                            <span>Engineering</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "April 2026"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span>5 Min Read</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8"
                    >
                        {blog.title}
                    </motion.h1>

                    {blog.subtitle && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-2xl italic border-l-2 border-yellow-500 pl-8 py-2"
                        >
                            {blog.subtitle}
                        </motion.p>
                    )}
                </header>

                {/* Featured Image with Perspective Effect */}
                {blog.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative h-[350px] md:h-[600px] w-full mb-20 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-zinc-800"
                    >
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            priority
                            className="object-cover"
                            unoptimized={process.env.NODE_ENV === 'development'}
                        />
                    </motion.div>
                )}

                {/* Content Area */}
                <div className="prose prose-invert lg:prose-xl max-w-none 
                    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                    prose-p:text-zinc-400 prose-p:leading-[1.8] prose-p:mb-8
                    prose-strong:text-yellow-500 prose-strong:font-bold
                    prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:underline
                    prose-code:text-yellow-200 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-3xl
                    prose-blockquote:border-l-yellow-500 prose-blockquote:bg-zinc-900/30 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl
                    prose-img:rounded-[2rem] prose-img:shadow-2xl">
                    <div dangerouslySetInnerHTML={{ __html: blog.description || "" }} />
                </div>

                {/* Author Section / Signoff */}
                <footer className="mt-32 pt-16 border-t border-zinc-900">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center font-black text-black text-2xl">
                                {blog.title.charAt(0)}
                            </div>
                            <div>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Written by</p>
                                <h4 className="text-white font-bold text-lg">Portfolio Owner</h4>
                            </div>
                        </div>

                        <Link
                            href="/#contact"
                            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all active:scale-95"
                        >
                            Discuss this Project
                        </Link>
                    </div>
                </footer>
            </article>
        </main>
    );
};

export default BlogDetailsContent;