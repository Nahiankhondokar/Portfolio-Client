"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useChatBotStore} from "@/stores/useChatBotStore";
import {echo} from "@/lib/echo";
import {ChatBotEvent, Message} from "@/type/chatbot/type";

export default function ChatWidget({ guestId }: { guestId: string }) {
    // const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        fetchMessagesByGuestId,
        messages,
        addMessage
    } = useChatBotStore();

    // 1. Initial Load & Real-time Listener (Laravel Echo)
    useEffect( () => {
        if (!guestId || !echo) return;

        fetchMessagesByGuestId(guestId);

        // When mount the component
        const channel = echo.channel(`chat.${guestId}`);
        channel.listen('ChatBotEvent', (e: ChatBotEvent) => {
            console.log('guest reverb -', e);

            if (e?.message.sender == 'admin') {
                addMessage(e.message);
            }
        });

        // When unmount the component
        return () => {
            echo?.leaveChannel(`chat.${guestId}`);
        };
    }, [guestId]);

    // 2. Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            guest_id: guestId,
            message: input,
        };

        try {
            // Optimistic Update (Show message immediately)
            const tempMsg: Message = {
                id: Date.now(),
                conversation_id: 1,
                sender: "guest",
                body: input,
                created_at: new Date().toISOString()
            };
            addMessage(tempMsg);
            setInput("");

            // API Call to Laravel
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/public/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // CRITICAL: Tell Laravel you're sending JSON
                    "Accept": "application/json",       // Helps Laravel return validation errors in JSON
                },
                body: JSON.stringify(newMessage)
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }

            const data = await res.json();
            console.log("Success:", data);

        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                    S
                </div>
                <div>
                    <p className="text-sm font-semibold">Support Admin</p>
                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Message List */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.sender === "guest"
                                        ? "bg-yellow-500 text-black rounded-tr-none"
                                        : "bg-slate-800 text-white rounded-tl-none border border-slate-700"
                                }`}
                            >
                                {msg.body}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Message Form */}
            <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-700 flex items-center gap-2 bg-slate-800/30"
            >
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-slate-900 border-slate-700 focus-visible:ring-yellow-500"
                />
                <Button
                    type="submit"
                    size="icon"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black shrink-0"
                >
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
}
