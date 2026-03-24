"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Portfolio } from "@/app/(main-portfolio)/type/type";
import {Blog} from "@/app/(dashboard)/dashboard/blog/interface/Blog";

type Props = {
    data: Blog[]; // array of portfolio items
};

const BlogSection = ({ data }: Props) => {
    const blogs = data ?? [];

    if (blogs.length === 0) {
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
                {blogs.map((blog) => (
                    <a
                        key={blog.id}
                        href={blog.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                        aria-label={blog.title}
                    >
                        <div className="bg-[#252525] h-64 flex items-center justify-center text-6xl">
                            {blog?.media ? (
                                // media is a URL
                                <Image
                                    src={blog?.media}
                                    alt={blog.title}
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
                                {blog.title}
                            </h4>
                        </div>
                    </a>
                ))}
            </div>
        </motion.section>
    );
};

export default BlogSection;