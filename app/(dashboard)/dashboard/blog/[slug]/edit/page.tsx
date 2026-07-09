"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import BreadcrumbComponent from "@/components/common/Breadcrumb";
import AddNewBlog from "@/app/(dashboard)/dashboard/blog/components/AddNewBlog";
import { usePermission } from "@/hooks/usePermission";
import BlogSkeleton from "@/app/(dashboard)/dashboard/blog/components/BlogSkeleton";

type Props = {
    params: Promise<{ slug: string }>;
};

interface BlogResponse {
    data: Blog;
}

const EditBlogPage = ({ params }: Props) => {
    const { slug } = use(params);
    const router = useRouter();
    const { canEdit } = usePermission();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!canEdit) {
            router.push("/dashboard/blog");
            return;
        }
    }, [canEdit, router]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
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

        if (slug) fetchBlog();
    }, [slug]);

    if (loading) return <BlogSkeleton />;

    if (!blog) return <div className="p-8 text-center text-zinc-400">Blog not found</div>;

    return (
        <div>
            <BreadcrumbComponent pathname={`/dashboard/blog/${slug}/edit`} />
            <AddNewBlog mode="edit" blog={blog} onSuccess={() => router.push("/dashboard/blog")} />
        </div>
    );
};

export default EditBlogPage;
