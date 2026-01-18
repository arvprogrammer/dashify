import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const { cookies, nextUrl } = req;
    const refreshToken = cookies.get("refresh_token")?.value;
    
    const url = nextUrl.clone();

    if (url.pathname.startsWith("/dashboard")) {
        if (!refreshToken) {
            url.pathname = "/signin";
            return NextResponse.redirect(url);
        }
    }

    // if (["/signin", "/signup"].includes(url.pathname)) {
    //     if (refreshToken) {
    //         url.pathname = "/dashboard";
    //         return NextResponse.redirect(url);
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
