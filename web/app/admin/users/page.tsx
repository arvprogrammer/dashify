import AdminUserList from "@/features/admin/users/components/AdminUserList";

export default async function AdminUsersPage({ searchParams }: { searchParams: { page?: string; }; }) {

    const { page } = await searchParams;

    return <AdminUserList page={page ? Number(page) : 1} />;
}
