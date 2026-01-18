import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { User, UserService } from '../user/user.service';
import { SessionService } from './session.service';

export interface AccessPayload {
    sub: string;
    sessionId: string;
    role: string;
}
export interface RefreshPayload {
    sub: string;
    sessionId: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) { }

    async register(dto: { email: string; password: string; name?: string; }, req: Request, res: Response) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (user) {
            throw new BadRequestException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.userService.createUser({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        });

        return this.login(newUser, req, res);
    }

    async login(user: User, req: Request, res: Response) {
        const { refreshToken, session } = await this.sessionService.createSession(
            user.id,
            req.headers['user-agent'] || 'unknown',
            req.ip || 'unknown',
        );
        const accessToken = await this.issueAccessToken({ sub: user.id, sessionId: session.id, role: user.role });
        this.setAuthCookies(res, accessToken, refreshToken);
        return user;
    }

    async refresh(refreshToken: string, res: Response) {
        const session = await this.sessionService.getValidSessionByTokenId(refreshToken);
        if (!session) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.getUserById(session.userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        const { newRefreshToken } = await this.sessionService.rotateRefreshToken(session);
        const newAccessToken = await this.issueAccessToken({ sub: session.userId, sessionId: session.id, role: user.role });
        this.setAuthCookies(res, newAccessToken, newRefreshToken);
        return { success: true };
    }

    async logout(refreshToken: string) {
        const [tokenId] = refreshToken.split('.');

        if (!tokenId) return;

        await this.sessionService.revokeSessionByTokenId(tokenId);
    }

    async logoutAll(userId: string) {
        await this.sessionService.revokeAllSessions(userId);
    }

    async revokeSession(userId: string, sessionId: string) {
        const session = await this.sessionService.getSession(userId, sessionId);
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        await this.sessionService.revokeSessionById(sessionId);
    }

    async issueAccessToken(payload: { sub: string; sessionId: string; role: string; }): Promise<string> {
        const accessToken = await this.jwt.signAsync(payload);
        return accessToken;
    }

    async validateUserCredentials(email: string, password: string) {
        const user = await this.userService.getUserForAuthByEmail(email);

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async verifyUserById(id: string) {
        const user = await this.userService.getUserById(id);

        if (!user) return null;

        return user;
    }

    private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {

        const accessCookieMaxAge = parseInt(process.env.JWT_ACCESS_EXPIRES_MS as string, 10);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: accessCookieMaxAge,
        });

        const refreshCookieMaxAge = parseInt(process.env.JWT_REFRESH_EXPIRES_MS as string, 10);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: refreshCookieMaxAge,
        });
    }
}
