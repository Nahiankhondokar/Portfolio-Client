// --- Types ---
export type Section = "home" | "about" | "portfolio" | "contact" | "blog";
export type Home = Pick<UserInfo, "name" | "subtitle" | "image" | "bio">
export type About = Pick<UserInfo,
    "name" | "location" | "nationality" | "bio" |
    "phone" | "job_type" | "metrics" |
    "expertise" | "experiences" | "educations" | "email" | "resume_url"
>

export type Contact = Pick<UserInfo, "name" | "address" | "email">

export interface UserInfo {
    id: number;
    name: string;
    email: string;
    username: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    image: string | null;
    phone: string | null;
    socials: Social[];
    nationality: string | null;
    subtitle: string | null;
    address: string | null;
    job_type: string | null;
    resume_url: string | null;
    metrics: Metrics[];
    expertise: Expertise[] | [];
    experiences: Experience[] | [];
    educations: Education[] | [];
    portfolios: Portfolio[] | [];
}

export interface Metrics {
    label: string | null;
    value: string | null;
}
export interface Expertise {
    id: number;
    name: string;
    description: string;
    status: boolean;
    progress: string; // "10%"
}

export interface Experience {
    id: number;
    title: string;
    description: string;
    position: string;
    duration: string;
    institute: string;
    start_date: string; // ISO date
    end_date: string;   // ISO date
    media: string | null;
    year: string | null
}

export interface Social {
    id: number;
    platform: string;
    url: string;
}

export interface Education {
    id: number;
    title: string;
    description: string;
    position: string;
    duration: string;
    institute: string;
    start_date: string; // ISO date
    end_date: string;   // ISO date
    media: string | null;
    year: string | null
}

export interface Portfolio {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    project_link: string;
    media: string | null;
    status: boolean;
    created_at?: string
}
