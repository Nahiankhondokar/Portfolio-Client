"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Heart, Laugh, Sparkles, Frown, Angry } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface ReactionSectionProps {
    blogId: number;
    initialCount: number;
}

const reactions = [
    { type: "like", icon: ThumbsUp, label: "Like", color: "text-blue-500" },
    { type: "love", icon: Heart, label: "Love", color: "text-red-500" },
    { type: "haha", icon: Laugh, label: "Haha", color: "text-yellow-500" },
    { type: "wow", icon: Sparkles, label: "Wow", color: "text-yellow-400" },
    { type: "sad", icon: Frown, label: "Sad", color: "text-yellow-600" },
    { type: "angry", icon: Angry, label: "Angry", color: "text-orange-600" },
];

import { getGuestId } from "@/lib/guest";

export default function ReactionSection({ blogId, initialCount }: ReactionSectionProps) {
    const [count, setCount] = useState(initialCount);
    const [showPicker, setShowPicker] = useState(false);
    const [activeReaction, setActiveReaction] = useState<string | null>(null);

    const handleReact = async (type: string) => {
        try {
            const response = await apiFetch<{ status: string }>(`v1/public/blogs/${blogId}/react`, {
                method: "POST",
                body: JSON.stringify({ 
                    type,
                    guest_id: getGuestId()
                }),
            });

            if (response.status === "added") {
                setCount(prev => prev + 1);
                setActiveReaction(type);
            } else if (response.status === "removed") {
                setCount(prev => prev - 1);
                setActiveReaction(null);
            } else if (response.status === "updated") {
                setActiveReaction(type);
            }
            setShowPicker(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to react");
        }
    };

    return (
        <div className="flex items-center gap-6 my-12 py-6 border-y border-zinc-900">
            <div className="relative">
                <button
                    onMouseEnter={() => setShowPicker(true)}
                    onClick={() => handleReact("like")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        activeReaction 
                        ? "bg-zinc-800 text-indigo-400" 
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                    <ThumbsUp size={20} className={activeReaction ? "fill-indigo-400" : ""} />
                    <span className="font-bold text-sm">{activeReaction ? activeReaction.toUpperCase() : "REACT"}</span>
                </button>

                <AnimatePresence>
                    {showPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            onMouseLeave={() => setShowPicker(false)}
                            className="absolute bottom-full left-0 mb-4 flex gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl z-50"
                        >
                            {reactions.map((r) => (
                                <button
                                    key={r.type}
                                    onClick={() => handleReact(r.type)}
                                    className={`p-2 rounded-full hover:bg-zinc-800 transition-transform hover:scale-125 ${r.color}`}
                                    title={r.label}
                                >
                                    <r.icon size={24} />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="text-zinc-500 font-black text-sm uppercase tracking-widest">
                <span className="text-white mr-1">{count}</span> Reactions
            </div>
        </div>
    );
}
