// lib/api.ts
import { ApiError } from "@/type/api-error";

export async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options && options.headers) || ({} as HeadersInit)),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers,
    });

    if (res.status === 401 || res.status === 403) {
        // clear auth locally
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // redirect only on client
            window.location.href = "/login?session=expired";
        }
        throw new ApiError(res.status, "Unauthorized");
    }

    if (!res.ok) {
        // parse error safely without using `any`
        let errorMessageObj: { message?: string } = {};
        try {
            const parsed = await res.json();
            if (parsed && typeof parsed === "object" && "message" in parsed) {
                errorMessageObj = parsed as { message?: string };
            }
        } catch {
            // JSON parse failed -> keep empty object
        }

        throw new ApiError(res.status, errorMessageObj.message ?? "Request failed");
    }

    // parse response as T
    const json = (await res.json()) as T;
    return json;
}