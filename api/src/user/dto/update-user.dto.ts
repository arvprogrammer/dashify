import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name?: string;
}
