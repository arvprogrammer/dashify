'use client';

import React, { useEffect } from 'react';
import { userService } from './user.service';
import { useUserStore } from './user.store';

export default function UserProvider({ children }: { children: React.ReactNode; }) {
    const { user, setUser, clearUser } = useUserStore();

    // Fill user data after refresh page
    useEffect(() => {
        if (!user) {
            userService
                .me()
                .then((data) => {
                    setUser(data);
                })
                .catch((e) => {
                    clearUser();
                });
        }
    }, [user, setUser, clearUser]);

    return children;
}
