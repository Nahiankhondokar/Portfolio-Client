export const dynamic = "force-dynamic";

import React from "react";
import Me from "@/public/assets/me/me.jpg";
import PortfolioClient from "@/app/(main-portfolio)/PortfolioClient";
import { About, Contact, Home, Portfolio } from "@/app/(main-portfolio)/type/type";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";

// ---- APIs calls ----
interface UserInfoResponse {
    success?: boolean;
    data: {
        name: string;
        subtitle?: string;
        bio?: string;
        image?: string;
        theme_color?: string;
        address?: string;
        email?: string;
        location?: string;
        nationality?: string;
        job_type?: string;
        expertise?: any[];
        experiences?: any[];
        educations?: any[];
        phone?: string;
        resume_url?: string | null;
        metrics?: any[];
        portfolios?: Portfolio[];
        blogs?: Blog[];
    };
}

async function getUserInfo(): Promise<UserInfoResponse> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api.alnahian.me/api/";
    const url = `${apiBase}v1/public/user-info`;

    console.log(`[Fetch] Fetching user info from: ${url}`);

    let res: Response;
    try {
        res = await fetch(url, {
            cache: "no-store", // forces SSR (no caching)
        });
    } catch (fetchError: any) {
        console.error(`[Fetch Error] Network or DNS failure when fetching ${url}:`, fetchError.message || fetchError);
        throw new Error(`Failed to connect to API server at ${url}`);
    }

    if (!res.ok) {
        let errorBody = "";
        try {
            errorBody = await res.text();
        } catch (_) {}
        console.error(
            `[API Error] Received non-ok response from ${url}.\n` +
            `Status: ${res.status} ${res.statusText}\n` +
            `Body: ${errorBody.slice(0, 1000)}`
        );
        throw new Error(`API returned status ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        let bodyText = "";
        try {
            bodyText = await res.text();
        } catch (_) {}
        console.error(
            `[API Error] Received non-JSON response from ${url}.\n` +
            `Content-Type: ${contentType}\n` +
            `Body: ${bodyText.slice(0, 1000)}`
        );
        throw new Error(`Expected JSON response from API, but received Content-Type: ${contentType}`);
    }

    try {
        const data = await res.json();
        return data as UserInfoResponse;
    } catch (parseError: any) {
        console.error(`[API Error] Failed to parse JSON from ${url}:`, parseError.message || parseError);
        throw new Error("Failed to parse JSON response from API");
    }
}

export default async function page() {
    const response = await getUserInfo();
    const data = response.data;

    const home: Home = {
        name: data.name,
        subtitle: data.subtitle ?? "",
        bio: data.bio ?? "",
        image: (data.image ?? Me) as any,
        theme_color: data.theme_color ?? "indigo",
    };

    const contact: Contact = {
        name: data.name,
        address: data.address ?? "",
        email: data.email ?? "",
    };

    const portfolio: Portfolio[] = data.portfolios ?? [];
    const blog: Blog[] = data.blogs ?? [];

    const about: About = {
        name: data.name,
        location: data.location ?? "",
        bio: data.bio ?? "",
        nationality: data.nationality ?? "",
        job_type: data.job_type ?? "",
        expertise: data.expertise ?? [],
        experiences: data.experiences ?? [],
        educations: data.educations ?? [],
        email: data.email ?? "",
        phone: data.phone ?? "",
        resume_url: data.resume_url ?? null,
        metrics: data.metrics ?? []
    };

    return (
        <div className="">
            <PortfolioClient
                home={home}
                about={about}
                portfolio={portfolio}
                contact={contact}
                blog={blog}
            />
        </div>
    );
}