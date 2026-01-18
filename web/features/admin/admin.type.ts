type UserOption = {
    id: string;
    email: string;
    name?: string;
};

type CreateTaskPayload = {
    title: string;
    description?: string;
    userId: string;
    dueDate?: string | null;
};