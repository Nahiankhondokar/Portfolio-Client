"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { colorsMap, applyThemeColor } from "@/lib/theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Palette, Check, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const THEME_OPTIONS = [
  { id: "indigo", name: "Electric Indigo", desc: "Sleek, deep digital SaaS aesthetic" },
  { id: "emerald", name: "Cyber Emerald", desc: "Classic high-contrast developer terminal vibe" },
  { id: "rose", name: "Crimson Rose", desc: "Vibrant and intense neon ruby accents" },
  { id: "amber", name: "Cyber Amber", desc: "Futuristic hardware blueprint amber glow" },
  { id: "violet", name: "Royal Violet", desc: "Premium luxury neon purple styling" },
  { id: "cyan", name: "Cyberpunk Cyan", desc: "High-energy cyberpunk neon teal accent" },
  { id: "blue", name: "Electric Blue", desc: "Professional cobalt developer aesthetic" },
];

export default function ThemeSettingsPage() {
  const { profile, fetchProfile, updateProfile, loading } = useProfileStore();
  const [selectedColor, setSelectedColor] = useState<string>("indigo");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.theme_color) {
      setSelectedColor(profile.theme_color);
    }
  }, [profile]);

  const handlePreviewColor = (colorId: string) => {
    setSelectedColor(colorId);
    // Apply client-side preview immediately in the session
    applyThemeColor(colorId);
  };

  const handleSaveTheme = async () => {
    const fd = new FormData();
    fd.append("name", profile?.name || "");
    fd.append("email", profile?.email || "");
    fd.append("username", profile?.username || "");
    fd.append("bio", profile?.bio || "");
    fd.append("location", profile?.location || "");
    fd.append("website", profile?.website || "");
    fd.append("phone", profile?.phone || "");
    fd.append("theme_color", selectedColor);

    try {
      await updateProfile(fd);
      toast.success(`Theme color updated to ${colorsMap[selectedColor] ? selectedColor : "indigo"} successfully!`);
    } catch {
      toast.error("Failed to update theme color. Please try again.");
    }
  };

  const activePalette = colorsMap[selectedColor] || colorsMap.indigo;

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Palette className="h-8 w-8 text-yellow-500 animate-pulse" />
          Theme Settings
        </h1>
        <p className="text-zinc-500 text-sm">
          Dynamically customize the accent colors, ambient glows, and visual charts of your public portfolio page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Swatches Selector */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-zinc-900/60 pb-6">
              <CardTitle className="text-white text-lg font-bold">Accent Theme Presets</CardTitle>
              <CardDescription className="text-zinc-500">
                Choose a base theme. Clicking changes the active preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {THEME_OPTIONS.map((opt) => {
                const palette = colorsMap[opt.id] || colorsMap.indigo;
                const isSelected = selectedColor === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePreviewColor(opt.id)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                      isSelected
                        ? "bg-zinc-900/60 border-zinc-700 shadow-md scale-[1.01]"
                        : "bg-zinc-900/10 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Swatch dots */}
                      <div className="flex -space-x-1">
                        <span
                          className="w-4 h-4 rounded-full border border-black"
                          style={{ backgroundColor: palette.light }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black relative z-10"
                          style={{ backgroundColor: palette.main }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black relative z-20"
                          style={{ backgroundColor: palette.dark }}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">
                          {opt.name}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{opt.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: palette.main }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-zinc-800 group-hover:border-zinc-700 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] sticky top-6 overflow-hidden flex flex-col justify-between min-h-[500px]">
            <CardHeader className="border-b border-zinc-900/60 pb-6">
              <CardTitle className="text-white text-lg font-bold">Dynamic Live Preview</CardTitle>
              <CardDescription className="text-zinc-500">
                Mockup representing the portfolio visual highlights.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
              {/* Portfolio Page Mockup Container */}
              <div className="bg-[#080b11] border border-zinc-900 rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center gap-6">
                {/* Tech Blueprint Grid simulation */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-[0.03] pointer-events-none" />

                {/* Spotlights */}
                <div
                  className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[40px] pointer-events-none opacity-40 transition-colors duration-500"
                  style={{ backgroundColor: activePalette.main }}
                />

                {/* Mockup Header Navigation */}
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900/50">
                  <div className="w-4 h-4 rounded-full bg-zinc-800" />
                  <div className="flex gap-3">
                    <span className="w-8 h-2 rounded bg-zinc-800" />
                    <span
                      className="w-10 h-2 rounded transition-colors duration-500"
                      style={{ backgroundColor: activePalette.main }}
                    />
                    <span className="w-8 h-2 rounded bg-zinc-800" />
                  </div>
                </div>

                {/* Mockup Profile Bio details */}
                <div className="space-y-3 z-10">
                  <div
                    className="inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-500"
                    style={{ backgroundColor: `${activePalette.main}1a`, color: activePalette.light }}
                  >
                    Available for Freelance
                  </div>
                  <h3 className="text-white text-xl font-black leading-tight uppercase tracking-tight">
                    Engineering Scalable <br />
                    Web Ecosystems
                  </h3>
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-zinc-900 rounded" />
                    <div className="w-4/5 h-1.5 bg-zinc-900 rounded" />
                  </div>
                </div>

                {/* Mockup Button controls */}
                <div className="flex gap-3 z-10 pt-2">
                  <div
                    className="flex-1 py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider text-white shadow-lg transition-all duration-500 flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: activePalette.main,
                      boxShadow: `0 4px 14px ${activePalette.main}33`,
                    }}
                  >
                    Get In Touch
                  </div>
                  <div className="flex-1 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    View Work
                  </div>
                </div>

                {/* Progress tracker simulation */}
                <div className="space-y-1 z-10 mt-2">
                  <div className="flex justify-between text-[8px] font-bold uppercase text-zinc-500">
                    <span>Task Completion</span>
                    <span style={{ color: activePalette.light }}>92%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: "92%", backgroundColor: activePalette.main }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-6 border-t border-zinc-900/60 mt-6 flex gap-4">
                <Button
                  onClick={handleSaveTheme}
                  disabled={loading}
                  className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Active Theme"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
