import { Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TaskStatus } from '../generated/prisma/enums';
import { type User } from '../user/user.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private taskService: TaskService) { }

    @Post()
    create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
        return this.taskService.createTask(user.id, dto);
    }

    @Get()
    findAll(@CurrentUser() user: User,
        @Query() query: PaginationQueryDto,
        @Query('status') status?: TaskStatus,
    ) {
        return this.taskService.getTasks(user.id, query, status);
    }

    @Get(':id')
    findOne(@CurrentUser() user: User, @Param('id') id: string) {
        return this.taskService.getTask(user.id, id);
    }

    @Put(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.taskService.updateTask(user.id, id, dto);
    }

    @Delete(':id')
    remove(@CurrentUser() user: User, @Param('id') id: string) {
        return this.taskService.deleteTask(user.id, id);
    }
}
