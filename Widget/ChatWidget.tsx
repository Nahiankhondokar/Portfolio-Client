"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBotStore } from "@/stores/useChatBotStore";
import { echo } from "@/lib/echo";
import { ChatBotEvent, Message } from "@/type/chatbot/type";

export default function ChatWidget({ guestId }: { guestId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { fetchMessagesByGuestId, messages, addMessage } = useChatBotStore();

    useEffect(() => {
        if (!guestId || !echo || !isOpen) return;

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
    }, [guestId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempMsg: Message = {
            id: Date.now(),
            conversation_id: 1,
            sender: "guest",
            body: input,
            created_at: new Date().toISOString()
        };

        addMessage(tempMsg);
        setInput("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/public/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ guest_id: guestId, message: input })
            });

            if (!res.ok) throw new Error("Failed");
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-2xl bg-yellow-500 hover:bg-yellow-600 text-black z-50 transition-transform active:scale-90"
                >
                    <MessageCircle size={28} />
                </Button>
            )}

            {/* Main Widget Container */}
            <div
                className={`
                    fixed z-50 transition-all duration-300 ease-in-out
                    /* Mobile Styles: Full screen or large bottom fixed */
                    bottom-0 right-0 w-full h-[100dvh] sm:h-[600px] 
                    /* Desktop Styles: Floating box */
                    sm:bottom-4 sm:right-4 sm:w-[400px] sm:rounded-2xl
                    border border-slate-700 bg-slate-900 shadow-2xl flex flex-col
                    ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}
                `}
            >
                {/* Responsive Header */}
                <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                                S
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Support Admin</p>
                            <p className="text-[10px] text-green-400 font-medium">Online</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white sm:flex hidden">
                            <Minus size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Message List Area */}
                <ScrollArea className="flex-1 px-4 py-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800/20 to-transparent">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-[14px] leading-relaxed
                                        ${msg.sender === "guest"
                                            ? "bg-yellow-500 text-black rounded-tr-none shadow-md"
                                            : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700 shadow-sm"
                                        }
                                    `}
                                >
                                    {msg.body}
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} className="h-2" />
                    </div>
                </ScrollArea>

                {/* Responsive Form Area */}
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 pb-[env(safe-area-inset-bottom,1rem)]">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 max-w-full"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="h-11 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-yellow-500 focus-visible:ring-offset-0"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim()}
                            className="h-11 w-11 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shrink-0 shadow-lg shadow-yellow-500/10"
                        >
                            <Send size={18} />
                        </Button>
                    </form>
                    <p className="text-[10px] text-center text-slate-500 mt-2">
                        Powered by AI Support
                    </p>
                </div>
            </div>
        </>
    );
}
