"use client";

import { useState } from "react";
import { Comment } from "@/app/(dashboard)/dashboard/blog/interface/Comment";
import Image from "next/image";
import { MessageSquare, Reply, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface CommentItemProps {
    comment: Comment;
    blogId: number;
    onReplySuccess: (newReply: Comment) => void;
}

import { getGuestId } from "@/lib/guest";

export default function CommentItem({ comment, blogId, onReplySuccess }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReplies, setShowReplies] = useState(true);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await apiFetch<Comment>(`v1/public/blogs/${blogId}/comments`, {
                method: "POST",
                body: JSON.stringify({
                    content: replyContent,
                    parent_id: comment.id,
                    guest_id: getGuestId()
                }),
            });
            
            setReplyContent("");
            setIsReplying(false);
            onReplySuccess(response);
            toast.success("Reply posted!");
        } catch (error: any) {
            toast.error(error.message || "Failed to post reply");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 last:mb-0">
            <div className="flex gap-4 group">
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700 relative">
                        <Image 
                            src={comment.user.image || "/assets/img/avatar.png"} 
                            alt={comment.user.name} 
                            fill 
                            className="object-cover" 
                        />
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="absolute top-12 bottom-0 left-1/2 w-px bg-zinc-800 -translate-x-1/2" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold text-sm">{comment.user.name}</h4>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                                {comment.created_at}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2">
                        {!comment.parent_id && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors"
                            >
                                <Reply size={12} />
                                Reply
                            </button>
                        )}
                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                            >
                                {showReplies ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {isReplying && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleReply}
                                className="mt-4 ml-2"
                            >
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-none"
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(false)}
                                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Posting..." : "Post Reply"}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Nested Replies */}
                    <AnimatePresence>
                        {showReplies && comment.replies && comment.replies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-6 border-l border-zinc-800 pl-6"
                            >
                                {comment.replies.map((reply) => (
                                    <CommentItem 
                                        key={reply.id} 
                                        comment={reply} 
                                        blogId={blogId} 
                                        onReplySuccess={(newReply) => {
                                            // Handled by the parent to refresh or we could handle locally
                                            // In this simple recursive version, we might need a better state management
                                            // but for now we'll just assume the UI updates or parent refreshes.
                                            onReplySuccess(newReply);
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
