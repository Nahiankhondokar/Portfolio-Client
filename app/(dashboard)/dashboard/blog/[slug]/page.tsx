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
            <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center mb-12">
                <button
                    onClick={() => window.history.back()}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span>
                    Back to Blogs
                </button>
            </div>

            {/* Comment Management for Admin */}
            <AdminCommentSection blogId={blog.id} />
        </main>
    );
}

// Separate component for admin comment management
function AdminCommentSection({ blogId }: { blogId: number }) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiFetch<any>(`v1/public/blogs/${blogId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleDelete = async (commentId: number) => {
        try {
            await apiFetch(`comments/${commentId}`, { method: "DELETE" });
            toast.success("Comment deleted");
            fetchComments();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete comment");
        }
    };

    return (
        <section className="mt-12 bg-zinc-900/20 rounded-3xl p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-8">Manage Comments</h3>
            {loading ? (
                <p className="text-gray-500">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500 italic">No comments found for this blog.</p>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-white/5 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-bold text-white">{comment.user.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">{comment.created_at}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm">{comment.content}</p>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-8 mt-4 space-y-4 border-l border-white/5 pl-4">
                                    {comment.replies.map((reply: any) => (
                                        <div key={reply.id}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <span className="font-bold text-white text-xs">{reply.user.name}</span>
                                                    <span className="text-[10px] text-gray-500 ml-2">{reply.created_at}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(reply.id)}
                                                    className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-xs">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

import { useCallback } from "react";
import { toast } from "sonner";