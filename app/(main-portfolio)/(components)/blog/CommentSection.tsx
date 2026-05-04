"use client";

import { useEffect, useState, useCallback } from "react";
import { Comment } from "@/app/(dashboard)/dashboard/blog/interface/Comment";
import { apiFetch } from "@/lib/api";
import { MessageSquare } from "lucide-react";
import CommentItem from "./CommentItem";
import { getGuestId } from "@/lib/guest";
import { toast } from "sonner";

interface CommentSectionProps {
    blogId: number;
}

interface CommentsResponse {
    data: Comment[];
    meta: {
        current_page: number;
        last_page: number;
    };
}

export default function CommentSection({ blogId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiFetch<CommentsResponse>(`v1/public/blogs/${blogId}/comments`);
            setComments(response.data);
        } catch (error: any) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            await apiFetch<Comment>(`v1/public/blogs/${blogId}/comments`, {
                method: "POST",
                body: JSON.stringify({ 
                    content,
                    guest_id: getGuestId()
                }),
            });
            setContent("");
            toast.success("Comment posted!");
            fetchComments(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to post comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-20">
            <div className="flex items-center gap-3 mb-12">
                <div className="p-3 bg-yellow-500/10 rounded-2xl">
                    <MessageSquare className="text-yellow-500" size={24} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    Discussion <span className="text-zinc-500 ml-2">({comments.length})</span>
                </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-16">
                <div className="relative group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add to the conversation..."
                        className="w-full bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 pt-8 text-white focus:outline-none focus:border-yellow-500 transition-all min-h-[150px] resize-none"
                    />
                    <div className="absolute top-4 left-6 text-[10px] font-black text-zinc-600 uppercase tracking-[3px] group-focus-within:text-yellow-500 transition-colors">
                        Your Message
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-12">
                {loading ? (
                    <div className="text-center py-10 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                        Loading comments...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-3xl">
                        <p className="text-zinc-500 font-medium italic">No comments yet. Be the first to start the discussion!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem 
                            key={comment.id} 
                            comment={comment} 
                            blogId={blogId} 
                            onReplySuccess={() => fetchComments()} 
                        />
                    ))
                )}
            </div>
        </section>
    );
}
