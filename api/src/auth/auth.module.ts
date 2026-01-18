import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_MS!) / 1000,
            },
        }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        SessionService,
        LocalStrategy,
        JwtStrategy,
        RefreshStrategy,
    ],
    exports: [SessionService],
})
export class AuthModule { }
