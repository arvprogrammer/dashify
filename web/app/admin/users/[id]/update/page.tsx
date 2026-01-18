import AdminUpdateUser from "@/features/admin/users/components/AdminUpdateUser";

export default async function AdminUpdateUserPage({ params }: { params: { id: string; }; }) {
    const { id } = await params;

    return <AdminUpdateUser userId={id} />;
}
