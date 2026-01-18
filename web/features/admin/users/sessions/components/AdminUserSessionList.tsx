"use client";

import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";
import { Session } from "@/features/user/session/session.type";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { adminSessionService } from "../admin-session.service";
import { useAdminSessionStore } from "../admin-session.store";

export default function AdminSessionList({ userId, page = 1 }: { userId: string; page: number; }) {
    const { sessions, meta, fetchSessions, loading } = useAdminSessionStore();

    useEffect(() => {
        fetchSessions(userId, page);
    }, [userId, page]);

    const handleRevoke = async (session: Session) => {
        try {
            await adminSessionService.revoke(userId, session.id);
            fetchSessions(userId, page);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleRevokeAll = async () => {
        try {
            await adminSessionService.revokeAll(userId);
            fetchSessions(userId, page);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return <div className="text-center mt-8 text-gray-500">Loading user sessions...</div>;
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Devices</h2>
                <Button variant={'destructive'} type="button" onClick={handleRevokeAll}>Sign out All Devices</Button>
            </div>
            {sessions?.length > 0 && <>
                {sessions?.map((session) => (
                    <Card key={session.id} className="max-w-2xl mx-auto mt-6">
                        <CardHeader>
                            <div className="flex flex-col gap-1">
                                <small><b>IP</b> {session.ipAddress}</small>
                                <small><b>User Agent</b> {session.userAgent}</small>
                                <small className="text-gray-500"><i>Logged In {new Date(session.createdAt).toLocaleString()}</i></small>
                                <small className="text-gray-500"><i>Expires At {new Date(session.expiresAt).toLocaleString()}</i></small>
                            </div>
                            <CardAction className="flex gap-2 items-center">
                                {!session.isRevoked && <Button variant="destructive" size="sm" onClick={() => handleRevoke(session)}>
                                    <LogOut /> Sign Out
                                </Button>}
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
                <Pagination page={page} meta={meta} />
            </>}

            {sessions?.length === 0 && (
                <p className="text-center mt-32 text-gray-500">No sessions found.</p>
            )}

        </div>
    );
}

