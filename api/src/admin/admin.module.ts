import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';

@Module({
    imports: [AuthModule, UserModule, TaskModule],
    controllers: [AdminController],
})
export class AdminModule { }
