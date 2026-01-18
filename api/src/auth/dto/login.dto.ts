import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword
} from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1, 
        },
        {
            message:
                'Password length must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
        },
    )
    password: string;
}
