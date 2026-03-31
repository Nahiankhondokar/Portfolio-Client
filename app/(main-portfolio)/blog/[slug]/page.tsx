// components/blog/BlogContentView.tsx

"use client"

import Image from "next/image";
import {Blog} from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import {use, useEffect, useState} from "react";
import {apiFetch} from "@/lib/api";
import BlogSkeleton from "@/app/(dashboard)/dashboard/blog/components/BlogSkeleton";
import {notFound} from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>;
};

interface BlogResponse {
    data: Blog;
}

export default function BlogContentView({ params }: Props) {
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
        <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-black mb-8">{blog.title}</h1>

        </article>
    );
}