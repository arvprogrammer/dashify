import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {
    Logger as PinoLogger,
} from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(PinoLogger));
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: false,
            transformOptions: { enableImplicitConversion: false },
            stopAtFirstError: true,
            forbidNonWhitelisted: false,
        }),
    );
    const port = process.env.PORT ?? 3000;
    await app.listen(port, () => {
        Logger.log(`Server is running on http://localhost:${port}`, 'API');
    });
}
bootstrap();
