import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {
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
                'Current password length must be at least 6 characters and contain at least one lowercase letter and one number',
        },
    )
    currentPassword: string;

    @IsString({ message: 'New password must be a string' })
    @IsNotEmpty({ message: 'New password cannot be empty' })
    @IsStrongPassword(
        {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                'New password length must be at least 6 characters and contain lowercase letters, uppercase letters, numbers and symbols',
        },
    )
    newPassword: string;
}