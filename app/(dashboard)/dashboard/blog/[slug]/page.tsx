"use client"

import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";
import BlogSkeleton from "@/app/(dashboard)/dashboard/blog/components/BlogSkeleton";
import MediaPreview from "@/components/common/MediaPreview";

type Props = {
    params: Promise<{ slug: string }>;
};

// Interface matching your specific API response
interface BlogResponse {
    data: Blog;
}

export default function BlogDetails({ params }: Props) {
    const { slug } = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBlogDetails = async () => {
            try {
                setLoading(true);
                // Type the response to match your JSON structure
                const response = await apiFetch<BlogResponse>(`blog-details/${slug}`);

                if (response?.data) {
                    setBlog(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch blog", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) getBlogDetails();
    }, [slug]);

    if (loading) return <BlogSkeleton />;
    if (!blog) return notFound();

    return (
        <main className="max-w-4xl mx-auto py-20 px-4">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400 font-medium uppercase tracking-widest">
                <span className="text-blue-500">Article</span>
                <span>•</span>
                {/* Since your API returns "1 week ago", we display it directly.
                   If it were a timestamp, we would use new Date()
                */}
                <span>{blog.created_at}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight text-white">
                {blog.title}
            </h1>

            {/* Subtitle/Excerpt display */}
            {blog.subtitle && (
                <p className="text-xl text-gray-400 mb-8 italic">
                    {blog.subtitle}
                </p>
            )}

            {/* Changed from blog.media to blog.image to match your API */}
            <div className="relative h-[250px] md:h-[450px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <MediaPreview
                    src={blog?.image}
                    alt={blog.title}
                    className="relative h-[250px] md:h-[450px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                />
            </div>

            {/* Content Area */}
            <article className="prose prose-invert lg:prose-xl max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-blue-400 hover:prose-a:text-blue-300
                prose-strong:text-white
                prose-img:rounded-2xl
                prose-code:text-blue-300 prose-code:bg-blue-950/30 prose-code:px-1 prose-code:rounded
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-white/5 prose-blockquote:py-2">
                <div
                    dangerouslySetInnerHTML={{ __html: blog.description || "" }}
                    className="blog-content"
                />
            </article>

            {/* Professional Footer */}
            <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                <button
                    onClick={() => window.history.back()}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span>
                    Back to Blogs
                </button>

                <div className="flex gap-4">
                    {/* Placeholder for social sharing or related links */}
                </div>
            </div>
        </main>
    );
}