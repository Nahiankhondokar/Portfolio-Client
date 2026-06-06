"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Trash, User, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBotStore } from "@/stores/useChatBotStore";
import { echo } from "@/lib/echo";
import { ChatBotEvent } from "@/type/chatbot/type";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
    const [reply, setReply] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        fetchConversations,
        conversations,
        selectedConversation,
        selectConversation,
        messages,
        sendReply,
        deleteConversation,
        unreadCounts,
        incrementUnreadCount,
    } = useChatBotStore();

    const selectedConversationIdRef = useRef<number | null>(null);
    
    useEffect(() => {
        selectedConversationIdRef.current = selectedConversation?.id || null;
    }, [selectedConversation?.id]);

    useEffect(() => {
        fetchConversations();

        echo
            ?.private("admin.inbox")
            .listen("ChatBotEvent", (e: ChatBotEvent) => {
                const incomingMsg = e.message;
                fetchConversations();

                const currentSelectedId = selectedConversationIdRef.current;

                if (incomingMsg.sender === "guest" && currentSelectedId !== incomingMsg.conversation_id) {
                    incrementUnreadCount(incomingMsg.conversation_id);
                }

                useChatBotStore.setState((state) => {
                    if (state.selectedConversation?.id === incomingMsg.conversation_id) {
                        const exists = state.messages.some((m) => m.id === incomingMsg.id);
                        if (!exists) {
                            return { messages: [...state.messages, incomingMsg] };
                        }
                    }
                    return state;
                });
            });

        return () => echo?.leaveChannel("admin.inbox");
    }, [fetchConversations, incrementUnreadCount]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedConversation) return;

        await sendReply(selectedConversation.id, reply);
        setReply("");
    };

    const getGuestInitials = (name?: string) => {
        if (!name) return "G";
        const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        return initials.toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] min-h-[600px] border border-zinc-800 rounded-[2rem] overflow-hidden bg-black/40 backdrop-blur-xl shadow-2xl">
            {/* --- LEFT SIDE: Conversation List --- */}
            <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/30">
                <div className="p-5 border-b border-zinc-800/80 space-y-4">
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">
                            Guest Inbox
                        </h2>
                        <div className="w-8 h-1 bg-indigo-500 rounded-full mt-1" />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <Input
                            placeholder="Search guest ID..."
                            className="pl-9 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 rounded-2xl h-10 text-xs placeholder:text-zinc-600 text-zinc-200"
                        />
                    </div>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-zinc-900/40 p-2 space-y-1">
                        {conversations.map((conversation) => {
                            const isSelected = selectedConversation?.id === conversation.id;
                            const unreadCount = unreadCounts[conversation.id] || 0;

                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => selectConversation(conversation)}
                                    className={`relative p-3.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-3 group border ${
                                        isSelected
                                            ? "bg-zinc-900/80 border-zinc-800/80 shadow-md shadow-black/30"
                                            : "bg-transparent border-transparent hover:bg-zinc-900/30"
                                    }`}
                                >
                                    {/* Left active line accent */}
                                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300 ${
                                        isSelected ? "bg-indigo-500 scale-y-100" : "bg-transparent scale-y-0"
                                    }`} />

                                    {/* Avatar with customized gradients */}
                                    <Avatar className="h-10 w-10 border border-zinc-800 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/30 text-indigo-400 text-xs font-black">
                                            {getGuestInitials(conversation.guest_name || undefined)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Conversation Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <span className={`text-xs truncate transition-colors ${
                                                isSelected ? "text-indigo-400 font-extrabold" : "text-zinc-200 font-bold"
                                            }`}>
                                                {conversation.guest_name || "Anonymous Guest"}
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex-shrink-0">
                                                {conversation.updated_at} ago
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-[10px] text-zinc-500 font-mono truncate">
                                                ID: {conversation.guest_id.slice(0, 12)}...
                                            </span>
                                            
                                            {/* Red alert unread badge counts */}
                                            {unreadCount > 0 && (
                                                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-black tracking-tight shadow-lg shadow-rose-600/30 animate-pulse">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Box: Hidden by default, visible on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0">
                                        <ConfirmationAlert
                                            title="Delete Conversation?"
                                            description="All guest message logs for this session will be permanently deleted."
                                            confirmText="Delete"
                                            onConfirm={async () => {
                                                try {
                                                    await deleteConversation(conversation.id);
                                                    if (selectedConversation?.id === conversation.id) {
                                                        selectConversation(null);
                                                    }
                                                    toast.success("Conversation deleted");
                                                } catch (error) {
                                                    toast.error("Delete failed");
                                                }
                                            }}
                                            trigger={
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-7 h-7 rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                                >
                                                    <Trash size={13} />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* --- RIGHT SIDE: Message Thread --- */}
            <div className="flex-1 flex flex-col bg-zinc-950/10">
                {selectedConversation ? (
                    <>
                        {/* Conversation Header */}
                        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/20 backdrop-blur-md">
                            <div className="flex items-center gap-3.5">
                                <Avatar className="h-10 w-10 border border-zinc-800">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/30 text-indigo-400 text-xs font-black">
                                        {getGuestInitials(selectedConversation?.guest_name || undefined)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wide">
                                            {selectedConversation.guest_name || "Anonymous Guest"}
                                        </h3>
                                        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-500 tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                        Guest ID: {selectedConversation.guest_id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <ScrollArea className="flex-1 px-6 py-6 bg-black/10">
                            <div className="flex flex-col gap-4">
                                <AnimatePresence initial={false}>
                                    {messages.map((m) => {
                                        const isAdmin = m.sender === "admin";
                                        return (
                                            <motion.div
                                                key={m.id}
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-lg leading-relaxed flex flex-col ${
                                                        isAdmin
                                                            ? "bg-indigo-500 text-white rounded-br-none shadow-indigo-500/5"
                                                            : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none shadow-black/40"
                                                    }`}
                                                >
                                                    <p className="text-sm font-medium break-words leading-relaxed">
                                                        {m.body}
                                                    </p>
                                                    <span
                                                        className={`text-[9px] mt-1.5 font-bold uppercase tracking-wider ${
                                                            isAdmin ? "text-indigo-200/80" : "text-zinc-500"
                                                        }`}
                                                    >
                                                        {(() => {
                                                            const d = new Date(m.created_at);
                                                            if (isNaN(d.getTime())) {
                                                                return m.created_at;
                                                            }
                                                            return d.toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            });
                                                        })()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Footer Form */}
                        <div className="p-4 bg-zinc-950/40 border-t border-zinc-800/80">
                            <form
                                onSubmit={handleSendReply}
                                className="flex gap-3 bg-zinc-900 border border-zinc-800/85 rounded-2xl p-1.5 focus-within:border-indigo-500/50 transition-all shadow-inner"
                            >
                                <Input
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-xl h-10 w-10 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
                                    disabled={!reply.trim()}
                                >
                                    <Send size={15} strokeWidth={2.5} />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500/80 px-10 text-center gap-5">
                        <div className="p-6 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl shadow-inner shadow-black/20 text-indigo-400">
                            <MessageSquare size={44} className="opacity-80" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-black tracking-wider text-white uppercase">
                                Inbox Workspace
                            </h3>
                            <p className="max-w-xs text-xs text-zinc-500 leading-relaxed font-semibold">
                                Select a visitor thread from the sidebar to initialize real-time workspace and chat with guests.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}