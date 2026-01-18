import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '../../generated/prisma/client';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsDateString()
    completedAt?: string | null; // Null for using in task service logic
}
