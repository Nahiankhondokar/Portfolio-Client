// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value ?? null;
    const { pathname } = req.nextUrl;

    const isAuthPage =
        pathname === "/login" || pathname === "/register";

    const isProtectedRoute = pathname.startsWith("/dashboard");

    // 🔐 Not logged in → block protected routes
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);

        return NextResponse.redirect(loginUrl);
    }

    // 🛡️ Verify token if accessing protected route
    if (isProtectedRoute && token) {
        try {
            const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (apiRes.status === 401) {
                const response = NextResponse.redirect(new URL("/login?session=expired", req.url));
                response.cookies.delete("auth_token");
                return response;
            }
        } catch (error) {
            console.error("Auth verification error:", error);
            // In case of API failure, we might still want to allow the request
            // or handle it depending on requirements. For now, we allow.
        }
    }

    // 🚫 Logged in → block auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
