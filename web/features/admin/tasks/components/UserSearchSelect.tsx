"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { apiFetch } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type UserOption = {
    id: string;
    name: string;
    email: string;
};

interface UserSearchSelectProps {
    value?: string;
    onChange: (userId: string) => void;
}

export function UserSearchSelect({
    value,
    onChange,
}: UserSearchSelectProps) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!open) return;

        const loadSuggestions = async () => {
            setLoading(true);
            try {
                const res = await apiFetch("/api/proxy/admin/users/search");
                const data = await res.json();
                setUsers(data);
            } catch (e) {
                console.error("Failed to load suggestions", e);
            } finally {
                setLoading(false);
            }
        };

        loadSuggestions();
    }, [open]);

    useEffect(() => {
        if (query.length < 2) return;

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await apiFetch(
                    `/api/proxy/admin/users/search?q=${encodeURIComponent(query)}`
                );
                const data = await res.json();
                console.log("Search data", data);
                setUsers(() => data || []);
            } catch (e) {
                console.error("User search failed", e);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    const selectedUser = users?.find((u) => u.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedUser
                        ? `${selectedUser.name} (${selectedUser.email})`
                        : "Select user…"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="max-w-full p-2 flex flex-col gap-2" align="start">
                <Input
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} />
                {users?.map((user) => (
                    <div
                        key={user.id}
                        className={cn(
                            "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-sm",
                            value === user.id ? "bg-gray-200" : ""
                        )}
                        onClick={() => {
                            onChange(user.id);
                            setOpen(false);
                        }}
                    >
                        <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                value === user.id ? "opacity-100" : "opacity-0"
                            )}
                        />
                        <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
}
