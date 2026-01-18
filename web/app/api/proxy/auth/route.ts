import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: Request) {
    const { action, name, email, password } = await req.json();

    if (!action) {
        return NextResponse.json({ error: "Action required" }, { status: 400 });
    }
    const cookieStore = await cookies();
    const cookieStr = cookieStore.toString();

    let backendRes: Response;

    switch (action) {
        case "register":
            backendRes = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
                credentials: "include",
            });
            break;

        case "login":
            backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            break;

        case "refresh":
            backendRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json", cookie: cookieStr },
                credentials: "include",
            });
            break;

        case "logout":
            backendRes = await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", cookie: cookieStr },
                credentials: "include",
            });
            break;

        default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = NextResponse.json(
        await backendRes.json(),
        { status: backendRes.status }
    );

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
        response.headers.set("set-cookie", setCookie);
    }

    if (action === "refresh" && backendRes.status === 401) {
        // clear cookies on unauthorized refresh
        response.headers.set("set-cookie", [
            "access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
            "refresh_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
        ].join(", "));
    }

    return response;
}
