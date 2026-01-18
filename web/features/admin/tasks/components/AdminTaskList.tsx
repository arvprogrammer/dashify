"use client";

import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAdminTasksStore } from "@/features/admin/tasks/admin-tasks.store";
import { Task } from "@/features/task/task.type";
import { User } from "@/features/user/user.type";
import { Edit, PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { adminTasksService } from "../admin-task.service";
import ConfirmButton from "@/components/ConfirmButton";

export default function AdminTaskList({ page = 1 }: { page: number; }) {
    const { tasks, meta, fetchTasks, loading, removeTask, updateTask } = useAdminTasksStore();
    const router = useRouter();

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    const toggleCompleted = async (data: Task & { user?: User; }) => {
        try {
            const { user, ...task } = data;
            task.status = task.status === 'DONE' ? 'TODO' : 'DONE';
            const updated = await adminTasksService.update(task);
            updateTask(updated);
            toast.success(`Task marked as ${updated.status === 'DONE' ? '"Completed"' : '"To Do"'}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (task: Task) => {
        try {
            await adminTasksService.remove(task.id);
            removeTask(task.id);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCreate = async () => {
        router.push(`/admin/tasks/create`);
    };

    const handleUpdate = async (task: Task) => {
        router.push(`/admin/tasks/${task.id}/update`);
    };

    if (loading) {
        return <div className="text-center mt-8 text-gray-500">Loading tasks...</div>;
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Your Tasks</h2>
                <Button variant={"outline"} onClick={handleCreate}><PlusIcon /> Create New Task</Button>
            </div>
            {tasks.length > 0 && (<>
                {tasks.map((task) => (
                    <Card key={task.id} className="max-w-2xl mx-auto mt-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Checkbox checked={task.status === 'DONE'} onCheckedChange={() => toggleCompleted(task)} />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{task.status === 'DONE' ? 'Completed' : 'Not Completed'}</p>
                                        <i>{task.completedAt ? 'Completed at ' + new Date(task.completedAt).toLocaleString() : ""}</i>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="flex flex-col">
                                    <div className="flex gap-2 items-center">
                                        <b className={task.status === 'DONE' ? "line-through text-gray-500" : ""}>
                                            {task.title}
                                        </b>
                                        <i className="text-sm text-gray-500">
                                            {task.date ? new Date(task.date).toDateString() : ""}
                                            {" "}
                                            {task.time ? new Date(`1970-01-01T${task.time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </i>
                                    </div>
                                    <i>{task.description}</i>
                                    <small>By {task.user?.name} [{task.user?.email}]</small>
                                </div>
                            </div>
                            <CardAction className="flex gap-2">
                                <Button variant={'secondary'} size="sm" onClick={() => handleUpdate(task)}>
                                    <Edit /> Update
                                </Button>
                                <ConfirmButton
                                    title="Delete Task"
                                    description={`Are you sure you want to delete task "${task.title}"?`}
                                    size="sm"
                                    onClick={() => handleDelete(task)}>
                                    <Trash /> Delete
                                </ConfirmButton>
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
                <Pagination page={page} meta={meta} />
            </>)}

            {tasks.length === 0 && (
                <p className="text-center mt-32 text-gray-500">No tasks found. Create a new task to get started!</p>
            )}
        </div>
    );
}

