import UPdateTsk from '@/features/task/components/UpdateTask';

export default async function UpdateTaskPage({ params }: { params: { id: string; }; }) {
    const { id } = await params;
    return (
        <div>
            <UPdateTsk taskId={id} />
        </div>
    );
}
