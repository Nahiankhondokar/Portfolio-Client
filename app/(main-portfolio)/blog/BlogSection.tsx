"use client";
// app/(main-portfolio)/components/Blog/BlogSection.tsx

import { motion } from "framer-motion";
import Image from "next/image";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import Link from "next/link";

type Props = {
    data: Blog[];
};

const BlogSection = ({ data }: Props) => {
    const blogs = data ?? [];

    return (
        <section className="py-20 px-4">
            <h2 className="text-center text-4xl lg:text-5xl font-black uppercase mb-16 text-white">
                My <span className="text-yellow-500">Blog</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {blogs.map((blog: Blog) => (
                    <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`} // Points to the new page
                        className="group relative overflow-hidden rounded-xl bg-[#252525] border border-white/5 block"
                    >
                        <div className="h-64 relative">
                            {blog?.media ? (
                                <Image
                                    src={blog.media}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">No Preview</div>
                            )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center p-6 text-center">
                            <h4 className="text-black font-bold text-xl uppercase tracking-tighter">
                                {blog.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default BlogSection;