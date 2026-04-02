"use client";

import { useEffect, useState } from "react";
import HomeSection from "@/app/(main-portfolio)/(components)/HomeSection";
import AboutSection from "@/app/(main-portfolio)/(components)/About/AboutSection";
import PortfolioSection from "@/app/(main-portfolio)/(components)/PortfolioSection";
import ContactSection from "@/app/(main-portfolio)/(components)/ContactSection";
import HeaderSection from "@/app/(main-portfolio)/(components)/HeaderSection";
import { motion, AnimatePresence } from "framer-motion";
import { About, Contact, Home, Portfolio, Section } from "@/app/(main-portfolio)/type/type";
import { MessageCircle, X } from "lucide-react";
import ChatWidget from "@/Widget/ChatWidget";
import BlogSection from "@/app/(main-portfolio)/(components)/blog/BlogSection";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";

// Create a small utility to get or create a Guest ID
export const getChatSessionId = () => {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // Generates "550e8400-e29b-41d4-a716-446655440000"
        localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
};

export default function PortfolioClient({ home, about, portfolio, contact, blog }: {
    home: Home,
    about: About,
    portfolio: Portfolio[],
    contact: Contact,
    blog: Blog[]
}) {
    const [activeSection, setActiveSection] = useState<Section>("home");

    // --- chatbot States ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);
    const [guestId, setGuestId] = useState<string>("");

    // Initialize the guest session on mount
    useEffect(() => {
        const id = getChatSessionId();
        setGuestId(id);

        // Real-time Listener logic (Example if using Laravel Echo)
        /*
        window.Echo.private(`chat.${id}`)
            .listen('MessageSent', (e: any) => {
                if (!isChatOpen) {
                    setTotalUnread((prev) => prev + 1);
                }
            });
        */
    }, [isChatOpen]);

    const toggleChat = () => {
        if (!isChatOpen) {
            setTotalUnread(0); // Clear unread when opening
        }
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <div className="bg-black text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black relative">
                {/* Headers */}
                <HeaderSection activeSection={activeSection} setActiveSection={setActiveSection} />

                <main className="container mx-auto px-4 lg:px-20">
                    <AnimatePresence mode="wait">
                        {activeSection === "home" && <HomeSection data={home} onNavigate={setActiveSection} key="home" />}
                        {activeSection === "about" && <AboutSection data={about} key="about" />}
                        {activeSection === "portfolio" && <PortfolioSection data={portfolio} key="portfolio" />}
                        {activeSection === "contact" && <ContactSection data={contact} key="contact" />}
                        {activeSection === "blog" && <BlogSection data={blog} key="blog" />}
                    </AnimatePresence>
                </main>

                {/* --- chatbot System --- */}
                <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
                    {/* Chat Window */}
                    <AnimatePresence>
                        {isChatOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                className="mb-4 w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Chart Widget*/}
                                <ChatWidget guestId={guestId} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating Toggle Button */}
                    <button
                        onClick={toggleChat}
                        className="relative p-4 bg-yellow-500 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-black group"
                    >
                        <AnimatePresence mode="wait">
                            {isChatOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                >
                                    <X size={28} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="chat"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                >
                                    <MessageCircle size={28} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Unread Badge */}
                        {totalUnread > 0 && !isChatOpen && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f172a] animate-bounce">
                                {totalUnread}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
