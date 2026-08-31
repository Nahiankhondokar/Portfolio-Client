"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TeamAuthLink() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(Boolean(localStorage.getItem("team_auth_token")));
    }, []);

    if (loggedIn) {
        return (
            <Link
                href="/football/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
                <ArrowLeft size={16} className="text-indigo-400" />
                Back to Dashboard
            </Link>
        );
    }

    return (
        <Link
            href="/football/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
        >
            <ShieldCheck size={16} className="text-indigo-400" />
            Admin Login
        </Link>
    );
}
