import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AdminModule } from './admin/admin.module';
import { LoggerModule } from 'nestjs-pino/LoggerModule';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                redact: ['req.headers.authorization'],
                transport: process.env.NODE_ENV !== 'production' ? {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                        colorize: true,
                        translateTime: true,
                        ignore: 'pid,hostname',
                    },
                } : undefined,
            },
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        TaskModule,
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
