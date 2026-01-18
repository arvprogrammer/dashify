import {
    Body, Controller, Get, Param, Post,
    Put, Query, Req, Res, UnauthorizedException, UseGuards
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { type User } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService
    ) { }

    @Post('register')
    register(
        @Body() dto: RegisterDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.register(dto, req, res);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(
        @CurrentUser() user: User,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(user, req, res);
    }

    @Post('refresh')
    refresh(
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = res.req.cookies['refresh_token'];

        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        return this.authService.refresh(refreshToken, res);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        const refreshToken = res.req.cookies['refresh_token'];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        this.clearAuthCookies(res);
        return { success: true };
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    async logoutAll(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
        await this.authService.logoutAll(user.id);
        this.clearAuthCookies(res);
        return { success: true };
    }

    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    async getSessions(@CurrentUser() user: User, @Query() query: PaginationQueryDto) {
        const sessions = await this.sessionService.getUserSessions(user.id, query);
        return sessions;
    }

    @Put('revoke/:id')
    @UseGuards(JwtAuthGuard)
    async revoke(@CurrentUser() user: User, @Param('id') id: string) {
        await this.authService.revokeSession(user.id, id);
        return { success: true };
    }

    private clearAuthCookies(res: Response) {
        res.clearCookie('access_token', {
            path: '/',
        });
        res.clearCookie('refresh_token', {
            path: '/',
        });
    }
}
