import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateTaskDto } from './admin-create-task.dto';

export class AdminUpdateTaskDto extends PartialType(AdminCreateTaskDto) { }
