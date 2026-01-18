import AdminUpdateTask from '@/features/admin/tasks/components/AdminUpdateTask';

export default async function AdminUpdateTaskPage({ params }: { params: { id: string; }; }) {
    const { id } = await params;
    
    return <AdminUpdateTask taskId={id} />;
}
