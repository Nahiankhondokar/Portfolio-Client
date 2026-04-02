
import React from "react";
import Me from "@/public/assets/me/me.jpg";
import PortfolioClient from "@/app/(main-portfolio)/PortfolioClient";
import { About, Contact, Home, Portfolio } from "@/app/(main-portfolio)/type/type";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";

// ---- APIs calls ----
async function getHome(): Promise<Home> {
    const url = "v1/public/user-info";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            cache: "no-store", // forces SSR (no caching)
        }
    );

    const data = await res.json();

    return {
        name: data.data.name,
        subtitle: data.data.subtitle ?? "",
        bio: data.data.bio ?? "",
        image: data.data.image ?? Me,
    };
}

async function getContact(): Promise<Contact> {
    const url = "v1/public/user-info";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            cache: "no-store", // forces SSR (no caching)
        }
    );

    const data = await res.json();

    return {
        name: data.data.name,
        address: data.data.address ?? "",
        email: data.data.email ?? "",
    };
}
async function getPortfolio(): Promise<Portfolio[]> {
    const url = "v1/public/user-info";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            cache: "no-store", // forces SSR (no caching)
        }
    );

    const data = await res.json();
    return data.data.portfolios;
}

async function getBlog(): Promise<Blog> {
    const url = "v1/public/user-info";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            cache: "no-store", // forces SSR (no caching)
        }
    );

    const data = await res.json();

    return data.data.blogs;
}

async function getAbout(): Promise<About> {
    const url = "v1/public/user-info";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            cache: "no-store", // forces SSR (no caching)
        }
    );

    const data = await res.json();

    return {
        name: data.data.name,
        location: data.data.location ?? "",
        bio: data.data.bio ?? "",
        nationality: data.data.nationality ?? "",
        job_type: data.data.job_type ?? "",
        expertise: data.data.expertise ?? [],
        experiences: data.data.experiences ?? [],
        educations: data.data.educations ?? [],
        email: data.data.email ?? "",
        phone: data.data.phone ?? "",
        resume_url: data.data.resume_url ?? null,
        metrics: data.data.metrics ?? []
    };
}



export default async function page() {
    // parallel fetch
    const [home, about, portfolio, contact, blog] = await Promise.all([
        getHome(), getAbout(), getPortfolio(), getContact(), getBlog()
    ]);

    return (
        // pass server-fetched data as props to the client
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