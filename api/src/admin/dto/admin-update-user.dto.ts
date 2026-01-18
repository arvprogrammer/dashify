import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateUserDto } from './admin-create-user.dto';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class AdminUpdateUserDto extends PartialType(AdminCreateUserDto) {
    // @IsOptional()
    // @IsString({ message: 'Current password must be a string' })
    // @IsStrongPassword(
    //     {
    //         minLength: 6,
    //         minLowercase: 1,
    //         minUppercase: 0,
    //         minNumbers: 1,
    //         minSymbols: 0,
    //     },
    //     {
    //         message:
    //             'Password length must be at least 6 characters and contain at least one lowercase letter and one number',
    //     },
    // )
    // password?: string;
}