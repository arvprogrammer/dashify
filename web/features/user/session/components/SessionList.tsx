"use client";

import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { sessionService } from "../session.service";
import { useSessionStore } from "../session.store";
import { Session } from "../session.type";
import ConfirmButton from "@/components/ConfirmButton";

export default function SessionList({ page = 1 }: { page: number; }) {
    const { sessions, meta, fetchSessions, loading } = useSessionStore();

    useEffect(() => {
        fetchSessions(page);
    }, [page]);

    const handleRevoke = async (session: Session) => {
        try {
            await sessionService.revoke(session.id);
            fetchSessions(page);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleRevokeAll = async () => {
        try {
            await sessionService.revokeAll();
            fetchSessions(page);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return <div className="text-center mt-8 text-gray-500">Loading sessions...</div>;
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Devices</h2>
                <ConfirmButton
                    title="Sign Out All Devices"
                    description="Are you sure you want to sign out from all devices?"
                    variant={'destructive'}
                    onClick={handleRevokeAll}>
                    Sign out All Devices
                </ConfirmButton>
            </div>
            {sessions?.length > 0 && sessions?.map((session) => (
                <Card key={session.id} className="max-w-2xl mx-auto mt-6">
                    <CardHeader>
                        <div className="flex flex-col gap-1">
                            <small><b>IP</b> {session.ipAddress}</small>
                            <small><b>User Agent</b> {session.userAgent}</small>
                            <small className="text-gray-500"><i>Logged In {new Date(session.createdAt).toLocaleString()}</i></small>
                            <small className="text-gray-500"><i>Expires At {new Date(session.expiresAt).toLocaleString()}</i></small>
                        </div>
                        <CardAction className="flex gap-2 items-center">
                            <ConfirmButton
                                title="Sign Out"
                                description="Are you sure you want to sign out?"
                                size="sm"
                                onClick={() => handleRevoke(session)}>
                                <LogOut /> Sign Out
                            </ConfirmButton>
                        </CardAction>
                    </CardHeader>
                </Card>
            ))}

            {sessions?.length === 0 && (
                <p className="text-center mt-32 text-gray-500">No sessions found.</p>
            )}

            <Pagination page={page} meta={meta} />
        </div>
    );
}

