"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Trash, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBotStore } from "@/stores/useChatBotStore";
import { echo } from "@/lib/echo";
import { ChatBotEvent } from "@/type/chatbot/type";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    } = useChatBotStore();

    useEffect(() => {
        fetchConversations();

        echo
            ?.private("admin.inbox")
            .listen("ChatBotEvent", (e: ChatBotEvent) => {
                const incomingMsg = e.message;
                fetchConversations();

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
    }, [fetchConversations]);

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
        <div className="flex h-[calc(100vh-76px)] min-h-[600px] border rounded-2xl overflow-hidden bg-card shadow-sm">
            {/* --- LEFT SIDE: Conversation List --- */}
            <div className="w-80 border-r flex flex-col bg-muted/10">
                <div className="p-5 border-b space-y-3">
                    <h2 className="text-xl font-semibold text-foreground tracking-tight">
                        Guest Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                        <Input
                            placeholder="Search guests by name or ID..."
                            className="pl-9 bg-background/50 h-10 rounded-full"
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-muted/30">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => selectConversation(conversation)}
                                className={`p-3.5 cursor-pointer hover:bg-muted/30 transition-colors ${
                                    selectedConversation?.id === conversation.id
                                        ? "bg-muted/80"
                                        : ""
                                }`}
                            >
                                <div className="grid grid-cols-[1fr,auto] items-center gap-x-2">
                                    {/* Left Column: Text */}
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="font-semibold text-sm text-foreground truncate">
                                            {conversation.guest_name || `Guest #${conversation.id}`}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground italic truncate">
                                            ID: {conversation.guest_id.slice(0, 8)}...
                                        </span>
                                    </div>

                                    {/* Right Column: Date & Trash */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
                                            {conversation.updated_at} ago
                                        </span>
                                        <ConfirmationAlert
                                            title="Delete Conversation?"
                                            description="This action cannot be undone."
                                            confirmText="Delete permanently"
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
                                                    className="w-7 h-7 rounded-full text-muted-foreground/60 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash size={14} />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* --- RIGHT SIDE: Message Thread --- */}
            <div className="flex-1 flex flex-col bg-background">
                {selectedConversation ? (
                    <>
                        <div className="p-5 border-b flex items-center justify-between bg-muted/5">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-11 w-11 border">
                                    <AvatarFallback className="bg-primary/5 text-primary text-sm font-semibold">
                                        {selectedConversation?.guest_name}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-base text-foreground">
                                        {selectedConversation.guest_name || "Anonymous Guest"}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground italic font-mono">
                                        {selectedConversation.guest_id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 px-6 py-8">
                            <div className="space-y-6">
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex ${
                                            m.sender === "admin" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                                                m.sender === "admin"
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted text-foreground rounded-tl-none border border-muted/50"
                                            }`}
                                        >
                                            {m.body}
                                            <p
                                                className={`text-[10px] mt-2 font-mono ${
                                                    m.sender === "admin"
                                                        ? "opacity-80"
                                                        : "text-muted-foreground/80"
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
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <form
                            onSubmit={handleSendReply}
                            className="p-4 border-t bg-muted/5 flex gap-3"
                        >
                            <Input
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-full h-11 px-5 border-muted/40"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full h-11 w-11"
                                disabled={!reply.trim()}
                            >
                                <Send size={18} />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/70 px-10 text-center gap-5">
                        <div className="p-6 bg-muted rounded-full border border-muted/70">
                            <User size={56} className="opacity-60" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-semibold tracking-tight text-foreground/80">
                                Welcome to Inbox
                            </h3>
                            <p className="max-w-[280px]">
                                Select a conversation from the left to start chatting with your
                                guests.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}