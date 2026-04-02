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
        <div className="bg-black text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black relative">

            {/* 1. HEADER SECTION FIX: 
                Ensure HeaderSection has a higher Z-index than the Chatbot if it's a mobile menu. 
                We use z-[70] here. */}
            <div className="relative z-[70]">
                <HeaderSection activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>

            <main className="container mx-auto px-4 lg:px-20 pb-24"> {/* Added pb-24 for mobile scrolling clearance */}
                <AnimatePresence mode="wait">
                    {activeSection === "home" && (
                        <HomeSection
                            data={home}
                            onNavigate={(section) => {
                                // 2. "MORE ABOUT ME" FIX: 
                                // Ensure onNavigate scrolls to top or handles visibility
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setActiveSection(section);
                            }}
                            key="home"
                        />
                    )}
                    {activeSection === "about" && <AboutSection data={about} key="about" />}
                    {activeSection === "portfolio" && <PortfolioSection data={portfolio} key="portfolio" />}
                    {activeSection === "contact" && <ContactSection data={contact} key="contact" />}
                    {activeSection === "blog" && <BlogSection data={blog} key="blog" />}
                </AnimatePresence>
            </main>

            {/* --- Chatbot System FIX --- */}
            {/* 3. POSITIONING: 
                On mobile (sm:), we lift it higher (bottom-24) to clear the mobile menu. 
                On desktop (lg:), we keep it at bottom-6. */}
            <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-[60] flex flex-col items-end">

                {/* Chat Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <ChatWidget guestId={guestId} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Toggle Button */}
                <button
                    onClick={toggleChat}
                    className="relative p-4 lg:p-5 bg-yellow-500 rounded-2xl shadow-[0_10px_40px_rgba(234,179,8,0.3)] hover:scale-110 active:scale-95 transition-all text-black group"
                >
                    <AnimatePresence mode="wait">
                        {isChatOpen ? (
                            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <X size={24} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <MessageCircle size={24} strokeWidth={3} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {totalUnread > 0 && !isChatOpen && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-yellow-500 animate-bounce">
                            {totalUnread}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
