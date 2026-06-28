"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HomeSection from "@/app/(main-portfolio)/(components)/HomeSection";
import AboutSection from "@/app/(main-portfolio)/(components)/About/AboutSection";
import PortfolioSection from "@/app/(main-portfolio)/(components)/PortfolioSection";
import ContactSection from "@/app/(main-portfolio)/(components)/ContactSection";
import HeaderSection from "@/app/(main-portfolio)/(components)/HeaderSection";
import { motion, AnimatePresence } from "framer-motion";
import { About, Contact, Home, Portfolio, Section } from "@/app/(main-portfolio)/type/type";
import { MessageCircle, X, Monitor, Keyboard, Wifi, Headphones, Gamepad2 } from "lucide-react";
import ChatWidget from "@/Widget/ChatWidget";
import BlogSection from "@/app/(main-portfolio)/(components)/blog/BlogSection";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import GithubActivitySection from "@/app/(main-portfolio)/(components)/GithubActivitySection";
import Image from "next/image";
import codingBg from "@/public/assets/coding_fixed_bg.png";

import { applyThemeColor } from "@/lib/theme";

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
const SECTIONS: Section[] = ["home", "about", "portfolio", "activity", "blog", "contact"];

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
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeSpec, setActiveSpec] = useState<string | null>(null);

    const specs = [
        { id: "display", label: "Display Setup", desc: "Xiaomi 34\" 144Hz Ultrawide", icon: Monitor },
        { id: "keyboard", label: "Keyboard Specs", desc: "Keychron K2 V2 (Brown Switch)", icon: Keyboard },
        { id: "network", label: "Network Tools", desc: "MikroTik Router + Fiber", icon: Wifi },
        { id: "audio", label: "Audio Gear", desc: "FIFINE Studio Mic + Edifier Speaker", icon: Headphones },
        { id: "gaming", label: "System Specs", desc: "RTX 4070 Laptop + PS5 DualSense", icon: Gamepad2 },
    ];

    // Ref to track if scroll was triggered by a nav click (to avoid fighting IntersectionObserver)
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Dynamic theme applying effect
    useEffect(() => {
        applyThemeColor(home.theme_color || "indigo");
    }, [home.theme_color]);

    // Initialize the guest session on mount
    useEffect(() => {
        const id = getChatSessionId();
        setGuestId(id);

        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // --- Optimized Scroll-Spy via Window Scroll Listener ---
    useEffect(() => {
        // Cache section tops/heights to avoid layout thrashing on every scroll
        let sectionTops: { id: string; top: number; height: number }[] = [];

        const recalcSectionPositions = () => {
            sectionTops = SECTIONS.map((sectionId) => {
                const el = document.getElementById(sectionId);
                return {
                    id: sectionId,
                    top: el ? el.offsetTop : 0,
                    height: el ? el.offsetHeight : 0,
                };
            });
        };

        recalcSectionPositions();
        window.addEventListener("resize", recalcSectionPositions, { passive: true });

        const handleScroll = () => {
            if (isScrollingRef.current) return;

            const scrollPosition = window.scrollY + window.innerHeight * 0.35;

            for (const s of sectionTops) {
                if (scrollPosition >= s.top && scrollPosition < s.top + s.height) {
                    setActiveSection(s.id as Section);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", recalcSectionPositions);
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
        <div className="text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            
            {/* Solid Dark Background Canvas */}
            <div className="fixed inset-0 bg-[#080b11] -z-40 pointer-events-none will-change-transform" style={{ transform: "translateZ(0)" }} />

            {/* Premium Fixed Parallax Coding Background */}
            <div className="fixed inset-0 pointer-events-none -z-30 select-none opacity-[0.08] will-change-transform" style={{ transform: "translateZ(0)" }}>
                <Image
                    src={codingBg}
                    alt="Coding background texture"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Subtle Tech Blueprint Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none -z-10 will-change-transform" style={{ transform: "translateZ(0)" }} />

            {/* Glowing Soft Spotlight Orbs */}
            <div className="fixed inset-0 pointer-events-none -z-20 will-change-transform" style={{ transform: "translateZ(0)" }}>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] opacity-40" />
            </div>

            {/* Header with higher z-index than the Chatbot mobile menu */}
            <div className="relative z-[70]">
                <HeaderSection
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />
            </div>

            <main className="container mx-auto px-4 lg:px-20 pb-12 sm:pb-24">

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

                <section id="activity">
                    <GithubActivitySection />
                </section>

                <section id="blog">
                    <BlogSection data={blog} />
                </section>

                <section id="contact">
                    <ContactSection data={contact} />
                </section>

            </main>

            {/* --- Premium Professional Footer --- */}
            <footer className="border-t border-zinc-900 bg-black/60 backdrop-blur-xl pt-12 pb-32 sm:py-12 mt-12 relative z-50" style={{ willChange: "transform", transform: "translateZ(0)" }}>
                <div className="container mx-auto px-4 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                        <p className="text-zinc-500 text-xs font-semibold tracking-wide uppercase">
                            © {new Date().getFullYear()} {home.name}. All rights reserved.
                        </p>
                        <p className="text-[10px] font-mono text-zinc-600 tracking-wider">
                            currently swimming in code & occasionally in the sea 🌊
                        </p>
                    </div>

                    {/* Developer Hardware Setup Easter Eggs */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 bg-zinc-950/45 border border-zinc-900 rounded-full px-3 py-1.5 z-10">
                            {specs.map((spec) => {
                                const Icon = spec.icon;
                                const isActive = activeSpec === spec.id;
                                return (
                                    <button
                                        key={spec.id}
                                        onClick={() => setActiveSpec(isActive ? null : spec.id)}
                                        className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 relative ${
                                            isActive 
                                                ? "text-indigo-400 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] border border-indigo-800/30" 
                                                : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/40 border border-transparent"
                                        }`}
                                        title={spec.label}
                                    >
                                        <Icon size={14} />
                                    </button>
                                );
                            })}
                        </div>
                        
                        <AnimatePresence>
                            {activeSpec && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -4 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -4 }}
                                    className="overflow-hidden w-full max-w-[280px]"
                                >
                                    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl px-4 py-2 font-mono text-[9px] text-center text-zinc-400 tracking-wider shadow-inner">
                                        <span className="text-indigo-400/80 font-black uppercase text-[8px] mr-1 block sm:inline">
                                            {specs.find(s => s.id === activeSpec)?.label}:
                                        </span>
                                        {specs.find(s => s.id === activeSpec)?.desc}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sleek, professional CTA button for public Todo tracker */}
                    <Link
                        href="/todo"
                        className="relative px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-300 group flex items-center gap-3 overflow-hidden shadow-lg"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-indigo-400 transition-colors">
                            Todo & Time Tracker
                        </span>
                        <span className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs">
                            →
                        </span>
                    </Link>
                </div>
            </footer>

            {/* --- Chatbot System --- */}
            <div className="fixed bottom-24 right-6 z-[999] lg:bottom-8 lg:right-8 flex flex-col items-end">

                {/* Chat Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[680px] max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <ChatWidget guestId={guestId} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative group">
                    <AnimatePresence>
                        {showTooltip && !isChatOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                className="absolute bottom-full right-0 mb-4 whitespace-nowrap bg-white text-black px-4 py-2 rounded-2xl rounded-br-sm shadow-xl text-xs font-black uppercase tracking-wider"
                            >
                                <span className="relative z-10">Hi! Any questions? 👋</span>
                                <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => {
                            toggleChat();
                            setShowTooltip(false);
                        }}
                        className="relative p-4 lg:p-5 bg-indigo-500 rounded-2xl shadow-[0_10px_40px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all text-white"
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
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-indigo-500 animate-bounce">
                            {totalUnread}
                        </span>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}
