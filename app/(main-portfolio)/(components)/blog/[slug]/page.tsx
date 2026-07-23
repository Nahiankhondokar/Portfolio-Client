// app/(main-portfolio)/blog/[slug]/page.tsx
import { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import { notFound } from "next/navigation";
import BlogDetailsContent from "../BlogDetails";

type Props = {
    params: Promise<{ slug: string }>;
};

interface BlogResponse {
    data: Blog;
}

async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const response = await apiFetch<BlogResponse>(`v1/public/blog-details/${slug}`);
        return response?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);

    if (!blog) return { title: "Blog Not Found" };

    const title = blog.meta?.meta_title || blog.title || "Blog";
    const description = blog.meta?.meta_description || blog.subtitle || blog.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: blog.image ? [blog.image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: blog.image ? [blog.image] : [],
        },
    };
}

export default async function BlogDetailsPage({ params }: Props) {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);

    if (!blog) return notFound();

    return <BlogDetailsContent blog={blog} />;
}