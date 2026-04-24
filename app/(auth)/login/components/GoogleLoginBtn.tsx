'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import useAuthStore from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import { User } from "@/type/user";
import { useState } from 'react';

interface GoogleLoginResponse {
    token: string;
    user: User;
}

export default function GoogleLoginBtn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const setUser = useAuthStore(state => state.setUser);
    const setToken = useAuthStore(state => state.setToken);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const res = await apiFetch<GoogleLoginResponse>("auth/google", {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: tokenResponse.access_token,
                    }),
                });

                setUser(res.user);
                setToken(res.token);

                document.cookie = `auth_token=${res.token}; path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
                localStorage.setItem("auth_token", res.token);

                router.push("/dashboard");
            } catch (error) {
                console.error("Google login failed", error);
            } finally {
                setLoading(false);
            }
        },
        onError: () => console.error("Google sign-in failed"),
    });

    return (
        <button
            type="button"
            onClick={() => login()}
            disabled={loading}
            className="
                group relative w-full flex items-center justify-center gap-3
                px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-700 dark:text-zinc-200
                text-sm font-medium
                shadow-sm
                hover:bg-zinc-50 dark:hover:bg-zinc-800
                hover:border-zinc-300 dark:hover:border-zinc-600
                hover:shadow-md
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
            "
        >
            {/* Google "G" SVG — official color logo */}
            {loading ? (
                <svg
                    className="animate-spin h-4 w-4 text-zinc-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-4 h-4 flex-shrink-0"
                    aria-hidden="true"
                >
                    <path fill="#4285F4" d="M46.145 24.507c0-1.6-.144-3.14-.412-4.62H24v8.747h12.445c-.537 2.9-2.17 5.357-4.627 7.006v5.824h7.495c4.385-4.04 6.832-9.997 6.832-16.957z" />
                    <path fill="#34A853" d="M24 47c6.237 0 11.468-2.069 15.29-5.607l-7.495-5.824c-2.071 1.387-4.72 2.207-7.795 2.207-5.994 0-11.073-4.05-12.886-9.491H3.395v6.015C7.2 42.64 15.04 47 24 47z" />
                    <path fill="#FBBC05" d="M11.114 28.285A13.84 13.84 0 0 1 10.4 24c0-1.492.254-2.94.714-4.285v-6.015H3.395A23.93 23.93 0 0 0 0 24c0 3.867.927 7.524 2.562 10.3v.001l8.552-6.016z" />
                    <path fill="#EA4335" d="M24 9.523c3.376 0 6.41 1.162 8.794 3.44l6.593-6.594C35.462 2.693 30.232.5 24 .5 15.04.5 7.2 4.86 3.395 13.7l8.553 6.015C13.76 14.272 18.006 9.523 24 9.523z" />
                </svg>
            )}

            <span className="leading-none">
                {loading ? "Signing in..." : "Continue with Google"}
            </span>
        </button>
    );
}