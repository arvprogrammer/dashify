/**
 * Task Form Component
 * Handles both creation and updating of tasks.
 */

"use client";

import ConfirmButton from "@/components/ConfirmButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tasksService } from "@/features/task/task.service";
import { useTasksStore } from "@/features/task/task.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, Edit, Plus, PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// --- Zod schema ---
const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], { message: "Priority is required" }),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"], { message: "Status is required" }),
    date: z.date().optional(),
    time: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function UpdateTask({ taskId }: { taskId: string; }) {
    const { removeTask, updateTask } = useTasksStore();
    const [newTaskDate, setNewTaskDate] = useState<Date | undefined>();
    const [newTaskTime, setNewTaskTime] = useState<string>("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "MEDIUM",
            status: "TODO",
        },
    });
    const priority = watch("priority");
    const status = watch("status");

    const onSubmit = async (data: TaskFormData) => {
        const finalData = {
            ...data,
            id: taskId,
            priority,
            status,
            date: newTaskDate,
            time: newTaskTime || undefined,
        };
        try {
            // Update existing task
            const task = await tasksService.update({ ...finalData });
            updateTask(task);
            reset();
            toast.success("Task updated successfully"); router.push('/dashboard/tasks');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCreate = async () => {
        router.push(`/dashboard/tasks/create`);
    };

    const handleDelete = async (id: string) => {
        try {
            await tasksService.remove(id);
            removeTask(id);
            router.push('/dashboard/tasks');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (!taskId) return;
        tasksService.get(taskId)
            .then((task) => {
                setValue("title", task.title);
                setValue("description", task.description || "");
                setValue("priority", task.priority);
                setValue("status", task.status);
                if (task.date) setNewTaskDate(new Date(task.date));
                if (task.time) setNewTaskTime(task.time);
            })
            .catch((err: any) => {
                toast.error(err.message);
            });
    }, [taskId, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Update Task</CardTitle>
                    <CardDescription>Use the form below to update the task.</CardDescription>
                    <CardAction>
                        <Button variant={"outline"} type="button" onClick={handleCreate}><PlusIcon /> Create New Task</Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Title */}
                    <Label htmlFor="task-title">Title</Label>
                    <Input id="task-title" placeholder="Title of the task" {...register("title")} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                    {/* Description */}
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                        id="task-description"
                        placeholder="Note about the task"
                        {...register("description")}
                        rows={4}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                    {/* Priority */}
                    <Label htmlFor="task-priority">Priority</Label>
                    <small>The priority of the task indicates importance.</small>
                    <Select value={priority}
                        onValueChange={(value) => setValue("priority", value as any, { shouldValidate: true })}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Task Priority</SelectLabel>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}

                    {/* Status */}
                    <Label htmlFor="task-status">Status</Label>
                    <Select value={status}
                        onValueChange={(value) => setValue("status", value as any, { shouldValidate: true })}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Task Status</SelectLabel>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="DONE">Done</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}

                    {/* Date & Time */}
                    <FieldGroup className="max-w-xs flex-row">
                        <Field>
                            <FieldLabel htmlFor="date-picker-optional">Due Date</FieldLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker-optional"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {newTaskDate ? format(newTaskDate, "PPP") : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newTaskDate}
                                        captionLayout="dropdown"
                                        defaultMonth={newTaskDate}
                                        onSelect={(date) => {
                                            setNewTaskDate(date);
                                            setOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>

                        <Field className="w-32">
                            <FieldLabel htmlFor="time-picker-optional">Due Time</FieldLabel>
                            <Input
                                type="time"
                                id="time-picker-optional"
                                step="1"
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                value={newTaskTime}
                                onChange={(e) => setNewTaskTime(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>

                    <div className="flex gap-2">
                        <Button disabled={isSubmitting} type="submit">
                            <Edit /> {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                        {taskId &&
                            <ConfirmButton
                                title="Delete Task"
                                description="Are you sure you want to delete this task?"
                                onClick={() => handleDelete(taskId)}>
                                <Trash /> Delete
                            </ConfirmButton>
                        }
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};
