import { ApiError } from "@/type/api-error";

export async function teamFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("team_auth_token")
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

    if (res.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("team_auth_token");
            window.location.href = "/football/login";
        }
        throw new ApiError(res.status, "Unauthorized");
    }

    if (!res.ok) {
        let errorMessageObj: { message?: string } = {};
        try {
            const parsed = await res.json();
            if (parsed && typeof parsed === "object" && "message" in parsed) {
                errorMessageObj = parsed as { message?: string };
            }
        } catch {
            // ignore JSON parse failure
        }

        throw new ApiError(res.status, errorMessageObj.message ?? "Request failed");
    }

    return (await res.json()) as T;
}
