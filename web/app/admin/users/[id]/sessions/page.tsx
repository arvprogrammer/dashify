import AdminUserSessionList from '@/features/admin/users/sessions/components/AdminUserSessionList';

export default async function SessionsPage({ params, searchParams }: { params: { id: string; }; searchParams: { page?: string; }; }) {
    const { id: userId } = await params;
    const { page } = await searchParams;
    return (
        <AdminUserSessionList userId={userId} page={page ? parseInt(page) : 1} />
    );
}
