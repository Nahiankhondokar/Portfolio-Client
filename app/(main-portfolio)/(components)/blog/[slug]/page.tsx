// app/(main-portfolio)/blog/[slug]/page.tsx
import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import { notFound } from "next/navigation";
import BlogDetailsContent from "../BlogDetails";
// The client component below

type Props = {
    params: Promise<{ slug: string }>;
};

interface BlogResponse {
    data: Blog;
}

export default async function BlogDetailsPage({ params }: Props) {
    const { slug } = await params;

    let blog: Blog | null = null;
    try {
        const response = await apiFetch<BlogResponse>(`v1/public/blog-details/${slug}`);
        blog = response?.data;
    } catch (error) {
        console.error("Failed to fetch blog", error);
    }

    if (!blog) return notFound();

    // Pass the fetched data to the Client Component
    return <BlogDetailsContent blog={blog} />;
}