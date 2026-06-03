
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeInitializer } from "@/components/providers/ThemeInitializer";
import "./globals.css";
import {AuthProvider} from "@/components/providers/AuthProvider";
import {Toaster} from "sonner";
import {GoogleOAuthProvider} from "@react-oauth/google";
import GoogleOauthProvider from "@/components/providers/GoogleOauthProvider";

export const metadata: Metadata = {
  title: "Nahian - Portfolio",
  description: "Software-developer",
};

export default function RootLayout({children}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <ThemeInitializer />
          <GoogleOauthProvider>
              {children}

              {/* ✅ REQUIRED for toast */}
              <Toaster position="top-right" richColors />
          </GoogleOauthProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}
