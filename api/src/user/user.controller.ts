import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type User, UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: User) {
        return this.userService.me(user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @CurrentUser() user: User,
        @Body() dto: UpdateUserDto,
    ) {
        return this.userService.updateProfile(user.id, dto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @CurrentUser() user: User & { currentSessionId: string; },
        @Body() dto: ChangePasswordDto,
    ) {        
        return this.userService.changePassword(user.id, user.currentSessionId, dto);
    }
}
