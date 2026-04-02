"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBotStore } from "@/stores/useChatBotStore";
import { echo } from "@/lib/echo";
import { ChatBotEvent, Message } from "@/type/chatbot/type";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget({ guestId }: { guestId: string }) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { fetchMessagesByGuestId, messages, addMessage } = useChatBotStore();

    // 1. Initial Load & Real-time Listener
    useEffect(() => {
        if (!guestId || !echo) return;

        fetchMessagesByGuestId(guestId);

        const channel = echo.channel(`chat.${guestId}`);
        channel.listen('ChatBotEvent', (e: ChatBotEvent) => {
            if (e?.message.sender === 'admin') {
                addMessage(e.message);
            }
        });

        return () => {
            echo?.leaveChannel(`chat.${guestId}`);
        };
    }, [guestId]);

    // 2. Auto-scroll to bottom with slight delay for better feel
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageBody = input;
        setInput(""); // Clear immediately for snappy feel

        try {
            // Optimistic Update
            const tempMsg: Message = {
                id: Date.now(),
                conversation_id: 0,
                sender: "guest",
                body: messageBody,
                created_at: new Date().toISOString()
            };
            addMessage(tempMsg);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/public/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    guest_id: guestId,
                    message: messageBody,
                })
            });

            if (!res.ok) throw new Error("Failed to send");
        } catch (error) {
            console.error("Failed to send", error);
            // Optional: You could add logic here to mark the message as "Failed" in the UI
        }
    };

    return (
        <div className="flex flex-col h-full bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header: Professional Glassmorphism */}
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-yellow-500 flex items-center justify-center text-black shadow-lg">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tight text-white">Support</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Chat</p>
                    </div>
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Message List */}
            <ScrollArea className="flex-1 px-4 py-6 bg-black">
                <div className="flex flex-col gap-2"> {/* Tighter gap for a cohesive conversation feel */}
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                            const isGuest = msg.sender === "guest";
                            const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`flex flex-col ${isGuest ? "items-end" : "items-start"} mb-2`}
                                >
                                    <div
                                        className={`relative max-w-[80%] px-4 py-2.5 shadow-sm transition-all ${isGuest
                                            ? "bg-yellow-500 text-black rounded-2xl rounded-tr-sm"
                                            : "bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-2xl rounded-tl-sm"
                                            }`}
                                    >
                                        <p className="text-[13.5px] leading-relaxed font-medium break-words">
                                            {msg.body}
                                        </p>
                                    </div>

                                    {/* Professional Meta Label: Shows only if it's the last message in a sequence or hovered */}
                                    {isLastInGroup && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[9px] font-black uppercase tracking-[1px] text-zinc-600 mt-1.5 px-1"
                                        >
                                            {isGuest ? "Sent" : "Admin"} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </motion.span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Message Form */}
            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
                <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 focus-within:border-yellow-500/50 transition-all"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write a message..."
                        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-zinc-600"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shrink-0 shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Send size={16} strokeWidth={2.5} />
                    </Button>
                </form>
            </div>
        </div>
    );
}