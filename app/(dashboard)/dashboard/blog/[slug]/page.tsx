"use client"

import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";
import BlogSkeleton from "@/app/(dashboard)/dashboard/blog/components/BlogSkeleton";

type Props = {
    params: Promise<{ slug: string }>;
};

export default function BlogDetails({ params }: Props) {
    const { slug } = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBlogDetails = async () => {
            try {
                setLoading(true);
                const data = await apiFetch<Blog>(`blog-details/${slug}`);
                console.log(data);
                setBlog(data?.data);
            } catch (error) {
                console.error("Failed to fetch blog", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) getBlogDetails();
    }, [slug]);

    // 1. Show Skeleton while loading
    if (loading) return <BlogSkeleton />;

    // 2. Show 404 if no blog found after loading
    if (!blog) return notFound();

    console.log(blog);

    return (
        <main className="max-w-4xl mx-auto py-20 px-4">
            {/* Meta Info (Professional Touch) */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400 font-medium uppercase tracking-widest">
                <span>{ "Article"}</span>
                <span>•</span>
                <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recent'}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                {blog.title}
            </h1>

            {blog.media && (
                <div className="relative h-[400px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                        src={blog.media}
                        alt={blog.title}
                        fill
                        priority // Load the main blog image faster
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
            )}

            {/* Professional Prose Styling */}
            <article className="prose prose-invert lg:prose-xl max-w-none
                prose-headings:font-bold
                prose-a:text-blue-400 hover:prose-a:text-blue-300
                prose-img:rounded-xl
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-6">
                <div dangerouslySetInnerHTML={{ __html: blog.description || "" }} />
            </article>

            {/* Footer / Back button */}
            <div className="mt-20 pt-10 border-t border-white/10">
                <button
                    onClick={() => window.history.back()}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Blog
                </button>
            </div>
        </main>
    );
}