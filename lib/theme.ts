// lib/theme.ts

export const colorsMap: Record<string, { light: string; main: string; dark: string; ultraDark: string }> = {
  indigo: { light: "#818cf8", main: "#6366f1", dark: "#4f46e5", ultraDark: "#09090b" },
  rose: { light: "#fb7185", main: "#f43f5e", dark: "#e11d48", ultraDark: "#0f0507" },
  amber: { light: "#fbbf24", main: "#f59e0b", dark: "#d97706", ultraDark: "#0f0a02" },
  emerald: { light: "#34d399", main: "#10b981", dark: "#059669", ultraDark: "#020f0a" },
  violet: { light: "#a78bfa", main: "#8b5cf6", dark: "#7c3aed", ultraDark: "#0a020f" },
  cyan: { light: "#22d3ee", main: "#06b6d4", dark: "#0891b2", ultraDark: "#020a0f" },
  blue: { light: "#60a5fa", main: "#3b82f6", dark: "#2563eb", ultraDark: "#02070f" },
};

export const applyThemeColor = (color: string) => {
  const selectedColor = color || "indigo";
  const colors = colorsMap[selectedColor] || colorsMap.indigo;

  if (typeof window !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--theme-primary-light", colors.light);
    root.style.setProperty("--theme-primary", colors.main);
    root.style.setProperty("--theme-primary-dark", colors.dark);
    root.style.setProperty("--theme-primary-ultra-dark", colors.ultraDark);
  }
};
