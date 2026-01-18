import { apiFetch } from "@/lib/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminProvider({ children }: { children: React.ReactNode; }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");
    if (!accessToken) {
        redirect('/signin');
    }

    try {
        const res = await apiFetch(`/api/proxy/user`, {
            headers: {
                "Content-Type": "application/json",
                'Cookie': `${accessToken.name}=${accessToken.value}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) redirect('/signin');

        const user = await res.json();

        if (user.role !== 'ADMIN') redirect('/signin');
    } catch (e) {
        redirect('/signin');
    }
    
    return children;
}
