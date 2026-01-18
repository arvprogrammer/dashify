import AdminTaskList from "@/features/admin/tasks/components/AdminTaskList";

export default async function AdminTasksPage({ searchParams }: { searchParams: { page?: string; }; }) {

    const { page } = await searchParams;

    return <AdminTaskList page={page ? Number(page) : 1} />;
}
