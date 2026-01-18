import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(req: NextRequest, ctx: RouteContext<'/api/proxy/admin/users/[id]/sessions'>) {
    const { id } = await ctx.params;
    return forward(req, `/admin/users/${id}/sessions?${req.nextUrl.searchParams.toString()}`);
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/proxy/admin/users/[id]/sessions'>) {
    const { id } = await ctx.params;
    return forward(req, `/admin/users/${id}/sessions`, true);
}

async function forward(
    req: NextRequest,
    endpoint: string,
    hasBody = false
) {
    const cookieStore = await cookies();

    const accessCookie = cookieStore.get("access_token");
    if (!accessCookie) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Cookie: `${accessCookie.name}=${accessCookie.value}`,
    };

    const backendRes = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: req.method,
        headers,
        body: hasBody ? await req.text() : undefined,
        credentials: "include",
    });

    // forward refreshed cookies if backend sets them
    const response = NextResponse.json(
        await backendRes.json(),
        { status: backendRes.status }
    );

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
        response.headers.set("set-cookie", setCookie);
    }

    return response;
}
