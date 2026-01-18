import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { SessionService } from "../auth/session.service";
import { Role, Roles } from "../common/decorators/role.decorator";
import { RolesGuard } from "../common/guard/role.guard";
import { TaskService } from "../task/task.service";
import { UserService } from "../user/user.service";
import { AdminCreateUserDto } from "./dto/admin-create-user.dto";
import { AdminUpdateUserDto } from "./dto/admin-update-user.dto";
import { AdminCreateTaskDto } from "./dto/admin-create-task.dto";
import { AdminUpdateTaskDto } from "./dto/admin-update-task.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly taskService: TaskService,
    ) { }

    /*
     * User Management
     */

    @Post('users')
    createUser(@Body() dto: AdminCreateUserDto) {
        return this.userService.adminCreateUser(dto);
    }

    @Get('users')
    getAllUsers(@Query() query: PaginationQueryDto,
    ) {
        return this.userService.adminGetAllUsers(query);
    }

    @Get('users/search')
    async searchUsers(
        @Query('q') q = '',
        @Query('limit') limit = 10,
    ) {
        const users = await this.userService.adminSearchUsers(q, Number(limit));
        return users;
    }

    @Get('users/:id')
    findOneUser(@Param('id') id: string) {
        return this.userService.adminGetUser(id);
    }

    @Put('users/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() dto: AdminUpdateUserDto,
    ) {
        return this.userService.adminUpdateUser(id, dto);
    }

    @Delete('users/:id')
    async removeUser(@Param('id') id: string) {
        return this.userService.adminRemoveUser(id);
    }

    @Get('users/:id/sessions')
    async getUserSessions(@Param('id') id: string, @Query() query: PaginationQueryDto) {
        const sessions = await this.sessionService.adminGetUserSessions(id, query);
        return sessions;
    }

    @Put('users/:userId/sessions')
    async revokeAllSessions(@Param('userId') userId: string) {
        await this.sessionService.adminRevokeAllUserSessions(userId);
        return { success: true };
    }

    @Put('users/:userId/sessions/:id')
    async revokeSession(@Param('userId') userId: string, @Param('id') id: string) {
        await this.sessionService.adminRevokeUserSession(userId, id);
        return { success: true };
    }

    /*
     * Tasks Management
     */

    @Post('tasks')
    create(@Body() dto: AdminCreateTaskDto) {
        return this.taskService.adminCreateTask(dto);
    }

    @Get('tasks')
    findAllTasks(@Query() query: PaginationQueryDto) {
        return this.taskService.adminGetAllTasks(query);
    }

    @Get('tasks/:id')
    findOne(@Param('id') id: string) {
        return this.taskService.adminGetTask(id);
    }

    @Put('tasks/:id')
    update(
        @Param('id') id: string,
        @Body() dto: AdminUpdateTaskDto,
    ) {
        return this.taskService.adminUpdateTask(id, dto);
    }

    @Delete('tasks/:id')
    remove(@Param('id') id: string) {
        return this.taskService.adminRemoveTaskById(id);
    }
}
