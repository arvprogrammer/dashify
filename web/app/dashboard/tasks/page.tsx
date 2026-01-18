import TaskList from "@/features/task/components/TaskList";

export default async function TasksPage({ searchParams }: { searchParams: { page?: string; }; }) {

    const { page } = await searchParams;
    
    return <TaskList page={page ? Number(page) : 1} />;
}
