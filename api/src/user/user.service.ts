import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AdminCreateUserDto } from '../admin/dto/admin-create-user.dto';
import { AdminUpdateUserDto } from '../admin/dto/admin-update-user.dto';
import { SessionService } from '../auth/session.service';
import { paginate } from '../common/utils/pagination';
import { type User as UserType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

export interface User extends Omit<UserType, 'password'> { }

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService,
        private readonly sessionService: SessionService
    ) { }

    async createUser(data: { email: string; password: string; name?: string; }) {
        const user = await this.prisma.user.create({
            data,
        });
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async me(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return null;
        }
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async getUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return null;
        }
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async getUserForAuthByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user;
    }

    async updateProfile(userId: string, dto: UpdateUserDto) {
        const data = { ...dto };

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        const { password: _, ...safeUser } = updatedUser;
        return safeUser;
    }

    async changePassword(userId: string, sessionId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        await this.sessionService.revokeOtherSessions(userId, sessionId);

        return { message: 'Password changed successfully' };
    }

    /**
     * Admin Methods
     */

    async adminCreateUser(dto: AdminCreateUserDto) {
        const user = await this.getUserByEmail(dto.email);
        if (user) {
            throw new BadRequestException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: { ...dto, password: hashedPassword },
        });
    }

    async adminGetAllUsers(query: PaginationQueryDto) {
        const { skip, take } = paginate(query.page, query.limit);
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.user.count(),
        ]);

        return {
            items: items.map((user) => {
                const { password: _, ...safeUser } = user;
                return safeUser;
            }),
            meta: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
                total,
                totalPages: Math.ceil(total / (query.limit ?? 10)),
            },
        };
    }

    async adminSearchUsers(search = '', limit = 10,) {
        return this.prisma.user.findMany({
            ...(search ? {
                where: {
                    OR: [
                        { email: { contains: search, mode: 'insensitive' } },
                        { name: { contains: search, mode: 'insensitive' } },
                    ],
                }
            } : {}),
            orderBy: { createdAt: 'desc' },
            take: limit < 20 ? limit : 20, // max 20
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
    }

    async adminGetUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async adminUpdateUser(id: string, dto: AdminUpdateUserDto & { password?: string; isActive?: boolean; }) {
        const data = { ...dto };

        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { password: _, ...safeUser } = updatedUser;
        return safeUser;
    }

    async adminRemoveUser(id: string) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.createdAt < new Date('2026-02-01')) {
            throw new BadRequestException('Cannot delete demo users');
        }
        await this.prisma.user.delete({ where: { id } });
        return user;
    }
}

