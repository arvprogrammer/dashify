import SessionList from '@/features/user/session/components/SessionList';
import React from 'react';

export default async function DevicesPage({ searchParams }: { searchParams: { page?: string; }; }) {
    const { page } = await searchParams;
    return (
        <SessionList page={page ? parseInt(page) : 1} />
    );
}
