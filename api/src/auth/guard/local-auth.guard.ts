import {
    BadRequestException,
    ExecutionContext,
    ValidationError,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const dto = plainToInstance(LoginDto, request.body);

        const errors = validateSync(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            throw new BadRequestException(this.formatErrors(errors));
        }

        return super.canActivate(context) as boolean;
    }

    private formatErrors(errors: ValidationError[]): string[] {
        return errors.flatMap((error) =>
            Object.values(error.constraints ?? {}).map(
                (message) => `${error.property}: ${message}`,
            ),
        );
    }
}
