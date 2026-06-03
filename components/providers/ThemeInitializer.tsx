"use client";

import { useEffect } from "react";
import { applyThemeColor } from "@/lib/theme";

export function ThemeInitializer() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}v1/public/user-info`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch info");
        return res.json();
      })
      .then((payload) => {
        const themeColor = payload?.data?.theme_color || "indigo";
        applyThemeColor(themeColor);
      })
      .catch(() => {
        // Fallback to indigo on failure
        applyThemeColor("indigo");
      });
  }, []);

  return null;
}
