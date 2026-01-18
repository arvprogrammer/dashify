import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '../generated/prisma/enums';
import { paginate } from 'src/common/utils/pagination';
import { AdminCreateTaskDto } from 'src/admin/dto/admin-create-task.dto';
import { AdminUpdateTaskDto } from 'src/admin/dto/admin-update-task.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async createTask(userId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: { ...dto, userId },
        });
    }

    async getTasks(userId: string, query: PaginationQueryDto, status?: TaskStatus) {
        const { skip, take } = paginate(query.page, query.limit);

        const [items, total] = await Promise.all([
            this.prisma.task.findMany({
                where: { userId, ...(status ? { status } : {}) },
                orderBy: { dueDate: "desc" },
                skip,
                take,
            }),
            this.prisma.task.count({
                where: { userId, ...(status ? { status } : {}) },
            }),
        ]);

        return {
            items,
            meta: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
                total,
                totalPages: Math.ceil(total / (query.limit ?? 10)),
            },
        };
    }

    async getTask(userId: string, taskId: string) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId, userId } });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
        const task = await this.getTask(userId, taskId);
        if (dto.status === 'DONE' && !task.completedAt) {
            dto.completedAt = new Date().toISOString();
        } else {
            dto.completedAt = null;
        }
        return this.prisma.task.update({
            where: { id: task.id },
            data: dto,
        });
    }

    async deleteTask(userId: string, taskId: string) {
        const task = await this.getTask(userId, taskId);
        if (task.createdAt < new Date('2026-02-01')) {
            throw new ForbiddenException('Cannot delete demo task');
        }
        return this.prisma.task.delete({ where: { id: task.id } });
    }

    async deleteTaskById(taskId: string) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new NotFoundException('Task not found');
        if (task.createdAt < new Date('2026-02-01')) {
            throw new ForbiddenException('Cannot delete demo task');
        }
        return this.prisma.task.delete({ where: { id: task.id } });
    }

    /**
     * Admin Methods
     */

    async adminCreateTask(dto: AdminCreateTaskDto) {
        return this.prisma.task.create({
            data: { ...dto },
        });
    }

    async adminGetAllTasks(query: PaginationQueryDto) {
        const { skip, take } = paginate(query.page, query.limit);
        const [items, total] = await Promise.all([
            this.prisma.task.findMany({
                orderBy: { dueDate: "desc" },
                skip,
                take,
                include: { user: true },

            }),
            this.prisma.task.count(),
        ]);

        return {
            items,
            meta: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
                total,
                totalPages: Math.ceil(total / (query.limit ?? 10)),
            },
        };
    }

    async adminGetTask(taskId: string) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async adminUpdateTask(taskId: string, dto: AdminUpdateTaskDto) {
        const task = await this.adminGetTask(taskId);

        if (dto.status === 'DONE' && !task.completedAt) {
            dto.completedAt = new Date().toISOString();
        } else {
            dto.completedAt = null;
        }

        return this.prisma.task.update({
            where: { id: task.id },
            data: dto,
            include: { user: true },
        });
    }

    async adminRemoveTaskById(taskId: string) {
        const task = await this.adminGetTask(taskId);
        if (task.createdAt < new Date('2026-02-01')) {
            throw new ForbiddenException('Cannot delete demo task');
        }
        return this.prisma.task.delete({ where: { id: task.id } });
    }
}
