"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";

export default function ScreenshotButton() {
    const [capturing, setCapturing] = useState(false);

    const handleScreenshot = async () => {
        if (capturing) return;
        setCapturing(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(document.body, {
                backgroundColor: "#000000",
                scale: Math.min(window.devicePixelRatio || 1, 2),
                useCORS: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `football-finance-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Screenshot failed:", error);
        } finally {
            setCapturing(false);
        }
    };

    return (
        <button
            onClick={handleScreenshot}
            disabled={capturing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
        >
            {capturing ? (
                <Loader2 size={16} className="animate-spin text-indigo-400" />
            ) : (
                <Camera size={16} className="text-indigo-400" />
            )}
            {capturing ? "Capturing..." : "Screenshot"}
        </button>
    );
}
