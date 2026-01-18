import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginate } from '../common/utils/pagination';
import { Session } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
    constructor(private readonly prisma: PrismaService) { }

    async createSession(userId: string, userAgent: string, ipAddress: string) {
        const tokenId = crypto.randomUUID();
        const secret = crypto.randomUUID();
        const refreshToken = `${tokenId}.${secret}`;
        const refreshTokenHash = await bcrypt.hash(secret, 10);
        const expiresAt = new Date();
        expiresAt.setMilliseconds(expiresAt.getMilliseconds() + parseInt(process.env.JWT_REFRESH_EXPIRES_MS!));
        const session = await this.prisma.session.create({
            data: {
                userId: userId,
                tokenId,
                refreshTokenHash,
                userAgent: userAgent,
                ipAddress: ipAddress,
                expiresAt,
            },
        });
        return { refreshToken, session };
    }

    async getSession(userId: string, sessionId: string) {
        return this.prisma.session.findFirst({
            where: {
                id: sessionId,
                userId,
            },
        });
    }

    async getValidSessionByTokenId(refreshToken: string) {
        const [tokenId, secret] = refreshToken.split('.');

        if (!tokenId || !secret) {
            throw new UnauthorizedException();
        }

        const session = await this.prisma.session.findUnique({
            where: { tokenId },
        });

        if (
            !session ||
            session.isRevoked ||
            session.expiresAt < new Date()
        ) {
            throw new UnauthorizedException();
        }

        const isValid = await bcrypt.compare(
            secret,
            session.refreshTokenHash,
        );

        if (!isValid) {
            throw new UnauthorizedException();
        }
        return session;
    }

    async rotateRefreshToken(session: Session) {
        const newSecret = crypto.randomUUID();
        const refreshTokenHash = await bcrypt.hash(newSecret, 10);

        await this.prisma.session.update({
            where: { id: session.id },
            data: {
                refreshTokenHash,
            },
        });

        const newRefreshToken = `${session.tokenId}.${newSecret}`;
        return { newRefreshToken };
    }

    async revokeSessionByTokenId(tokenId: string) {
        await this.prisma.session.update({
            where: { tokenId, isRevoked: false },
            data: { isRevoked: true },
        });
    }

    async revokeSessionById(id: string) {
        await this.prisma.session.update({
            where: { id, isRevoked: false },
            data: { isRevoked: true },
        });
    }

    async revokeAllSessions(userId: string) {
        await this.prisma.session.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }

    /**
     * Used to revoke other sessions after changing password
     * @param userId Unique identifier of the user
     * @param currentSessionId Unique identifier of the current session to keep alive
     */
    async revokeOtherSessions(userId: string, currentSessionId: string) {
        await this.prisma.session.updateMany({
            where: {
                userId,
                id: { not: currentSessionId }, // keep current session alive
                isRevoked: false,
            },
            data: { isRevoked: true },
        });
    }

    async getUserSessions(userId: string, query: PaginationQueryDto) {
        const { skip, take } = paginate(query.page, query.limit);
        const [items, total] = await Promise.all([
            this.prisma.session.findMany({
                where: { userId, isRevoked: false },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            this.prisma.session.count({ where: { userId, isRevoked: false } })
        ]);
        return {
            items: items.map((session) => ({
                ...session,
                refreshTokenHash: undefined,
            })),
            meta: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
                total,
                totalPages: Math.ceil(total / (query.limit ?? 10)),
            },
        };
    }

    /*
     * Admin Methods 
     */

    async adminGetUserSessions(userId: string, query: PaginationQueryDto) {
        const { skip, take } = paginate(query.page, query.limit);
        const [items, total] = await Promise.all([
            this.prisma.session.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.session.count({ where: { userId } }),
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

    async adminRevokeAllUserSessions(userId: string) {
        await this.prisma.session.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }

    async adminRevokeUserSession(userId: string, sessionId: string) {
        await this.prisma.session.update({
            where: { userId, id: sessionId, isRevoked: false },
            data: { isRevoked: true },
        });
    }

}