import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class AdminCreateUserDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    @IsString({ message: 'Current password must be a string' })
    @IsNotEmpty({ message: 'Current password cannot be empty' })
    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 0, // for demo purposes
            minNumbers: 1,
            minSymbols: 0, // for demo purposes
        },
        {
            message:
                'Password length must be at least 6 characters and contain at least one lowercase letter and one number',
        },
    )
    password: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsEnum(['ADMIN', 'USER'], { message: 'Role must be either ADMIN or USER' })
    role?: 'ADMIN' | 'USER';
}
