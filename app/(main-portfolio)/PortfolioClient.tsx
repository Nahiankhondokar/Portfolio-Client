"use client";

import { useEffect, useRef, useState } from "react";
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
        sessionId = crypto.randomUUID();
        localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
};

// Sections in render order
const SECTIONS: Section[] = ["home", "about", "portfolio", "blog", "contact"];

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

    // Ref to track if scroll was triggered by a nav click (to avoid fighting IntersectionObserver)
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initialize the guest session on mount
    useEffect(() => {
        const id = getChatSessionId();
        setGuestId(id);
    }, []);

    // --- Scroll-Spy via IntersectionObserver ---
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        SECTIONS.forEach((sectionId) => {
            const el = document.getElementById(sectionId);
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Only update if not in the middle of a programmatic scroll
                        if (entry.isIntersecting && !isScrollingRef.current) {
                            setActiveSection(sectionId);
                        }
                    });
                },
                {
                    // Trigger when the section occupies at least 40% of the viewport
                    threshold: 0.4,
                }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
        };
    }, []);

    // --- Smooth Scroll Helper ---
    const scrollToSection = (sectionId: Section) => {
        const el = document.getElementById(sectionId);
        if (!el) return;

        // Temporarily pause the IntersectionObserver from overriding our state
        isScrollingRef.current = true;
        setActiveSection(sectionId);

        el.scrollIntoView({ behavior: "smooth", block: "start" });

        // Re-enable observer after the scroll animation completes (~800ms)
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 900);
    };

    const toggleChat = () => {
        if (!isChatOpen) {
            setTotalUnread(0);
        }
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black relative">

            {/* Header with higher z-index than the Chatbot mobile menu */}
            <div className="relative z-[70]">
                <HeaderSection
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />
            </div>

            <main className="container mx-auto px-4 lg:px-20 pb-24">

                {/* All sections rendered simultaneously — scroll-spy controls the active indicator */}
                <section id="home">
                    <HomeSection
                        data={home}
                        onNavigate={scrollToSection}
                    />
                </section>

                <section id="about">
                    <AboutSection data={about} />
                </section>

                <section id="portfolio">
                    <PortfolioSection data={portfolio} />
                </section>

                <section id="blog">
                    <BlogSection data={blog} />
                </section>

                <section id="contact">
                    <ContactSection data={contact} />
                </section>

            </main>

            {/* --- Chatbot System --- */}
            <div className="fixed bottom-24 right-6 z-[999] lg:bottom-8 lg:right-8 flex flex-col items-end">

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
